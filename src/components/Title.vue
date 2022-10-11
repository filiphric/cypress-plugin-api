<template>
  <div>
    <div class="flex rounded-sm outline outline-slate-400 outline-1 p-2 mb-2">
      <p class="font-mono font-bold">Method: </p>
      <p class="px-2 ml-3 rounded-md inline-block text-white font-mono" :class="methodColor(method)">{{ method }}</p>
    </div>

    <div class="flex rounded-sm outline outline-slate-400 outline-1 p-2 mb-2">
      <p class="font-mono font-bold">URL: </p>
      <p class="ml-3 inline-block font-mono">{{ url }}</p>
    </div>

    <div class="flex rounded-sm outline outline-slate-400 outline-1 p-2 mb-2">
      <p class="font-mono font-bold">Status: </p>
      <p class="px-2 ml-3 rounded-md inline-block text-white font-mono" :class="statusColor(status)" data-cy="status">{{ status }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    method: {
      default: '',
      type: String
    },
    url: {
      default: '',
      type: String
    },
    status: {
      default: '',
      type: String
    }
  })

  const methodColor = (method: string) => {
    const methods = {
      'DELETE': 'bg-cy-red',
      'POST': 'bg-cy-green',
      'PUT': 'bg-cy-green',
      'GET': 'bg-cy-blue',
      'PATCH': 'bg-cy-orange',
      'HEAD': 'bg-cy-yellow'
    }
    return methods[method as keyof typeof methods]
  }

  const statusColor = (status: string) => {
    const statusCategory = status.substring(0,1)
    const statuses = {
      '2': 'bg-cy-green',
      '3': 'bg-cy-orange',
      '4': 'bg-cy-red',
      '5': 'bg-cy-red'
    }
    return statuses[statusCategory as keyof typeof statuses]
  }
</script>