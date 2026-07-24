import { createApp } from 'vue'
import App from './App.vue'
import './styles.css'

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
document.documentElement.classList.toggle('motion-ready', !prefersReducedMotion)
document.documentElement.classList.toggle('no-motion', prefersReducedMotion)

createApp(App).mount('#app')
