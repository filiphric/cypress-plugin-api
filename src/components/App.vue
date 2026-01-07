<template>
  <div id="api-view">
    <div
      v-for="(item, index) in requests.props"
      :key="item.id"
    >
      <section
        :id="item.id"
        :data-curl="getCurlForItem(item)"
        class="bg-cy-blue-darker rounded-sm m-4 p-4 pb-2"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RequestPanel
            :item="item"
            :index="index"
          />
          <ResponsePanel
            :item="item"
            :index="index"
          />
        </div>
        <div class="separator">...</div>
        <hr class="border-slate-800 mt-6 hidden md:block">
      </section>
    </div>
    <div id="api-view-bottom" />
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue';
import RequestPanel from "./RequestPanel.vue";
import ResponsePanel from "./ResponsePanel.vue";
import { generateCurl } from '../utils/generateCurl';
// support should come with Vue 3.3
// import type { RequestProps } from '../types'
// const props = defineProps<RequestProps[]>()

const requests = defineProps({
  props: {
    default: () => [],
    type: Array
  }
});

// Helper function to get cURL for an item
const getCurlForItem = (item: any) => {
  return generateCurl(item);
};

// Listen for when Cypress highlights elements (when clicking on assertions in test body)
// Only copy cURL when clicking on a highlighted section, and only if not clicking on interactive elements
let clickHandler: ((e: MouseEvent) => void) | null = null;
let mouseDownHandler: ((e: MouseEvent) => void) | null = null;

onMounted(() => {
  mouseDownHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const codeBlockElement = 
      target.closest('[data-cy="copyCurl"]') ||
      target.closest('[data-cy="auth"]') ||
      target.closest('[data-cy="query"]') ||
      target.closest('[data-cy="requestHeaders"]') ||
      target.closest('[data-cy="requestBody"]') ||
      target.closest('[data-cy="responseBody"]') ||
      target.closest('[data-cy="responseHeaders"]');
    
    if (codeBlockElement) {
      e.stopPropagation();
    }
  };
  
  clickHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    
    // Allow details/summary elements to toggle (JSON folding)
    const isSummaryClick = target.tagName === 'SUMMARY' || 
                          target.closest('summary') !== null ||
                          target.tagName === 'DETAILS' ||
                          target.closest('details summary') !== null;
    
    if (isSummaryClick) {
      return;
    }
    
    // Ignore clicks on CodeBlocks to allow text selection
    const codeBlockElement = 
      target.closest('[data-cy="copyCurl"]') ||
      target.closest('[data-cy="auth"]') ||
      target.closest('[data-cy="query"]') ||
      target.closest('[data-cy="requestHeaders"]') ||
      target.closest('[data-cy="requestBody"]') ||
      target.closest('[data-cy="responseBody"]') ||
      target.closest('[data-cy="responseHeaders"]');
    
    if (codeBlockElement) {
      return;
    }
    
    if (
      target.closest('[data-cy="copy-curl-tab"]') !== null ||
      target.closest('label[for*="copyCurl"]') !== null
    ) {
      return;
    }
    
    if (
      target.closest('button') ||
      target.tagName === 'LABEL' ||
      target.closest('label') ||
      target.tagName === 'INPUT' ||
      target.closest('input') ||
      target.tagName === 'A' ||
      target.closest('a')
    ) {
      return;
    }
    
    const clickedSection = target.closest('section.__cypress-highlight') as HTMLElement;
    if (clickedSection) {
      const isCodeBlockClick = 
        target.closest('[data-cy="copyCurl"]') ||
        target.closest('[data-cy="auth"]') ||
        target.closest('[data-cy="query"]') ||
        target.closest('[data-cy="requestHeaders"]') ||
        target.closest('[data-cy="requestBody"]') ||
        target.closest('[data-cy="responseBody"]') ||
        target.closest('[data-cy="responseHeaders"]');
      
      if (isCodeBlockClick) {
        return;
      }
      
      const isDirectSectionClick = target === clickedSection || target.closest('section.__cypress-highlight') === clickedSection && 
        !target.closest('[data-cy="copyCurl"]') &&
        !target.closest('[data-cy="auth"]') &&
        !target.closest('[data-cy="query"]') &&
        !target.closest('[data-cy="requestHeaders"]') &&
        !target.closest('[data-cy="requestBody"]') &&
        !target.closest('[data-cy="responseBody"]') &&
        !target.closest('[data-cy="responseHeaders"]') &&
        !target.closest('label') &&
        !target.closest('input') &&
        !target.closest('button');
      
      if (isDirectSectionClick) {
        const requestPanel = clickedSection.querySelector('[data-cy="requestPanel"]');
        if (requestPanel) {
          const copyCurlTab = requestPanel.querySelector('[data-cy="copy-curl-tab"]') as HTMLElement;
          if (copyCurlTab) {
            setTimeout(() => {
              copyCurlTab.click();
            }, 50);
          }
        }
      }
      
      return;
    }
  };
  
  document.addEventListener('click', clickHandler!, true);
  document.addEventListener('mousedown', mouseDownHandler, true);
});

onUnmounted(() => {
  if (clickHandler) {
    document.removeEventListener('click', clickHandler, true);
  }
  if (mouseDownHandler) {
    document.removeEventListener('mousedown', mouseDownHandler, true);
  }
});

</script>