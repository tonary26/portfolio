<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import ArrowIcon from './ArrowIcon.vue'

defineProps({
  content: { type: Object, required: true },
})

const rail = ref(null)
const canScrollPrev = ref(false)
const canScrollNext = ref(true)
let resizeObserver

const updateScrollState = () => {
  const element = rail.value
  if (!element) return

  canScrollPrev.value = element.scrollLeft > 4
  canScrollNext.value = element.scrollLeft + element.clientWidth < element.scrollWidth - 4
}

const scrollReviews = (direction) => {
  const element = rail.value
  if (!element) return

  element.scrollBy({ left: direction * element.clientWidth * 0.78, behavior: 'smooth' })
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
    <div class="testimonials__heading">
      <div>
        <h2>{{ content.title }}</h2>
        <p>{{ content.intro }}</p>
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

    <div ref="rail" class="testimonials__rail" tabindex="0" @scroll.passive="updateScrollState">
      <article v-for="review in content.items" :key="review.author" class="testimonial">
        <p>{{ review.text }}</p>
        <a :href="`https://t.me/${review.author.slice(1)}`" target="_blank" rel="noreferrer">
          {{ review.author }}
          <ArrowIcon />
        </a>
      </article>
    </div>
  </section>
</template>
