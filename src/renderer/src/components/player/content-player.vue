<script setup lang="ts">
import { MonitorContent } from '~/utils/getContent';

interface ContentPlayerProps {
  content: MonitorContent
}

defineProps<ContentPlayerProps>()
</script>

<template>
  <section class="content" :class="`content__${content?.screen_type}`">
    <video v-if="content?.media_type === 'video'" class="content__video" autoplay loop muted>
      <source :src="'video/' + content?.media">
    </video>
    <img v-else-if="content?.media_type === 'image'" :src="'image/' + content?.media" :alt="content?.media">
  </section>
</template>

<style scoped lang="scss">
.content {
  width: 100%;
  height: 100%;
  overflow: hidden;

  &__video {
    height: 100vh;
    object-fit: cover;
  }

  &__mini {
    width: 33.3%;
  }

  &__maxi {
    width: 66.7%;
  }

  &__full {
    width: 100%;
  }
}

</style>
