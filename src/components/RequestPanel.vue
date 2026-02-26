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
      @click="selectedTab = 'query'"
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
      @click="selectedTab = 'requestHeaders'"
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
      @click="selectedTab = 'auth'"
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
      @click="selectedTab = 'requestBody'"
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
      @click.stop="selectedTab = 'curl'"
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
const lastItemId = ref<string | null>(null)
const root = ref<HTMLElement | null>(null)
let highlightObserver: MutationObserver | null = null

const curlFormatted = computed(() => {
  if (!props.item) return ''
  const curl = generateCurl(props.item)
  return curl ? transform(curl, 'plaintext') : ''
})

const hasContent = (obj: unknown): boolean => {
  if (!obj) return false
  if (typeof obj !== 'object') return true
  if (Array.isArray(obj)) return obj.length > 0
  return Object.keys(obj as object).length > 0
}

const initializeTab = () => {
  const item = props.item
  if (!item) return

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
    initializeTab()
  }
}, { immediate: true })

watch(() => [
  props.item?.query?.formatted,
  props.item?.requestHeaders?.formatted,
  props.item?.auth?.formatted,
  props.item?.requestBody?.formatted
], () => {
  if (props.item?.id) initializeTab()
}, { deep: false })

onMounted(() => {
  if (props.item?.id && props.item.id !== lastItemId.value) {
    lastItemId.value = props.item.id
    initializeTab()
  }

  if (typeof window !== 'undefined' && typeof MutationObserver !== 'undefined') {
    const checkAndUpdateTab = () => {
      if (!root.value) return
      const section = root.value.closest('section') as HTMLElement | null
      if (!section?.classList.contains('__cypress-highlight')) return
      initializeTab()
    }

    highlightObserver = new MutationObserver(() => {
      if (!root.value) return
      const section = root.value.closest('section') as HTMLElement | null
      if (!section) return
      checkAndUpdateTab()
      setTimeout(checkAndUpdateTab, 10)
    })

    highlightObserver.observe(document.body, {
      attributes: true,
      subtree: true,
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
</script>
