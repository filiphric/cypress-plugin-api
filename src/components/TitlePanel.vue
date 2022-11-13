<template>
  <div>
    <div class="flex text-cy-gray rounded-sm bg-cy-blue-darkest py-1.5 border-slate-800 border mb-2">
      <p
        data-cy="method"
        class="mx-2 rounded-sm font-mono"
        :class="methodColor(method)"
      >
        {{ method }}
      </p>
      <input
        data-cy="url"
        class="px-1 inline-block font-mono bg-cy-blue-darkest w-full outline-0"
        :value="url"
        readonly
      >
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
    }
  })

  const methodColor = (method: string) => {
    const methods = {
      'DELETE': 'text-cy-red',
      'POST': 'text-cy-green',
      'PUT': 'text-cy-green',
      'GET': 'text-cy-blue',
      'PATCH': 'text-cy-orange',
      'HEAD': 'text-cy-yellow'
    }
    return methods[method as keyof typeof methods]
  }

</script>