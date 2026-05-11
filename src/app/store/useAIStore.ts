import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AICapabilityAvailability, AILanguageModel } from '../types/ai';
import { SYSTEM_PROMPT, AI_GREETING } from '../constants/ai';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  id?: string;
}

interface AIState {
  messages: Message[];
  aiStatus: AICapabilityAvailability | 'checking';
  isThinking: boolean;
  isGenerating: boolean;
  downloadProgress: number;

  // Actions
  initAI: () => Promise<void>;
  handleSend: (input: string, context?: string) => Promise<void>;
  handleStop: () => void;
  handleDownload: (context?: string) => Promise<void>;
  clearChat: () => void;
  setMessages: (messages: Message[]) => void;
}

let session: AILanguageModel | null = null;
let abortController: AbortController | null = null;

const DEFAULT_MESSAGES: Message[] = [
  { role: 'assistant', content: 'Checking AI model availability...' },
];

/**
 * Helper to create a session with initial context.
 */
async function createAISession(
  LLM: any,
  signal?: AbortSignal,
  context?: string,
  onProgress?: (e: any) => void,
) {
  const initialPrompts: any[] = [
    {
      role: 'system',
      content: SYSTEM_PROMPT + (context ? `\n\nPORTFOLIO CONTEXT:\n${context}` : ''),
    },
  ];

  const options: any = {
    initialPrompts,
    signal,
  };

  if (onProgress) {
    options.monitor = (m: any) => {
      m.addEventListener('downloadprogress', onProgress);
    };
  }

  return await LLM.create(options);
}

/**
 * Defines which parts of the AIState should be persisted to localStorage.
 */
const getPersistentAIState = (state: AIState) => ({
  messages: state.messages,
});

export const useAIStore = create<AIState>()(
  persist(
    (set, get) => ({
      messages: DEFAULT_MESSAGES,
      aiStatus: 'checking',
      isThinking: false,
      isGenerating: false,
      downloadProgress: 0,

      setMessages: (messages) => {
        set({ messages });
      },

      initAI: async () => {
        try {
          const LLM = window.LanguageModel || window.ai?.languageModel;
          if (!LLM) {
            set({ aiStatus: 'unavailable' });
            if (get().messages.length <= 1) {
              get().setMessages([
                {
                  role: 'assistant',
                  content:
                    "This feature uses Google's Gemini Nano API. Please use an up-to-date version of Chrome and enable the experimental flags to access it.",
                },
              ]);
            }
            return;
          }

          const status = await LLM.availability();
          set({ aiStatus: status });

          if (status === 'unavailable') {
            if (get().messages.length <= 1) {
              get().setMessages([
                {
                  role: 'assistant',
                  content:
                    "Your device does not currently support Chrome's Gemini Nano AI model (insufficient hardware or disabled flags).",
                },
              ]);
            }
          } else if (status === 'available') {
            if (get().messages.length <= 1) {
              get().setMessages([
                {
                  role: 'assistant',
                  content: AI_GREETING,
                },
              ]);
            }
          } else if (status === 'downloadable') {
            if (get().messages.length <= 1) {
              get().setMessages([
                {
                  role: 'assistant',
                  content:
                    'Gemini Nano is supported on your device, but the LLM (gemma-2b-it-gpu-int4.bin) needs to be downloaded first (~1.35 GB).',
                },
              ]);
            }
          } else if (status === 'downloading') {
            if (get().messages.length <= 1) {
              get().setMessages([
                {
                  role: 'assistant',
                  content: 'Model download is currently in progress in the background...',
                },
              ]);
            }
          }
        } catch (e: any) {
          console.error('Failed to initialize AI:', e);
          set({ aiStatus: 'unavailable' });
          if (get().messages.length <= 1) {
            get().setMessages([
              {
                role: 'assistant',
                content: `Failed to initialize session with Gemini Nano: ${e.message}.`,
              },
            ]);
          }
        }
      },

      handleSend: async (input: string, context?: string) => {
        const userMsg = input.trim();
        if (!userMsg) return;

        if (get().isGenerating) return;

        const currentMessages = get().messages;
        const newMessages: Message[] = [...currentMessages, { role: 'user', content: userMsg }];
        get().setMessages(newMessages);

        set({ isThinking: true, isGenerating: true });

        const assistantMsgId = crypto.randomUUID();

        // Abort any existing request before starting a new one
        if (abortController) {
          abortController.abort();
        }

        abortController = new AbortController();
        const signal = abortController.signal;

        try {
          const LLM = window.LanguageModel || window.ai?.languageModel;
          if (!LLM) throw new Error('Not Supported');

          if (!session) {
            session = await createAISession(LLM, signal, context);
          }

          if (!session) {
            throw new Error('Failed to create AI session');
          }

          const stream = session.promptStreaming(userMsg, {
            signal,
          }) as unknown as AsyncIterable<string>;
          let fullResponse = '';
          let isFirstChunk = true;

          for await (const chunk of stream) {
            if (isFirstChunk) {
              set({ isThinking: false });
              const messagesWithAssistant: Message[] = [
                ...get().messages,
                { role: 'assistant', content: '', id: assistantMsgId },
              ];
              set({ messages: messagesWithAssistant });
              isFirstChunk = false;
            }

            // Handle both cumulative and incremental chunks (API behavior varies)
            const newText = chunk.startsWith(fullResponse)
              ? chunk.slice(fullResponse.length)
              : chunk;
            fullResponse += newText;

            set((state) => ({
              messages: state.messages.map((msg) =>
                msg.id === assistantMsgId ? { ...msg, content: fullResponse } : msg,
              ),
            }));
          }

          if (isFirstChunk) {
            const errorMsg = 'No response generated.';
            set((state) => ({
              messages: [...state.messages, { role: 'assistant', content: errorMsg }],
            }));
          }
        } catch (e: any) {
          if (e.name === 'AbortError' || e.message === 'Aborted') {
            console.log('Stream aborted');
          } else {
            console.error(e);
            const errorMsg =
              e.message === 'Not Supported'
                ? 'LanguageModel is undefined. The browser is blocking the Built-in AI API.'
                : `An error occurred: ${e.message || 'Model not ready.'}`;

            set((state) => ({
              messages: state.messages.map((m) =>
                m.id === assistantMsgId ? { ...m, content: errorMsg } : m,
              ),
            }));
          }
        } finally {
          set({ isThinking: false, isGenerating: false });
          abortController = null;
        }
      },

      handleStop: () => {
        if (abortController) {
          abortController.abort();
          abortController = null;
        }
        set({ isThinking: false, isGenerating: false });
      },

      handleDownload: async (context?: string) => {
        set({ aiStatus: 'downloading', downloadProgress: 0 });
        try {
          const LLM = window.LanguageModel || window.ai?.languageModel;
          if (!LLM) throw new Error('Not Supported');

          // Clear existing session if any
          if (session) {
            session.destroy();
            session = null;
          }

          session = await createAISession(LLM, undefined, context, (e: any) => {
            if (e.total) {
              set({ downloadProgress: (e.loaded / e.total) * 100 });
            } else {
              set({ downloadProgress: e.loaded > 1 ? 50 : e.loaded * 100 });
            }
          });

          set({ aiStatus: 'available' });
          get().setMessages([
            ...get().messages,
            {
              role: 'assistant',
              content: `Download complete! ${AI_GREETING}`,
            },
          ]);
        } catch (e: any) {
          console.error(e);
          set({ aiStatus: 'unavailable' });
          get().setMessages([
            ...get().messages,
            { role: 'assistant', content: `An error occurred during the download: ${e.message}` },
          ]);
        }
      },

      clearChat: () => {
        if (abortController) {
          abortController.abort();
          abortController = null;
        }
        if (session) {
          session.destroy();
          session = null;
        }
        const defaultMsg: Message = {
          role: 'assistant',
          content: AI_GREETING,
        };
        get().setMessages([defaultMsg]);
      },
    }),
    {
      name: 'stxgao-ai-session',
      partialize: getPersistentAIState,
    },
  ),
);
