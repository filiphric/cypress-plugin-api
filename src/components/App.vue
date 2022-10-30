<template>
  <div id="api-view">
    <div v-for="item in props">
      <section class="bg-gray-100 rounded-sm m-4 p-4 pb-2">
        <Title :method="item.method" :url="item.url" :status="item.status" />
        <Datablock 
          :data-formatted='item.auth.formatted' 
          :data-raw="item.auth.body" 
          copy-selector="copyAuth"
          header="Auth:"
          selector="auth" />
        <Datablock 
          :data-formatted='item.query.formatted' 
          :data-raw="item.query.body" 
          copy-selector="copyQuery"
          header="Query:"
          selector="query" />
        <Datablock
          :data-formatted='item.requestHeaders.formatted'
          :data-raw="item.requestHeaders.body"
          copy-selector="copyRequestHeaders"
          header="Headers:"
          selector="requestHeaders" />
        <Datablock
          :data-formatted='item.requestBody.formatted'
          :data-raw="item.requestBody.body"
          copy-selector="copyRequest"
          header="Request:"
          selector="requestBody" />
        <Datablock
          :data-formatted='item.responseBody.formatted'
          :data-raw="item.responseBody.body"
          copy-selector="copyResponse"
          header="Response:"
          selector="responseBody" />
      </section>
    </div>
    <div id="api-view-bottom"></div>
  </div>
</template>
<script setup lang="ts">
import Datablock from "./Datablock.vue";
import Title from "./Title.vue";
// support should come with Vue 3.3
// import type { requestProps } from '../types'
// const props = defineProps<requestProps[]>()

defineProps({
  props: {
    default: [],
    type: Object
  }
});

</script>