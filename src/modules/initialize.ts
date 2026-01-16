import { getState } from '@utils/getState'
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

  const app = createApp(App, {
    props: props
  })

  currentApp = app

  if (!propsExist || isRetry || Cypress.env('snapshotOnly') || hasNavigated) {
    currentMountRoot = mountPlugin(app)
  }

  return { app, props }

}