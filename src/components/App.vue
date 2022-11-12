<template>
  <div id="api-view">
    <div v-for="(item, index) in requests.props">
      <section class="bg-cy-blue-darker rounded-sm m-4 p-4 pb-2">
        <div class="grid grid-cols-2 gap-4">
          <RequestPanel :item='item' :index='index' />
          <ResponsePanel :item='item' :index='index' />
        </div>
        <hr class="border-slate-800 mt-8" />
      </section>
    </div>
    <div id="api-view-bottom"></div>
  </div>
</template>
<script setup lang="ts">
import RequestPanel from "./RequestPanel.vue";
import ResponsePanel from "./ResponsePanel.vue";
// support should come with Vue 3.3
// import type { RequestProps } from '../types'
// const props = defineProps<RequestProps[]>()

const requests = defineProps({
  props: {
    default: [],
    type: Object
  }
});

</script>