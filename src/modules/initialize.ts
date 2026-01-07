import { getState } from '@utils/getState'
import { RequestProps } from "../types"
import { reactive, createApp } from "vue"
import App from "../components/App.vue";
import { mountPlugin } from "./mountPlugin";
const { _ } = Cypress

// Store the current mount root element and app instance so we can clean it up on retry
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

  // get the number of retry, 0 if first attempt
  const isRetry = attempt !== 0
  const hasNavigated = doc.URL !== 'about:blank'

  // determine if there are props from the same test but previous cy.api() call
  const propsExist = window.props[testId]?.length ? true : false

  // initialize an empty array for current test if this is a first call of cy.api() in current test
  const currentProps: RequestProps[] = propsExist && !isRetry ? window.props[testId] : [] as RequestProps[]

  // add empty props object to be filled in upcoming call
  currentProps.push(propItem)

  // load props saved into window if any present in current test
  const props = reactive(currentProps)

  // Clean up previous mount on retry to avoid DOM accumulation
  if (isRetry) {
    // Clear window props for this test to start fresh
    if (window.props[testId]) {
      delete window.props[testId]
    }
    // Unmount previous Vue app if it exists
    if (currentApp) {
      currentApp.unmount()
      currentApp = null
    }
    // Remove previous mount root element
    if (currentMountRoot) {
      currentMountRoot.remove()
      currentMountRoot = null
    }
  }

  const app = createApp(App, {
    props: props
  })

  // Store app instance for cleanup on retry
  currentApp = app

  // mount plugin only on first call in the test, on retry, or when we left the initial page with cy.visit()
  if (!propsExist || isRetry || Cypress.env('snapshotOnly') || hasNavigated) {
    currentMountRoot = mountPlugin(app)
  }

  return { app, props }

}