import base from "../style.css?inline";
import timeline from "../timeline.css?inline";

export const PLUGIN_STYLE_ID = 'api-plugin-styles'
const TIMELINE_STYLE_ID = 'api-plugin-timeline-styles'
const STYLE_OWNER_ATTRIBUTE = 'data-cypress-plugin-api-style'

export const getPluginStyle = (doc: Document, id: string) => {
  return Array.from(doc.querySelectorAll('style')).find((style) => {
    return style.id === id && style.getAttribute(STYLE_OWNER_ATTRIBUTE) === 'true'
  })
}

const injectStyles = (doc: Document, id: string, styles: string) => {
  if (getPluginStyle(doc, id)) return

  const style = doc.createElement('style')
  style.id = id
  style.setAttribute(STYLE_OWNER_ATTRIBUTE, 'true')
  style.textContent = styles
  doc.head.appendChild(style)
}

export const addStyles = (doc: Document) => {
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
