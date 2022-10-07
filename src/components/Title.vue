<template>
  <div>
    <p class=" text-white rounded-sm px-2 mb-3 inline-block" :class="methodColor(method)">{{ method }}</p>
    <p class="ml-3 inline-block font-mono">{{ url }}</p>
    <p class="ml-3 inline-block text-xs" :class="statusColor(status)" data-cy="status">{{ status }}</p>
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
      '2': 'text-cy-green',
      '3': 'text-cy-orange',
      '4': 'text-cy-red',
      '5': 'text-cy-red'
    }
    return statuses[statusCategory as keyof typeof statuses]
  }
</script>