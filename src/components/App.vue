<template>
  <div class="bg-transparent mb-10">
    <div v-for="item in props.value">
      <section class="bg-gray-100 shadow-md rounded-sm m-4 p-4">
        <Title :method="item.method" :url="item.url" :status="item.status" />
        <Query :body="item.queryFormatted" />
        <RequestHeaders :body="item.requestHeadersFormatted" />
        <Request :body="item.requestBodyFormatted" />
        <Response :body='item.responseBodyFormatted' :raw="item.responseBody" />
      </section>
      <!-- <hr class="border-gray-300 border-1 my-4 w-3/4 m-auto" /> -->
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