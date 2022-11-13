import { App } from "vue";
import { addStyles } from "./addStyles";
import { getDoc } from "../utils/getDoc";

export const mountPlugin = (app: App<Element>) => {

  const doc = getDoc()
  addStyles()

  // create an element where our plugin will mount
  const root = doc.createElement('div');
  root.setAttribute('id', 'api-plugin-root')
  doc.body.appendChild(root);

  const plugin = doc.getElementById('api-plugin-root')
  app.mount(plugin as Element)

}