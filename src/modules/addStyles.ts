import base from "../style.css";
import timeline from "../timeline.css";
import { getDoc } from "../utils/getDoc";

export const addStyles = () => {

  const doc = getDoc()
  // append styles
  const head = doc.head || doc.getElementsByTagName('head')[0]

  const style = doc.createElement('style');
  head.appendChild(style);
  style.appendChild(doc.createTextNode(base));

  const reporterEl = top?.document.querySelector('#unified-reporter') || top?.document.querySelector('#app')
  const reporterStyleEl = document.createElement('style')
  reporterEl?.appendChild(reporterStyleEl)
  reporterStyleEl.appendChild(doc.createTextNode(timeline));

}