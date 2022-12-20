import base from "../style.css";
import timeline from "../timeline.css";
import { getState } from "../utils/getState";

export const addStyles = () => {

  const { doc } = getState()
  // append styles
  const head = doc.head || doc.getElementsByTagName('head')[0]

  // add plugin styles
  const style = doc.createElement('style');
  style.setAttribute('id', 'api-plugin-styles')
  head.appendChild(style);
  style.appendChild(doc.createTextNode(base));

  // add timeline styles
  const reporterEl = top?.document.querySelector('#unified-reporter') || top?.document.querySelector('#app')
  const reporterStyleEl = document.createElement('style')
  reporterEl?.appendChild(reporterStyleEl)
  reporterStyleEl.appendChild(doc.createTextNode(timeline));

}