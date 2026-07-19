<script setup>
import ProjectVisual from './ProjectVisual.vue'

defineProps({
  project: { type: Object, required: true },
  position: { type: String, default: 'middle' },
})
defineEmits(['open'])
</script>

<template>
  <article class="project-card reveal" :class="`project-card--${position}`" :data-accent="project.accent">
    <div class="project-card__button">
      <div class="project-card__copy">
        <div class="project-card__meta"><span>{{ project.type }}</span></div>
        <h3>{{ project.title }}</h3>
        <p class="project-card__subtitle">{{ project.subtitle }}</p>
        <div class="project-card__stack"><span v-for="item in project.stack.slice(0, 4)" :key="item">{{ item }}</span></div>
        <div class="project-card__actions">
          <button class="project-card__more" type="button" @click="$emit('open', project)" :aria-label="`Подробнее о проекте ${project.title}`">
            <span>Подробнее о проекте</span>
          </button>
          <a v-if="project.link" class="project-card__external" :href="project.link" target="_blank" rel="noreferrer">
            Открыть сайт <i>↗</i>
          </a>
        </div>
      </div>
      <ProjectVisual :project="project" />
    </div>
  </article>
</template>
