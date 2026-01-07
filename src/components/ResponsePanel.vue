<template>
  <div
    data-cy="responsePanel"
    class="col-span-1"
  >
    <Status
      :status="item?.status"
      :time="item?.time"
      :size="item?.size"
    />
    <input
      :id="'responseBody' + index"
      type="radio" 
      class="hidden invisible" 
      :name="'res' + index" 
      data-cy="showResponseBody"
      :checked="selectedTab === 'responseBody'"
    >
    <label 
      v-show="item?.responseBody.body" 
      class="pr-4 md:pl-1 cursor-pointer text-cy-gray"
      :for="'responseBody' + index"
      @click="selectedTab = 'responseBody'"
    >
      Response
    </label>
    <input
      :id="'responseHeaders' + index"
      type="radio" 
      class="hidden invisible" 
      :name="'res' + index" 
      data-cy="showResponseHeaders"
      :checked="selectedTab === 'responseHeaders'"
    >
    <label 
      v-show="item?.responseHeaders.body" 
      class="pr-4 pl-1 cursor-pointer text-cy-gray"
      :for="'responseHeaders' + index"
      @click="selectedTab = 'responseHeaders'"
    >
      Headers
    </label>
    <input
      :id="'cookies' + index"
      type="radio" 
      class="hidden invisible" 
      :name="'res' + index" 
      data-cy="showCookies"
      :checked="selectedTab === 'cookies'"
    >
    <label 
      v-show="item?.cookies.body && Object.keys(item.cookies.body).length > 0" 
      class="pr-4 pl-1 cursor-pointer text-cy-gray"
      :for="'cookies' + index"
      @click="selectedTab = 'cookies'"
    >
      Cookies
    </label>
    <CodeBlock
      :data-formatted="item?.responseBody.formatted"
      :show="item?.responseBody.formatted.length"
      selector="responseBody"
    />
    <CodeBlock
      :data-formatted="item?.responseHeaders.formatted"
      selector="responseHeaders"
    />
    <CookieTable
      :data="item?.cookies.body"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import Status from "./StatusPanel.vue";
import CodeBlock from "./CodeBlock.vue";
import CookieTable from "./CookieTable.vue";

const props = defineProps({
  item: {
    type: Object
  },
  index: {
    type: [Number, String]
  }
})

// Track which radio button should be checked - initialize once to prevent blinking
const selectedTab = ref<string>('responseBody');
// Track the item ID to detect when it's a new item instance
const lastItemId = ref<string | null>(null);

// Initialize the selected tab based on available data
const initializeTab = () => {
  const item = props.item;
  // Default to responseBody, but can switch to headers or cookies if available
  if (item?.responseHeaders?.body && !item?.responseBody?.body && !item?.cookies?.body) {
    selectedTab.value = 'responseHeaders';
  } else if (item?.cookies?.body && !item?.responseBody?.body && !item?.responseHeaders?.body) {
    selectedTab.value = 'cookies';
  } else {
    selectedTab.value = 'responseBody';
  }
};

// Watch for when item changes (by ID) and initialize once per item
watch(() => props.item?.id, (newId) => {
  if (newId && newId !== lastItemId.value) {
    // New item instance - reset and initialize
    lastItemId.value = newId;
    selectedTab.value = 'responseBody'; // Reset to default
    // Initialize immediately - item should be available
    initializeTab();
  }
}, { immediate: true });

// Also initialize on mount as fallback
onMounted(() => {
  if (props.item?.id && props.item.id !== lastItemId.value) {
    lastItemId.value = props.item.id;
    initializeTab();
  }
});
</script>