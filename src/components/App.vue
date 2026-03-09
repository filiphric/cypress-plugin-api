<template>
  <div id="api-view">
    <div
      v-for="(item, index) in requests.props"
      :key="item.id"
    >
      <section
        :id="item.id"
        class="bg-cy-blue-darker rounded-sm m-4 p-4 pb-2"
      >
        <!-- DOM order: Response then Request so cy.contains('xml'/'html') finds response body first. CSS order keeps Request left, Response right. -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:order-2">
            <ResponsePanel
              :item="item"
              :index="index"
            />
          </div>
          <div class="md:order-1">
            <RequestPanel
              :item="item"
              :index="index"
            />
          </div>
        </div>
        <div class="separator">...</div>
        <hr class="border-slate-800 mt-6 hidden md:block">
      </section>
    </div>
    <div id="api-view-bottom" />
  </div>
</template>
<script setup lang="ts">
import RequestPanel from "./RequestPanel.vue";
import ResponsePanel from "./ResponsePanel.vue";
// support should come with Vue 3.3
// import type { RequestProps } from '../types'
// const props = defineProps<RequestProps[]>()

const requests = defineProps({
  props: {
    default: () => { return [] },
    type: Object
  }
});

</script>