<template>
  <div>
    <div class="flex text-cy-gray  py-1.5 mb-2" >
      <p>Status:<span data-cy="status" class="mx-2 font-mono" :class="statusColor(status)">{{ status }}</span></p>
      <p>Duration:<span data-cy="time" class="mx-2 font-mono" :class="timeColor(time)">{{ time }}&nbsp;ms</span></p>
      <p>Size:<span data-cy="size" class="mx-2 font-mono text-cy-green">{{ size }}</span></p>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    status: {
      default: '',
      type: String
    },
    time: {
      default: '',
      type: Number
    },
    size: {
      default: '',
      type: String
    }
  })

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

  const timeColor = (time: number) => {
    // const timeCategory = time.toString().substring(0,1)
    // const times = {
    //   '1': 'text-cy-green',
    //   '2': 'text-cy-green',
    //   '3': 'text-cy-orange',
    //   '4': 'text-cy-red',
    //   '5': 'text-cy-red'
    // }
    // return times[timeCategory as keyof typeof times]
    return 'text-cy-green'
  }

</script>