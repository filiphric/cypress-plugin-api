<template>
  <button @click="copyLink(raw)" class="flex outline-none items-center bg-indigo-500 text-white px-2 h-8">
    <span class="flex justify-self-start items-center pr-2">
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="stroke-white inline-block" style="min-width: 16px; min-height: 16px;">
        <path d="M19.5 18.5854C18.9174 18.7913 18.5 19.3469 18.5 20V29.5C18.5 30.3284 19.1716 31 20 31H28C28.8284 31 29.5 30.3284 29.5 29.5V20C29.5 19.3469 29.0826 18.7913 28.5 18.5854M23 20H25C25.5523 20 26 19.5523 26 19V18C26 17.4477 25.5523 17 25 17H23C22.4477 17 22 17.4477 22 18V19C22 19.5523 22.4477 20 23 20Z"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: translate(-16px, -16px);">
        </path>
      </svg>
    </span>
    <span class="flex-grow font-semibold">
      Copy to clipboard
    </span>
  </button>
</template>
<script setup lang="ts">
  defineProps({
  raw: {
    default: '',
    type: String
  }
})
  const copyLink = async (content: string | Record<string, any>) => {
  const type = typeof content
  const clipBoardValue = type === 'object' ? JSON.stringify(content, null, 2) : content as string
  await parent.navigator.clipboard.writeText(clipBoardValue);
}
</script>