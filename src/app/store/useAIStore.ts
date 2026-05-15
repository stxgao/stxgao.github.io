import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  AICapabilityAvailability,
  AILanguageModel,
  AILanguageModelFactory,
  AILanguageModelCreateOptions,
} from '../types/ai';
import { SYSTEM_PROMPT, AI_GREETING, FEW_SHOT_EXAMPLES } from '../constants/ai';

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
  initAI: (isMobile?: boolean) => Promise<void>;
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
  LLM: AILanguageModelFactory,
  signal?: AbortSignal,
  context?: string,
  onProgress?: (e: any) => void,
  previousMessages: Message[] = [],
): Promise<AILanguageModel> {
  // Best Practice: Embed examples directly into the system block to prevent
  // the model from treating them as active conversation history.
  const examplesBlock = FEW_SHOT_EXAMPLES.map(
    (ex) => `[${ex.role.toUpperCase()} EXAMPLE]\n${ex.content}`,
  ).join('\n\n');

  const consolidatedSystemPrompt = `${SYSTEM_PROMPT}\n\n### PORTFOLIO CONTEXT\n${context || 'No specific portfolio context provided.'}\n\n### FEW-SHOT EXAMPLES\n${examplesBlock}`;

  const initialPrompts: AILanguageModelCreateOptions['initialPrompts'] = [
    {
      role: 'system',
      content: consolidatedSystemPrompt,
    },
    ...previousMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
  ];

  const options: AILanguageModelCreateOptions = {
    initialPrompts,
    signal,
  };

  if (onProgress) {
    options.monitor = (m: any) => {
      m.addEventListener('downloadprogress', onProgress);
    };
  }

  try {
    return await LLM.create(options);
  } catch (e: any) {
    if (e.name === 'QuotaExceededError' || (e.message && e.message.includes('Quota'))) {
      console.warn('Context window exceeded, retrying with essential context...');

      // Isolate high-signal documents for essential context fallback
      const homeMatch = context?.match(/<document name="home\.md">[\s\S]*?<\/document>/);
      const overviewMatch = context?.match(/<document name="overview\.md">[\s\S]*?<\/document>/);
      const readmeMatch = context?.match(/<document name="README\.md">[\s\S]*?<\/document>/);

      const essentialContext = [homeMatch?.[0], overviewMatch?.[0], readmeMatch?.[0]]
        .filter(Boolean)
        .join('\n\n');

      const retrySystemPrompt = `${SYSTEM_PROMPT}\n\n### PORTFOLIO CONTEXT (ESSENTIAL)\n${essentialContext}\n\n### FEW-SHOT EXAMPLES\n${examplesBlock}`;

      if (options.initialPrompts && options.initialPrompts[0]) {
        options.initialPrompts[0].content = retrySystemPrompt;
      }

      return await LLM.create(options);
    }
    throw e;
  }
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

      initAI: async (isMobile?: boolean) => {
        try {
          if (isMobile) {
            set({ aiStatus: 'unavailable' });
            if (get().messages.length <= 1) {
              get().setMessages([
                {
                  role: 'assistant',
                  content:
                    "Chrome's built-in **Gemini Nano** AI is currently optimized for desktop environments. Launch this application from a desktop browser to engage with the on-device AI Assistant.",
                },
              ]);
            }
            return;
          }

          const LLM = window.LanguageModel || window.ai?.languageModel;
          if (!LLM) {
            set({ aiStatus: 'unavailable' });
            if (get().messages.length <= 1) {
              get().setMessages([
                {
                  role: 'assistant',
                  content:
                    "This AI Assistant leverages Chrome's built-in **Gemini Nano** AI for local, on-device inference. Since this is an experimental feature, it needs to be enabled manually via browser flags. [See the setup guide here](https://developer.chrome.com/docs/ai/get-started).",
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
                    'Gemini Nano AI: **Offline**. The device or requested session configuration is not supported at this moment. This usually resolves after a browser restart or component update in `chrome://components`.',
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
                    'Environment validated for **Gemini Nano** AI. To create an active session, the browser must provision additional assets, including the base LLM and fine-tuning weights. Provision the **Gemini Nano** AI below to begin.',
                },
              ]);
            }
          } else if (status === 'downloading') {
            if (get().messages.length <= 1) {
              get().setMessages([
                {
                  role: 'assistant',
                  content:
                    'Provisioning **Gemini Nano** model weights. Once finished, Chrome will use your device to handle AI inference locally.',
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

        const assistantMsgId = crypto.randomUUID();
        const currentMessages = get().messages;
        const newMessages: Message[] = [
          ...currentMessages,
          { role: 'user', content: userMsg },
          { role: 'assistant', content: '', id: assistantMsgId },
        ];
        get().setMessages(newMessages);

        set({ isThinking: true, isGenerating: true });

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
            session = await createAISession(LLM, signal, context, undefined, currentMessages);
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
          try {
            session.destroy();
          } catch (e) {
            console.warn('Failed to destroy AI session:', e);
          }
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
