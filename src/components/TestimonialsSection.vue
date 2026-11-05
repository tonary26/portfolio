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
let settleTimer
let touchStart = null

const clampIndex = (index) => Math.min(total.value - 1, Math.max(0, index))

const scrollToIndex = (index, behavior = 'smooth') => {
  const element = rail.value
  if (!element) return

  const nextIndex = clampIndex(index)
  currentIndex.value = nextIndex
  element.scrollTo({ left: nextIndex * element.clientWidth, behavior })
}

const settleOnNearestReview = () => {
  const element = rail.value
  if (!element) return

  const nearestIndex = clampIndex(Math.round(element.scrollLeft / Math.max(element.clientWidth, 1)))
  const targetLeft = nearestIndex * element.clientWidth
  currentIndex.value = nearestIndex

  if (Math.abs(element.scrollLeft - targetLeft) > 1) {
    element.scrollTo({ left: targetLeft, behavior: 'smooth' })
  }
}

const scheduleSettle = () => {
  window.clearTimeout(settleTimer)
  settleTimer = window.setTimeout(settleOnNearestReview, 180)
}

const updateScrollState = () => {
  const element = rail.value
  if (!element) return

  currentIndex.value = Math.min(
    total.value - 1,
    Math.max(0, Math.round(element.scrollLeft / Math.max(element.clientWidth, 1))),
  )
  scheduleSettle()
}

const scrollReviews = (direction) => {
  scrollToIndex(currentIndex.value + direction)
}

const handleTouchStart = (event) => {
  const touch = event.touches[0]
  if (!touch) return

  window.clearTimeout(settleTimer)
  touchStart = {
    x: touch.clientX,
    y: touch.clientY,
    index: currentIndex.value,
  }
}

const handleTouchEnd = (event) => {
  const touch = event.changedTouches[0]
  if (!touch || !touchStart) {
    scheduleSettle()
    return
  }

  const deltaX = touch.clientX - touchStart.x
  const deltaY = touch.clientY - touchStart.y
  const isHorizontalSwipe = Math.abs(deltaX) >= 36 && Math.abs(deltaX) > Math.abs(deltaY) * 1.15

  if (isHorizontalSwipe) {
    scrollToIndex(touchStart.index + (deltaX < 0 ? 1 : -1))
  } else {
    scheduleSettle()
  }

  touchStart = null
}

onMounted(() => {
  nextTick(updateScrollState)
  resizeObserver = new ResizeObserver(updateScrollState)
  if (rail.value) resizeObserver.observe(rail.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.clearTimeout(settleTimer)
})
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

      <div
        ref="rail"
        class="testimonials__rail"
        tabindex="0"
        @scroll.passive="updateScrollState"
        @touchstart.passive="handleTouchStart"
        @touchend.passive="handleTouchEnd"
        @touchcancel.passive="scheduleSettle"
      >
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
