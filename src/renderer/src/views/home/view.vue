<script setup lang="ts">
// import {  ipcRenderer } from 'electron';
import { onMounted, ref, watch } from 'vue';

const position = ref({
  x: 0,
  y: 0
})

const id = ref<null| number>(null)
const instancePosition = ref(null)

onMounted(async () => {


  id.value = await window.electron.ipcRenderer.invoke('get-id')

  instancePosition.value = await window.electron.ipcRenderer.invoke('get-instance-position')
  // position.value.x = instancePosition[0]
  // position.value.y = instancePosition[1]
})

watch(position, () => window.electron.ipcRenderer.send('set-bounds', JSON.parse(JSON.stringify(id.value)), {...position.value}), {deep: true})

function getContentLink() {
  // if (id.value === null) return


  if (!id.value)
    return 'video/HeilungNorupo.mp4'

  else if (id.value === 1)
    return 'video/Morocco.mp4'

  else if (id.value === 2)
    return 'video/COSTARICA.mp4'

  else if (id.value === 3)
    return 'video/COSTARICA.mp4'

  return 'video/HeilungNorupo.mp4'
}
</script>

<template>
  Test {{ id ?? 'NO ID' }}
  {{ instancePosition }}
  <input v-model="position.x">
  <input v-model="position.y">
  <section class="video" v-if="id !== null">
    <video autoplay loop autobuffer muted width="1920" height="1000">
      <source :src="getContentLink()">
      <!-- <source src="video/HeilungNorupo.webm"> -->
    </video>
  </section>
</template>

<style scoped lang="scss">
.video {
  width: 960px;
  background-color: green;
}
</style>
