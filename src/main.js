import { createApp } from 'vue'
import '@fontsource/inter/cyrillic-900.css'
import '@fontsource/inter/latin-900.css'
import App from './App.vue'
import './styles.css'

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
document.documentElement.classList.toggle('motion-ready', !prefersReducedMotion)
document.documentElement.classList.toggle('no-motion', prefersReducedMotion)

createApp(App).mount('#app')
