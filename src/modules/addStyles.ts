import base from "../style.css?inline";
import timeline from "../timeline.css?inline";
import { getState } from "../utils/getState";

const PLUGIN_STYLE_ID = 'api-plugin-styles'
const TIMELINE_STYLE_ID = 'api-plugin-timeline-styles'

const injectStyles = (doc: Document, id: string, styles: string) => {
  if (doc.getElementById(id)) return

  const style = doc.createElement('style')
  style.id = id
  style.textContent = styles
  doc.head.appendChild(style)
}

export const addStyles = () => {
  const { doc } = getState()
  injectStyles(doc, PLUGIN_STYLE_ID, base)

  const topDoc = top?.document
  if (!topDoc) return

  // Keep this in the parent head so Cypress can clone it when the reporter mounts.
  injectStyles(topDoc, TIMELINE_STYLE_ID, timeline)

  const reporterFrame = topDoc.querySelector('#reporter-frame') as HTMLIFrameElement | null
  if (reporterFrame?.contentDocument) {
    injectStyles(reporterFrame.contentDocument, TIMELINE_STYLE_ID, timeline)
  }
}
