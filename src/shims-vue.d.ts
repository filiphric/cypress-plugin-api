declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent;
  export default component;
}

declare module '*.css';
declare module '*.css?inline' {
  const css: string;
  export default css;
}
