<template>
  <div data-cy="requestPanel" class="col-span-1">
    <Title :method="item?.method" :url="item?.url" />
    <input
        type="radio"
        class="hidden invisible" 
        :id="'query' + index" 
        :name="'req' + index" 
        data-cy="showQuery"
        :checked="item?.query.body && !item?.requestBody.body"
        />
      <label 
        class="pr-3 pl-1 cursor-pointer text-cy-gray select-none" 
        :for="'query' + index"
        v-show="item?.query.body">
        Query
      </label>
      <input
        type="radio"
        class="hidden invisible" 
        :id="'requestHeaders' + index" 
        :name="'req' + index" 
        data-cy="showRequestHeaders"
        :checked="item?.requestHeaders.body && !item?.requestBody.body && !item?.query.body && !item?.auth.body"
        />
      <label 
        class="pr-4 pl-1 cursor-pointer text-cy-gray select-none" 
        :for="'requestHeaders' + index"
        v-show="item?.requestHeaders.body"
        >
        Headers
      </label>
      <input
        type="radio" 
        class="hidden invisible" 
        :id="'auth' + index" 
        :name="'req' + index" 
        data-cy="showAuth"
        :checked="item?.auth.body && !item?.requestBody.body && !item?.query.body"
        />
      <label 
        class="pr-3 pl-1 cursor-pointer text-cy-gray select-none" 
        :for="'auth' + index"
        v-show="item?.auth.body"
        >
        Auth
      </label>
      <input
        type="radio"
        class="hidden invisible" 
        :id="'requestBody' + index" 
        :name="'req' + index" 
        data-cy="showRequestBody"
        :checked="item?.requestBody.body || (!item?.auth.body && !item?.requestHeaders.body && !item?.query.body)"
        />
      <label 
        class="pr-3 pl-1 cursor-pointer text-cy-gray select-none" 
        :for="'requestBody' + index"
        v-show="item?.requestBody.body || (!item?.auth.body && !item?.requestHeaders.body && !item?.query.body)"
        >
        Body
      </label>
      
      <Datablock 
        :data-formatted='item?.auth.formatted' 
        selector="auth" />
      <Datablock 
        :data-formatted='item?.query.formatted' 
        selector="query" />
      <Datablock
        :data-formatted='item?.requestHeaders.formatted'
        selector="requestHeaders" />
      <Datablock
        :data-formatted='item?.requestBody.formatted'
        selector="requestBody" />
    </div>
</template>
<script setup lang="ts">
import Title from "./Title.vue";
import Datablock from "./Datablock.vue";

defineProps({
  item: {
    type: Object
  },
  index: {
    type: [Number, String]
  }
})

</script>