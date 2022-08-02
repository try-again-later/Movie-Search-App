declare module '*.scss';

declare namespace NodeJS {
  interface ProcessEnv {
    PUBLIC_URL: string | undefined;
    ROUTER_BASE: string | undefined;
    NODE_ENV: 'production' | 'development' | undefined;
  }
}
