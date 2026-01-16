import { App } from "vue";
import { addStyles } from "./addStyles";
import { getState } from "../utils/getState";

export const mountPlugin = (app: App<Element>): Element => {

  const { doc } = getState()
  addStyles()

  const root = doc.createElement('div');
  root.setAttribute('id', 'api-plugin-root')
  doc.body.appendChild(root);

  app.mount(root)
  
  return root

}