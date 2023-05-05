<script setup lang="ts">
import { onMounted, ref, watch, watchEffect } from 'vue';
import ContentPlayer from '~/components/player/content-player.vue';
import { MonitorContent, getContent } from '~/utils/getContent';

const id = ref<null| number>(null)
const instancePosition = ref(null)
const queue = ref(1)

const leftContent = ref<MonitorContent | null | undefined>(null)
const rightContent = ref<MonitorContent | null | undefined>(null)

async function fetchContent() {
  if (!id.value || !queue.value) return

  const data = await getContent(queue.value, id.value)

  const left = data.find(item => item?.half === 'left')
    if (left) {
      leftContent.value = left
    }
  const right  = data.find(item => item?.half === 'right')
    if (right) {
      rightContent.value = right
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 10000)
    })
    queue.value++

  console.log('data', data);
}

onMounted(async () => {
  id.value = await window.electron.ipcRenderer.invoke('get-id')
  instancePosition.value = await window.electron.ipcRenderer.invoke('get-instance-position')
})

watchEffect(fetchContent)

function handleClick() {
  if (!queue.value) return

  queue.value++
}
</script>

<template>
  <section class="main" v-if="id">
    <content-player v-if="leftContent" :content="leftContent" />
    <content-player v-if="rightContent" :content="rightContent" />
  </section>
</template>

<style scoped lang="scss">
.main {
  display: flex;


}
</style>
