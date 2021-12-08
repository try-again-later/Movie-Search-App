declare module '*.scss';

declare namespace NodeJS {
  interface ProcessEnv {
    PUBLIC_URL: string;
    ROUTER_BASE: string;
  }
}
