<template>
  <div class="bg-gray-200 rounded-sm p-2 mb-2" v-if="body" data-cy="request">
    <p class="font-semibold mb-2">Request body:</p>
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