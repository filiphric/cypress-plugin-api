<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    v-if="dataFormatted"
    class="bg-cy-blue-darker"
    :data-cy="selector"
  >
    <pre
      class="hljs overflow-scroll no-scrollbar"
      v-html="dataFormatted"
    />
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