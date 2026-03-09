<template>
  <div
    ref="root"
    data-cy="requestPanel"
    class="col-span-1"
  >
    <Title
      :method="item?.method"
      :url="item?.url"
    />
    <input
      :id="'query' + index"
      type="radio"
      class="hidden invisible"
      :name="'req' + index"
      data-cy="showQuery"
      :checked="selectedTab === 'query'"
    >
    <label
      v-show="item?.query.body"
      class="pr-3 pl-1 cursor-pointer text-cy-gray select-none"
      :for="'query' + index"
      @click="handleTabClick('query')"
    >
      Query
    </label>
    <input
      :id="'requestHeaders' + index"
      type="radio"
      class="hidden invisible"
      :name="'req' + index"
      data-cy="showRequestHeaders"
      :checked="selectedTab === 'requestHeaders'"
    >
    <label
      v-show="item?.requestHeaders.body"
      class="pr-4 pl-1 cursor-pointer text-cy-gray select-none"
      :for="'requestHeaders' + index"
      @click="handleTabClick('requestHeaders')"
    >
      Headers
    </label>
    <input
      :id="'auth' + index"
      type="radio"
      class="hidden invisible"
      :name="'req' + index"
      data-cy="showAuth"
      :checked="selectedTab === 'auth'"
    >
    <label
      v-show="item?.auth.body"
      class="pr-3 pl-1 cursor-pointer text-cy-gray select-none"
      :for="'auth' + index"
      @click="handleTabClick('auth')"
    >
      Auth
    </label>
    <input
      :id="'requestBody' + index"
      type="radio"
      class="hidden invisible"
      :name="'req' + index"
      data-cy="showRequestBody"
      :checked="selectedTab === 'requestBody'"
    >
    <label
      v-show="item?.requestBody.body || (!item?.auth.body && !item?.requestHeaders.body && !item?.query.body)"
      class="pr-3 pl-1 cursor-pointer text-cy-gray select-none"
      :for="'requestBody' + index"
      @click="handleTabClick('requestBody')"
    >
      Body
    </label>
    <input
      :id="'curl' + index"
      type="radio"
      class="hidden invisible"
      :name="'req' + index"
      data-cy="showCurl"
      :checked="selectedTab === 'curl'"
    >
    <label
      class="pr-3 pl-1 cursor-pointer text-cy-gray select-none"
      :for="'curl' + index"
      data-cy="curl-tab"
      @click.stop="handleCurlTabClick"
    >
      cURL
    </label>

    <CodeBlock
      :data-formatted="item?.auth.formatted"
      selector="auth"
    />
    <CodeBlock
      :data-formatted="item?.query.formatted"
      selector="query"
    />
    <CodeBlock
      :data-formatted="item?.requestHeaders.formatted"
      selector="requestHeaders"
    />
    <CodeBlock
      :data-formatted="item?.requestBody.formatted"
      selector="requestBody"
    />
    <CodeBlock
      :data-formatted="curlFormatted"
      selector="curl"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, type PropType } from 'vue'
import Title from './TitlePanel.vue'
import CodeBlock from './CodeBlock.vue'
import type { RequestProps } from '../types'
import { generateCurl } from '../utils/generateCurl'
import { transform } from '../modules/transform'

const props = defineProps({
  item: {
    type: Object as PropType<RequestProps>
  },
  index: {
    type: [Number, String]
  }
})

const selectedTab = ref<string>('requestBody')
const userSelectedTab = ref(false)
const lastItemId = ref<string | null>(null)
const root = ref<HTMLElement | null>(null)
let highlightObserver: MutationObserver | null = null

const curlText = computed(() => {
  if (!props.item) return ''
  return generateCurl(props.item)
})

const curlFormatted = computed(() => {
  if (!props.item) return ''
  const curl = curlText.value
  if (!curl) return ''
  return transform(curl, 'plaintext')
})

const initializeTab = () => {
  const item = props.item
  if (!item) return

  const hasContent = (obj: unknown): boolean => {
    if (!obj) return false
    if (typeof obj !== 'object') return true
    if (Array.isArray(obj)) return obj.length > 0

    if (obj instanceof ArrayBuffer) return obj.byteLength > 0
    if (obj instanceof Blob) return obj.size > 0
    if (obj instanceof FormData) {
      let hasEntries = false
      obj.forEach(() => { hasEntries = true })
      return hasEntries
    }
    if (obj instanceof Uint8Array || obj instanceof Uint16Array || obj instanceof Uint32Array) {
      return obj.length > 0
    }

    return Object.keys(obj as object).length > 0
  }

  const hasQuery = hasContent(item.query?.body) && item.query?.formatted
  const hasHeaders = hasContent(item.requestHeaders?.body) && item.requestHeaders?.formatted
  const hasAuth = hasContent(item.auth?.body) && item.auth?.formatted
  const hasBody = hasContent(item.requestBody?.body) && item.requestBody?.formatted

  if (hasQuery && !hasBody) {
    selectedTab.value = 'query'
  } else if (hasHeaders && !hasBody && !hasQuery && !hasAuth) {
    selectedTab.value = 'requestHeaders'
  } else if (hasAuth && !hasBody && !hasQuery) {
    selectedTab.value = 'auth'
  } else {
    selectedTab.value = 'requestBody'
  }
}

watch(() => props.item?.id, (newId) => {
  if (newId && newId !== lastItemId.value) {
    lastItemId.value = newId
    selectedTab.value = 'requestBody'
    userSelectedTab.value = false
    initializeTab()
  }
}, { immediate: true })

watch(() => [
  props.item?.query?.formatted,
  props.item?.requestHeaders?.formatted,
  props.item?.auth?.formatted,
  props.item?.requestBody?.formatted
], () => {
  if (!props.item?.id) return
  if (userSelectedTab.value) return
  initializeTab()
}, { deep: false })

onMounted(() => {
  if (props.item?.id && props.item.id !== lastItemId.value) {
    lastItemId.value = props.item.id
    initializeTab()
  }

  if (typeof window !== 'undefined' && typeof MutationObserver !== 'undefined') {
    const section = root.value?.closest('section') as HTMLElement | null
    if (!section) return

    const checkAndUpdateTab = () => {
      if (section.classList.contains('__cypress-highlight') && !userSelectedTab.value) {
        initializeTab()
      }
    }

    highlightObserver = new MutationObserver(() => {
      checkAndUpdateTab()
      setTimeout(checkAndUpdateTab, 10)
    })

    highlightObserver.observe(section, {
      attributes: true,
      attributeFilter: ['class']
    })
  }
})

onUnmounted(() => {
  if (highlightObserver) {
    highlightObserver.disconnect()
    highlightObserver = null
  }
})

const handleTabClick = (tab: string) => {
  userSelectedTab.value = true
  selectedTab.value = tab
}

const handleCurlTabClick = (event: MouseEvent) => {
  event.stopPropagation()
  event.stopImmediatePropagation()
  handleTabClick('curl')
}
</script>
