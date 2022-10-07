<template>
  <div v-if="body" data-cy="query" class="mb-4">
    <b>Query:</b>
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