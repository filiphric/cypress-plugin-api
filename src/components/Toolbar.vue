<template>
  <button @click="copyLink">Hey there</button>
</template>
<script setup lang="ts">

const allProps = defineProps({
  props: {
    default: [],
    type: Object
  }
});

const copyLink = async () => {
  const { props }: any = allProps
  const type = typeof props
  const clipBoardValue = type === 'object' ? JSON.stringify(props, null, 2) : props
  await parent.navigator.clipboard.writeText(clipBoardValue);
}

</script>