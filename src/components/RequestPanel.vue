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
      :id="'copyCurl' + index"
      type="radio" 
      class="hidden invisible" 
      :name="'req' + index" 
      data-cy="showCopyCurl"
      :checked="selectedTab === 'copyCurl'"
    >
    <label 
      class="pr-3 pl-1 cursor-pointer text-cy-gray select-none"
      :for="'copyCurl' + index"
      @click.stop="handleCopyCurlTabClick"
      data-cy="copy-curl-tab"
    >
      Copy cURL
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
      selector="copyCurl"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import Title from "./TitlePanel.vue";
import CodeBlock from "./CodeBlock.vue";

const props = defineProps({
  item: {
    type: Object
  },
  index: {
    type: [Number, String]
  }
})

import { generateCurl } from '../utils/generateCurl';
import { transform } from '../modules/transform';

const selectedTab = ref<string>('requestBody');
const lastItemId = ref<string | null>(null);
const root = ref<HTMLElement | null>(null);
let highlightObserver: MutationObserver | null = null;

const curlText = computed(() => {
  if (!props.item) {
    return '';
  }
  return generateCurl(props.item);
});

const curlFormatted = computed(() => {
  if (!props.item) {
    return '';
  }
  const curl = curlText.value;
  if (!curl) {
    return '';
  }
  return transform(curl, 'plaintext');
});

const initializeTab = () => {
  const item = props.item;
  if (!item) {
    return;
  }

  // Helper to check if an object has actual content
  const hasContent = (obj: any): boolean => {
    if (!obj) return false;
    if (typeof obj !== 'object') return true; // non-objects are considered content
    if (Array.isArray(obj)) return obj.length > 0;
    return Object.keys(obj).length > 0;
  };

  const hasQuery = hasContent(item.query?.body);
  const hasHeaders = hasContent(item.requestHeaders?.body);
  const hasAuth = hasContent(item.auth?.body);
  const hasBody = hasContent(item.requestBody?.body);

  // Priority: query > headers > auth > body
  if (hasQuery && !hasBody) {
    selectedTab.value = 'query';
  } else if (hasHeaders && !hasBody && !hasQuery && !hasAuth) {
    selectedTab.value = 'requestHeaders';
  } else if (hasAuth && !hasBody && !hasQuery) {
    selectedTab.value = 'auth';
  } else {
    selectedTab.value = 'requestBody';
  }
};

watch(() => props.item?.id, (newId) => {
  if (newId && newId !== lastItemId.value) {
    lastItemId.value = newId;
    selectedTab.value = 'requestBody';
    initializeTab();
  }
}, { immediate: true });

// Also watch for when formatted data becomes available
// This ensures we update the tab selection when data is populated
watch(() => [
  props.item?.query?.formatted,
  props.item?.requestHeaders?.formatted,
  props.item?.auth?.formatted,
  props.item?.requestBody?.formatted
], () => {
  if (props.item?.id) {
    initializeTab();
  }
}, { deep: false });

onMounted(() => {
  if (props.item?.id && props.item.id !== lastItemId.value) {
    lastItemId.value = props.item.id;
    initializeTab();
  }

  // When Cypress highlights an assertion in the Command Log, it adds the
  // `__cypress-highlight` class to the section that represents a given
  // request. We observe those class changes and, whenever the section that
  // contains this panel is highlighted, we choose the most appropriate tab
  // to show (query, headers, body or auth). This ensures that if the user
  // previously selected "Copy cURL", clicking an assertion will switch back
  // to a content tab so headers/query/body are visible.
  if (typeof window !== 'undefined' && typeof MutationObserver !== 'undefined') {
    const checkAndUpdateTab = () => {
      if (!root.value) {
        return;
      }

      const section = root.value.closest('section[data-curl]') as HTMLElement | null;
      if (!section) {
        return;
      }

      if (section.classList.contains('__cypress-highlight')) {
        // Rely on our normal initialization rules to pick the "best" tab
        // for this request (query/headers/auth/body).
        initializeTab();
      }
    };

    highlightObserver = new MutationObserver((mutations) => {
      if (!root.value) {
        return;
      }

      const section = root.value.closest('section[data-curl]') as HTMLElement | null;
      if (!section) {
        return;
      }

      // Check if this mutation is relevant to our section
      const isRelevantMutation = mutations.some(mutation => {
        const target = mutation.target as HTMLElement;
        return target === section || section.contains(target);
      });

      if (!isRelevantMutation) {
        return;
      }

      // Check immediately
      checkAndUpdateTab();

      // Also check after a small delay to handle async class additions
      setTimeout(checkAndUpdateTab, 10);
    });

    highlightObserver.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['class']
    });
  }
});

onUnmounted(() => {
  if (highlightObserver) {
    highlightObserver.disconnect();
    highlightObserver = null;
  }
});

const handleCopyCurlTabClick = (event: MouseEvent) => {
  event.stopPropagation();
  event.stopImmediatePropagation();
  selectedTab.value = 'copyCurl';
};


</script>