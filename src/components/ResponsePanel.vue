<template>
  <div data-cy="responsePanel" class="col-span-1">
      <Status :status="item?.status" :time="item?.time" :size="item?.size" />
      <input
      type="radio"
      class="hidden invisible" 
      :id="'responseBody' + index" 
      :name="'res' + index" 
      data-cy="showResponseBody" checked />
      <label 
        class="pr-4 pl-1 cursor-pointer text-cy-gray" 
        :for="'responseBody' + index"
        v-show="item?.responseBody.body">
        Response
      </label>
      <input
      type="radio"
      class="hidden invisible" 
      :id="'responseHeaders' + index" 
      :name="'res' + index" 
      data-cy="showResponseHeaders" />
      <label 
        class="pr-4 pl-1 cursor-pointer text-cy-gray" 
        :for="'responseHeaders' + index"
        v-show="item?.responseHeaders.body">
        Headers
      </label>
      <input
      type="radio"
      class="hidden invisible" 
      :id="'cookies' + index" 
      :name="'res' + index" 
      data-cy="showCookies" />
      <label 
        class="pr-4 pl-1 cursor-pointer text-cy-gray" 
        :for="'cookies' + index"
        v-show="item?.cookies.body">
        Cookies
      </label>
      <Datablock
      :data-formatted='item?.responseBody.formatted'
      :show="item?.responseBody.formatted.length"
      selector="responseBody" />
      <Datablock
      :data-formatted='item?.responseHeaders.formatted'
      selector="responseHeaders" />
      <CookieTable
      :data='item?.cookies.body'
      />
    </div>
</template>
<script setup lang="ts">
import Status from "./Status.vue";
import Datablock from "./Datablock.vue";
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