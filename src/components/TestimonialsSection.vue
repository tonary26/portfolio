<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import ArrowIcon from './ArrowIcon.vue'

const props = defineProps({
  content: { type: Object, required: true },
})

const rail = ref(null)
const currentIndex = ref(0)
const total = computed(() => props.content.items.length)
const canScrollPrev = computed(() => currentIndex.value > 0)
const canScrollNext = computed(() => currentIndex.value < total.value - 1)
const progressScale = computed(() => (currentIndex.value + 1) / total.value)
let resizeObserver

const updateScrollState = () => {
  const element = rail.value
  if (!element) return

  currentIndex.value = Math.min(
    total.value - 1,
    Math.max(0, Math.round(element.scrollLeft / Math.max(element.clientWidth, 1))),
  )
}

const scrollReviews = (direction) => {
  const element = rail.value
  if (!element) return

  const nextIndex = Math.min(total.value - 1, Math.max(0, currentIndex.value + direction))
  element.scrollTo({ left: nextIndex * element.clientWidth, behavior: 'smooth' })
}

onMounted(() => {
  nextTick(updateScrollState)
  resizeObserver = new ResizeObserver(updateScrollState)
  if (rail.value) resizeObserver.observe(rail.value)
})

onBeforeUnmount(() => resizeObserver?.disconnect())
</script>

<template>
  <section id="reviews" class="testimonials section-pad">
    <aside class="testimonials__aside">
      <span class="testimonials__brand">DEV/SPACE</span>
      <div>
        <h2>{{ content.title }}</h2>
        <p>{{ content.intro }}</p>
      </div>
    </aside>

    <div class="testimonials__case">
      <div class="testimonials__case-label">
        <span>{{ content.caseLabel }}</span>
        <span>{{ content.scrollHint }}</span>
      </div>

      <div ref="rail" class="testimonials__rail" tabindex="0" @scroll.passive="updateScrollState">
        <article v-for="review in content.items" :key="review.author" class="testimonial">
          <span class="testimonial__quote" aria-hidden="true">“</span>
          <p>{{ review.text }}</p>
          <a :href="`https://t.me/${review.author.slice(1)}`" target="_blank" rel="noreferrer">
            <span class="testimonial__avatar" aria-hidden="true">{{ review.author.charAt(1).toUpperCase() }}</span>
            <span>{{ review.author }}</span>
            <ArrowIcon />
          </a>
        </article>
      </div>

      <div class="testimonials__footer">
        <div class="testimonials__progress" aria-hidden="true">
          <span :style="{ transform: `scaleX(${progressScale})` }"></span>
        </div>
        <div class="testimonials__controls" role="group" :aria-label="content.controlsLabel">
          <button type="button" :disabled="!canScrollPrev" :aria-label="content.prev" @click="scrollReviews(-1)">
            <ArrowIcon direction="left" />
          </button>
          <button type="button" :disabled="!canScrollNext" :aria-label="content.next" @click="scrollReviews(1)">
            <ArrowIcon direction="right" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
