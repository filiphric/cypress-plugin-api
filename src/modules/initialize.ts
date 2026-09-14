import { getState } from '@utils/getState'
import { getPluginConfig } from '@utils/pluginConfig'
import { shouldRenderUi } from '@utils/shouldRenderUi'
import { RequestProps } from "../types"
import { reactive, createApp } from "vue"
import App from "../components/App.vue";
import { mountPlugin } from "./mountPlugin";
const { _ } = Cypress

let currentMountRoot: Element | null = null
let currentApp: ReturnType<typeof createApp> | null = null

export const initialize = () => {

  const propItem: RequestProps = {
    id: _.uniqueId(),
    method: 'GET',
    status: '',
    time: 0,
    size: '',
    url: '',
    auth: {
      body: {},
      formatted: ''
    },
    query: {
      body: {},
      formatted: ''
    },
    requestHeaders: {
      body: {},
      formatted: ''
    },
    requestBody: {
      body: {},
      formatted: ''
    },
    responseBody: {
      body: {},
      formatted: ''
    },
    responseHeaders: {
      body: {},
      formatted: ''
    },
    cookies: {
      body: {}
    }
  }

  const { doc, attempt, testId } = getState()

  const isRetry = attempt !== 0
  const hasNavigated = doc.URL !== 'about:blank'

  const propsExist = window.props[testId]?.length ? true : false

  const currentProps: RequestProps[] = propsExist && !isRetry ? window.props[testId] : [] as RequestProps[]

  currentProps.push(propItem)

  const props = reactive(currentProps)

  if (isRetry) {
    if (window.props[testId]) {
      delete window.props[testId]
    }
    if (currentApp) {
      currentApp.unmount()
      currentApp = null
    }
    if (currentMountRoot) {
    currentMountRoot.remove()
    currentMountRoot = null
    }
  }

  // Skip the expensive Vue app entirely when the UI is disabled (e.g. run mode).
  // The request still runs and is logged; only the heavy DOM rendering is avoided.
  if (!shouldRenderUi()) {
    return { app: null, props }
  }

  const app = createApp(App, {
    props: props
  })

  currentApp = app

  if (!propsExist || isRetry || getPluginConfig('snapshotOnly') || hasNavigated) {
    currentMountRoot = mountPlugin(app)
  }

  return { app, props }

}