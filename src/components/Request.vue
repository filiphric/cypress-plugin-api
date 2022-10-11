<template>
  <div class="rounded-sm outline outline-slate-400 outline-1 p-2 mb-2" v-if="body" data-cy="request">
    <p class="font-mono font-bold mb-2">Request body:</p>
    <pre class="hljs overflow-scroll" v-html="body"></pre>
  </div>
</template>
<script setup lang="ts">
defineProps({
  body: {
    default: '',
    type: String
  }
})
</script>