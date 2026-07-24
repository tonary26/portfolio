<script setup>
defineProps({
  direction: { type: String, default: 'up-right' },
})
</script>

<template>
  <svg
    class="arrow-icon"
    :class="`arrow-icon--${direction}`"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
</template>
