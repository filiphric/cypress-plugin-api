<template>
  <div class="bg-cy-blue-darker" v-if="dataFormatted" :data-cy="selector">
    <pre class="hljs overflow-scroll" v-html="dataFormatted"></pre>
  </div>
</template>
<script setup lang="ts">
defineProps({
  selector: {
    type: String
  },
  dataFormatted: { 
    default: '',
    type: String
  }
})
</script>