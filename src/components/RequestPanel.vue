<template>
  <div
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

// Track which radio button should be checked - initialize once to prevent blinking
const selectedTab = ref<string>('requestBody');
// Track the item ID to detect when it's a new item instance
const lastItemId = ref<string | null>(null);

// Computed property for cURL text - always up-to-date
const curlText = computed(() => {
  if (!props.item) {
    return '';
  }
  return generateCurl(props.item);
});

// Computed property for formatted cURL (for CodeBlock display)
// Always compute the formatted cURL - CodeBlock component will handle visibility
const curlFormatted = computed(() => {
  if (!props.item) {
    return '';
  }
  const curl = curlText.value;
  if (!curl) {
    return '';
  }
  // Format cURL as plaintext using the transform function
  return transform(curl, 'plaintext');
});

// Initialize the selected tab based on available data
const initializeTab = () => {
  const item = props.item;
  if (item?.query?.body && !item?.requestBody?.body) {
    selectedTab.value = 'query';
  } else if (item?.requestHeaders?.body && !item?.requestBody?.body && !item?.query?.body && !item?.auth?.body) {
    selectedTab.value = 'requestHeaders';
  } else if (item?.auth?.body && !item?.requestBody?.body && !item?.query?.body) {
    selectedTab.value = 'auth';
  } else {
    selectedTab.value = 'requestBody';
  }
};

// Watch for when item changes (by ID) and initialize once per item
watch(() => props.item?.id, (newId) => {
  if (newId && newId !== lastItemId.value) {
    // New item instance - reset and initialize
    lastItemId.value = newId;
    selectedTab.value = 'requestBody'; // Reset to default
    // Initialize immediately - item should be available
    initializeTab();
  }
}, { immediate: true });

onMounted(() => {
  if (props.item?.id && props.item.id !== lastItemId.value) {
    lastItemId.value = props.item.id;
    initializeTab();
  }
});

// Function to handle clicking the Copy cURL tab label
const handleCopyCurlTabClick = (event: MouseEvent) => {
  // Stop propagation to prevent global click handlers from interfering
  event.stopPropagation();
  event.stopImmediatePropagation();
  
  // Switch to the Copy cURL tab
  selectedTab.value = 'copyCurl';
};


</script>