<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

defineProps({ project: { type: Object, required: true } })

const visual = ref(null)
const mediaVideo = ref(null)
let mediaObserver

onMounted(() => {
  if (!visual.value || !mediaVideo.value) return

  mediaObserver = new IntersectionObserver(([entry]) => {
    const video = mediaVideo.value
    if (!video) return

    if (entry.isIntersecting) {
      video.preload = 'metadata'
      video.play().catch(() => {})
      return
    }

    video.pause()
  }, { threshold: 0.05, rootMargin: '240px 0px' })

  mediaObserver.observe(visual.value)
})

onBeforeUnmount(() => {
  mediaObserver?.disconnect()
  mediaVideo.value?.pause()
})
</script>

<template>
  <div ref="visual" class="project-visual" :class="`project-visual--${project.visual}`" aria-hidden="true">
    <div v-if="project.media" class="project-media">
      <img v-if="project.mediaType === 'image'" :src="project.media" :alt="project.title" loading="lazy">
      <video v-else ref="mediaVideo" :src="project.media" muted loop playsinline preload="none"></video>
    </div>

    <template v-else-if="project.visual === 'tenant'">
      <div class="tenant-ui">
        <div class="tenant-nav"><b>TS</b><span></span><span></span><span></span></div>
        <div class="tenant-body"><small>ОБЪЕКТЫ</small><strong>Мои квартиры</strong><div class="tenant-row"><i>1</i><span>Квартира · Петроградский район</span><b>АКТИВНА</b></div><div class="tenant-row"><i>2</i><span>Квартира · Центральный район</span><b>АКТИВНА</b></div></div>
      </div>
    </template>

    <template v-else>
      <div class="terminal-ui">
        <div class="terminal-ui__head"><span>LIVE PROCESS</span><b>ONLINE</b></div>
        <div class="terminal-ui__flow">
          <span class="flow-node">MARKET</span><i></i><span class="flow-node flow-node--hot">FILTER</span><i></i><span class="flow-node">TELEGRAM</span>
        </div>
        <div class="terminal-ui__lines"><p><b>●</b> service active</p><p>scan cycle <em>00:05</em></p><p>events routed <em>OK</em></p></div>
      </div>
    </template>
  </div>
</template>
