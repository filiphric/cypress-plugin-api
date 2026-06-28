<!-- eslint-disable vue/no-v-html -->
<!-- v-html is required here to render Prism.js syntax-highlighted HTML code from transform.ts -->
<template>
  <div
    v-if="dataFormatted"
    class="bg-cy-blue-darker"
    :data-cy="selector"
    @click.capture="handleCodeBlockClick"
  >
    <pre
      :class="[selector === 'copyCurl' ? 'copy-curl-pre' : 'overflow-scroll no-scrollbar']"
      v-html="dataFormatted"
    />
  </div>
</template>
<!-- eslint-enable vue/no-v-html -->
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

const handleCodeBlockClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  
  const isSummaryClick = target.tagName === 'SUMMARY' || 
                        target.closest('summary') !== null ||
                        target.tagName === 'DETAILS' ||
                        target.closest('details summary') !== null;
  
  if (isSummaryClick) {
    return;
  }
  
  e.stopPropagation();
}
</script>