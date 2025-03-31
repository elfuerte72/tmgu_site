/**
 * Основные типы данных для компонентов и страниц
 */

export type SectionType = {
  id: string;
  title: string;
  subtitle?: string;
}

export type HistoryEventType = {
  year: string;
  description: string;
}

export type AcademicProgramType = {
  title: string;
  items: string[];
}

export type ResearchAreaType = {
  title: string;
  description: string;
}

export type ContactInfoType = {
  address: string;
  phone: string;
  email: string;
  social: {
    name: string;
    url: string;
  }[];
}

export type UniversityDataType = {
  name: string;
  motto: string;
  history: {
    intro: string;
    events: HistoryEventType[];
  };
  academicPrograms: AcademicProgramType[];
  research: {
    intro: string;
    areas: string[];
  };
  studentLife: {
    intro: string;
    facts: string[];
  };
  international: {
    intro: string;
    facts: string[];
  };
  publications: {
    intro: string;
    items: string[];
  };
  contacts: ContactInfoType;
}

/**
 * Типы для интеграции с OpenAI и Tavily
 */

// Определяем типы для работы с OpenAI Chat API
export type ChatMessageRole = 'user' | 'assistant' | 'system' | 'function';

export interface ChatMessage {
  role: ChatMessageRole;
  content: string | null;
  name?: string;
  function_call?: {
    name: string;
    arguments: string;
  };
  tool_calls?: Array<{
    id: string;
    type: 'function';
    function: {
      name: string;
      arguments: string;
    }
  }>;
}

export interface FunctionDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
}

export interface TavilySearchRequest {
  api_key: string;
  query: string;
  include_answers: boolean;
  max_results: number;
}

export interface TavilySearchResult {
  url: string;
  title: string;
  content?: string;
  snippet: string;
}

export interface TavilySearchResponse {
  answer?: string;
  results: TavilySearchResult[];
} 