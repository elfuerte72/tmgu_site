declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    OPENAI_API_KEY: string;
    DATABASE_URL: string;
    PORT: string;
    API_PORT: string;
  }
} 