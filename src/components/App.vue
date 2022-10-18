<template>
  <div class="bg-transparent mb-10">
    <div v-for="item in props.value">
      <section class="bg-gray-100 rounded-sm m-4 p-4 pb-2">
        <Title :method="item.method" :url="item.url" :status="item.status" />
        <Datablock :data-formatted='item.queryFormatted' :data-raw="item.query" copy-selector="copyQuery" header="Query:" selector="query" />
        <Datablock :data-formatted='item.requestHeadersFormatted' :data-raw="item.requestHeaders" copy-selector="copyRequestHeaders" header="Headers:" selector="requestHeaders" />
        <Datablock :data-formatted='item.requestBodyFormatted' :data-raw="item.requestBody" copy-selector="copyRequest" header="Request:" selector="requestBody" />
        <Datablock :data-formatted='item.responseBodyFormatted' :data-raw="item.responseBody" copy-selector="copyResponse" header="Response:" selector="responseBody" />
      </section>
      <!-- <hr class="border-gray-300 border-1 my-4 w-3/4 m-auto" /> -->
    </div>
  </div>
</template>
<script setup lang="ts">
import Datablock from "./Datablock.vue";
import Title from "./Title.vue";

defineProps({
  props: {
    default: [],
    type: Object
  }
});

</script>