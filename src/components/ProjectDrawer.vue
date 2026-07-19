<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import ProjectVisual from './ProjectVisual.vue'

const props = defineProps({ project: { type: Object, required: true } })
const emit = defineEmits(['close'])

const onKey = (event) => event.key === 'Escape' && emit('close')
onMounted(() => { window.addEventListener('keydown', onKey); document.body.classList.add('modal-open') })
onBeforeUnmount(() => { window.removeEventListener('keydown', onKey); document.body.classList.remove('modal-open') })
</script>

<template>
  <div class="drawer-backdrop" role="presentation" @click.self="$emit('close')">
    <article class="project-drawer" role="dialog" aria-modal="true" :aria-labelledby="`drawer-${project.id}`">
      <button class="drawer-close" type="button" @click="$emit('close')" aria-label="Закрыть">Закрыть <span>×</span></button>
      <div class="drawer-hero">
        <div><p>{{ project.type }}</p><h2 :id="`drawer-${project.id}`">{{ project.title }}</h2><span>{{ project.subtitle }}</span></div>
        <ProjectVisual :project="project" />
      </div>
      <div class="drawer-body">
        <div class="drawer-story"><h3>О проекте</h3><p>{{ project.long }}</p></div>
        <div class="drawer-features"><h3>Что реализовано</h3><ul><li v-for="feature in project.features" :key="feature">{{ feature }}</li></ul></div>
      </div>
      <div class="drawer-stack"><span v-for="item in project.stack" :key="item">{{ item }}</span></div>
      <a v-if="project.link" class="drawer-site-link" :href="project.link" target="_blank" rel="noreferrer">Открыть готовый сайт <span>↗</span></a>
    </article>
  </div>
</template>
