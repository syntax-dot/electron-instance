<script setup lang="ts">
import { LayoutDefault } from '~/layout'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { WManagerSocket } from './core/socket'

const layouts = {
  default: LayoutDefault
}

const route = useRoute()

const computedLayout = computed(() => {
  const layoutKey = (route.meta.layout as keyof typeof layouts) || 'default'
  return layouts[layoutKey]
})

onMounted(async () => {
  const instancePosition = await window.electron?.ipcRenderer?.invoke(
    'get-instance-position'
  )

  const wsocket = new WManagerSocket('http://localhost:4444', instancePosition ?? 1)
  console.log('wsocket', wsocket);

  await wsocket.connect()
})
</script>

<template>
  <component :is="computedLayout">
    <router-view />
  </component>
</template>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
