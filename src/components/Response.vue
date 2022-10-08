<template>
  <div v-if="body" data-cy="response" @mouseover="showClipboardButton = true" @mouseout="showClipboardButton = false">
    <div class="flex flex-wrap">
      <div class="flex-1 h-8 pt-1.5 font-semibold">Response body:</div>
      <CopyButton :raw='raw' v-show="showClipboardButton" class="flex-grow-0" />
    </div>
    <pre class="hljs overflow-scroll" v-html="body"></pre>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import CopyButton from "./CopyButton.vue";
defineProps({
  body: {
    default: '',
    type: String
  },
  raw: {
    type: [String, Object]
  }
})
const showClipboardButton = ref(false)
</script>