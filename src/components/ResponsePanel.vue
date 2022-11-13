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
      checked
    >
    <label 
      v-show="item?.responseBody.body" 
      class="pr-4 pl-1 cursor-pointer text-cy-gray"
      :for="'responseBody' + index"
    >
      Response
    </label>
    <input
      :id="'responseHeaders' + index"
      type="radio" 
      class="hidden invisible" 
      :name="'res' + index" 
      data-cy="showResponseHeaders"
    >
    <label 
      v-show="item?.responseHeaders.body" 
      class="pr-4 pl-1 cursor-pointer text-cy-gray"
      :for="'responseHeaders' + index"
    >
      Headers
    </label>
    <input
      :id="'cookies' + index"
      type="radio" 
      class="hidden invisible" 
      :name="'res' + index" 
      data-cy="showCookies"
    >
    <label 
      v-show="item?.cookies.body" 
      class="pr-4 pl-1 cursor-pointer text-cy-gray"
      :for="'cookies' + index"
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
import Status from "./StatusPanel.vue";
import CodeBlock from "./CodeBlock.vue";
import CookieTable from "./CookieTable.vue";

defineProps({
  item: {
    type: Object
  },
  index: {
    type: [Number, String]
  }
})
</script>