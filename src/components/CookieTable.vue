<template>
  <div class="bg-cy-blue-darkest border-slate-800 px-2 py-2 border mt-2 overflow-auto" data-cy="cookies" v-if="data?.length">
    <table class="text-sm">
      <thead class="text-cy-gray-light w-2/12">
        <tr>
          <th class="w-24 text-left py-2 px-3 border-r border-b border-slate-800">Name</th>
          <th class="w-24 text-left py-2 px-3 border-l border-b border-slate-800">Value</th>
        </tr>
      </thead>
      <tbody class="w-10/12 text-cy-gray">
        <tr v-for="(item) in data">
          <td class="font-mono py-2 px-3 text-left break-words border-r border-t border-slate-800">{{ item.name }}</td>
          <td class="font-mono py-2 px-3 text-left break-words w-full border-l border-t border-slate-800">{{ item.value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="bg-cy-blue-darkest border-slate-800 p-4 border mt-2 overflow-auto text-cy-gray text-xs font-mono" data-cy="cookies" v-else>(No cookies were set)</div>
</template>
<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object
  }
})
</script>