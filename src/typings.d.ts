/// <reference types="vite-plugin-svgr/client" />

declare module '*.scss' {
    const content: Record<string, string>;
    export default content;
}
