<script setup lang="ts">
import { onMounted, ref, watch, watchEffect } from 'vue';
import { MonitorContent, getContent } from '~/utils/getContent';

const formatPosition = ref('mini')

const id = ref<null| number>(null)
const instancePosition = ref< 'mini' | 'maxi' | 'full'>('mini')
const queue = ref<number | null>(1)

const leftContent = ref<MonitorContent | null | undefined>(null)
const rightContent = ref<MonitorContent | null | undefined>(null)

async function fetchContent() {

  if (!id.value || !queue.value) return

  if (queue.value === 3) return

  console.log('onMounted');

  console.log('fetchContent');
  console.log('id.value', id.value);

  const data = await getContent(queue.value, id.value)

  // const interval = data.find(item => item.event_type === 'MOCK_INTERVAL')

  const left = data.find(item => item?.half === 'left')
    if (left) {
      leftContent.value = left
    }
  const right  = data.find(item => item?.half === 'right')
    if (right) {
      rightContent.value = right
    }

  // if (interval) {
  //   console.log('interval', interval);
    await new Promise((resolve) => {
      setTimeout(resolve, 10000)
    })
    // leftContent.value = null
    // rightContent.value = null
    // return queue.value++
    queue.value++
  // }



  console.log('data', data);
}



onMounted(async () => {
  id.value = await window.electron.ipcRenderer.invoke('get-id')
  // queue.value = 1

  instancePosition.value = await window.electron.ipcRenderer.invoke('get-instance-position')
})



// watch(position, () => window.electron.ipcRenderer.send('set-bounds', JSON.parse(JSON.stringify(id.value)), {...position.value}), {deep: true})

watchEffect(fetchContent)

// function getContentLink() {
//   if (!id.value)
//     return 'video/HeilungNorupo.mp4'

//   else if (id.value === 1)
//     return 'video/Morocco.mp4'

//   else if (id.value === 2)
//     return 'video/COSTARICA.mp4'

//   else if (id.value === 3)
//     return 'video/COSTARICA.mp4'

// }

function handleClick() {
  if (!queue.value) return

  queue.value++
  // if (formatPosition.value === 'mini')
  //   return formatPosition.value = 'maxi'
  // else if (formatPosition.value === 'maxi')
  //   return formatPosition.value = 'full'
  // else if (formatPosition.value === 'full')
  //   return formatPosition.value = 'mini'
}

</script>

<template>
  <section class="main" v-if="id">
  <section class="video" :class="`video__${leftContent?.screen_type}`">
    <video v-if="leftContent?.media_type === 'video'" class="video__player" autoplay loop muted>
      <source :src="'video/' + leftContent?.media">
    </video>
    <img v-else-if="leftContent?.media_type === 'image'" :src="'image/' + leftContent?.media" :alt="leftContent?.media">
    <div v-else />
    <div v-show="formatPosition !== 'full' || rightContent?.event_type !== 'stop'" >
      <video v-if="rightContent?.media_type === 'video'" class="video__player" autoplay loop muted>
        <source :src="'video/' + rightContent?.media">
      </video>
      <img v-else-if="rightContent?.media_type === 'image'" :src="'image/' + rightContent?.media" :alt="rightContent?.media">
      <div v-else />
  </div>
  </section>
</section>
</template>

<style scoped lang="scss">
.main {
  // overflow: hidden;
}

.btn {

  // position: fixed;
  // position: absolute;
  // top: 0;
  // left: 0;
  pointer-events: all;
  background-color: red;
}
.video {
  height: 100vh;
  overflow: hidden;
  &__player {
    position: relative;
  // width: 960px;
  background-color: green;
  display: grid;


    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__full {
    display: grid;
    grid-template-columns: 1fr;
  }

  &__maxi {
    display: grid;
    grid-template-columns: 66.7% 33.3%;
  }

  &__mini {
    display: grid;
    grid-template-columns: 33.3% 66.7%;
  }
}
</style>
