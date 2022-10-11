<template>
  <div class="bg-transparent pb-10">
    <div v-for="item in props.value" class="m-4">
      <Title :method="item.method" :url="item.url" :status="item.status" />
      <Query :body="item.queryFormatted" />
      <RequestHeaders :body="item.requestHeadersFormatted" />
      <Request :body="item.requestBodyFormatted" />
      <Response :body='item.responseBodyFormatted' :raw="item.responseBody"/>
      <hr class="border-slate-400 border-dashed border-2 my-4" />
    </div>
  </div>
</template>
<script setup lang="ts">
import Response from "./Response.vue";
import Request from "./Request.vue";
import RequestHeaders from "./RequestHeaders.vue";
import Title from "./Title.vue";
import Query from "./Query.vue";

 defineProps({
  props: {
    default: [],
    type: Object
  }
});

</script>