<template>
  <div class="bg-gray-200 rounded-sm p-2 mb-2" v-if="dataFormatted" :data-cy="selector" @mouseover="showClipboardButton = true" @mouseout="showClipboardButton = false">
    <div class="flex flex-wrap">
      <div class="flex-1 font-semibold mb-2">{{ header }}</div>
      <CopyButton :raw='dataRaw' v-show="showClipboardButton" class="flex-grow-0" :data-cy="copySelector" />
    </div>
    <pre class="hljs overflow-scroll" v-html="dataFormatted"></pre>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import CopyButton from "./CopyButton.vue";
defineProps({
  selector: {
    type: String
  },
  copySelector: {
    type: String
  },
  header: {
    type: String
  },
  dataFormatted: { 
    default: '',
    type: String
  },
  dataRaw: {
    type: [String, Object]
  }
})
const showClipboardButton = ref(false)
</script>