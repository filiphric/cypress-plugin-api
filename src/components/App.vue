<template>
  <div id="api-view">
    <div
      v-for="(item, index) in requests.props"
      :key="item.id"
    >
      <section
        :id="item.id"
        :data-curl="generateCurl(item)"
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
        <div class="separator">
          ...
        </div>
        <hr class="border-slate-800 mt-6 hidden md:block">
      </section>
    </div>
    <div id="api-view-bottom" />
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import RequestPanel from "./RequestPanel.vue";
import ResponsePanel from "./ResponsePanel.vue";
import { generateCurl } from '../utils/generateCurl';
import type { RequestProps } from '../types';

const requests = withDefaults(defineProps<{
  props?: RequestProps[];
}>(), {
  props: () => []
});

const fallbackCopyTextToClipboard = (text: string) => {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
  } catch {
    // Fallback failed
  }
  document.body.removeChild(textArea);
};

const copyCurlToClipboard = async (curl: string) => {
  const useFallback = typeof Cypress !== 'undefined' || 
                      !navigator.clipboard || 
                      !navigator.clipboard.writeText ||
                      document.hasFocus === undefined || 
                      !document.hasFocus();

  if (useFallback) {
    fallbackCopyTextToClipboard(curl);
    return;
  }

  try {
    if (window.focus) {
      window.focus();
    }
    await navigator.clipboard.writeText(curl).catch(() => {
      fallbackCopyTextToClipboard(curl);
    });
  } catch {
    fallbackCopyTextToClipboard(curl);
  }
};

// Listen for when Cypress highlights elements (when clicking on assertions in test body)
// Only copy cURL when clicking on a highlighted section, and only if not clicking on interactive elements
let clickHandler: ((e: MouseEvent) => void) | null = null;

onMounted(() => {
  // Add a global click handler that checks if a highlighted section was clicked
  clickHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    
    // Don't copy if clicking on any interactive elements - check this FIRST
    if (
      target.tagName === 'BUTTON' ||
      target.closest('button') ||
      target.tagName === 'LABEL' ||
      target.closest('label') ||
      target.tagName === 'INPUT' ||
      target.closest('input') ||
      target.tagName === 'A' ||
      target.closest('a') ||
      target.closest('[data-cy="copy-curl"]')
    ) {
      return;
    }
    
    // Only proceed if there's a highlighted section (Cypress added __cypress-highlight class)
    const highlightedSection = document.querySelector('section[data-curl].__cypress-highlight') as HTMLElement;
    if (!highlightedSection) {
      return;
    }
    
    // Check if the click target is within the highlighted section
    const clickedSection = target.closest('section[data-curl]') as HTMLElement;
    if (clickedSection === highlightedSection) {
      const curl = highlightedSection.getAttribute('data-curl');
      if (curl) {
        copyCurlToClipboard(curl);
        // Stop propagation to avoid interfering with other handlers, but don't prevent default
        // to allow normal UI interactions to continue
        e.stopPropagation();
      }
    }
  };
  
  // Use capture phase and a small delay to ensure handler is set up
  setTimeout(() => {
    document.addEventListener('click', clickHandler!, true);
  }, 100);
});

onUnmounted(() => {
  if (clickHandler) {
    document.removeEventListener('click', clickHandler, true);
  }
});

</script>