/**
 * Types for the experimental Chrome Built-in AI (Prompt API).
 * @see https://developer.chrome.com/docs/ai/built-in
 */

export type AICapabilityAvailability = 'available' | 'unavailable' | 'downloadable' | 'downloading';

export interface AILanguageModelCapabilities {
  readonly availability: AICapabilityAvailability;
  readonly defaultTopK: number;
  readonly maxTopK: number;
  readonly defaultTemperature: number;
}

export interface AILanguageModelCreateOptions {
  systemPrompt?: string;
  initialPrompts?: { role: 'system' | 'user' | 'assistant'; content: string }[];
  topK?: number;
  temperature?: number;
  signal?: AbortSignal;
  monitor?: (m: any) => void;
}

export interface AILanguageModelPromptOptions {
  signal?: AbortSignal;
}

export interface AILanguageModel {
  prompt(input: string, options?: AILanguageModelPromptOptions): Promise<string>;
  promptStreaming(input: string, options?: AILanguageModelPromptOptions): ReadableStream<string>;
  countTokens(input: string, options?: AILanguageModelPromptOptions): Promise<number>;
  destroy(): void;
}

export interface AILanguageModelFactory {
  availability(options?: { languages?: string[] }): Promise<AICapabilityAvailability>;
  capabilities(): Promise<AILanguageModelCapabilities>;
  create(options?: AILanguageModelCreateOptions): Promise<AILanguageModel>;
}

declare global {
  interface Window {
    LanguageModel: AILanguageModelFactory;
    ai?: {
      languageModel: AILanguageModelFactory;
    };
  }
  const LanguageModel: AILanguageModelFactory;
}
