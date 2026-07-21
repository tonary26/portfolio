<script setup>
defineProps({ project: { type: Object, required: true } })
</script>

<template>
  <div class="project-visual" :class="`project-visual--${project.visual}`" aria-hidden="true">
    <div v-if="project.media" class="project-media">
      <img v-if="project.mediaType === 'image'" :src="project.media" :alt="project.title" loading="lazy">
      <video v-else :src="project.media" autoplay muted loop playsinline preload="metadata"></video>
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
