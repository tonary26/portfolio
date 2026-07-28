import { createApp } from 'vue'
import '@fontsource/inter/cyrillic-900.css'
import '@fontsource/inter/latin-900.css'
import '@fontsource/onest/cyrillic-800.css'
import '@fontsource/onest/latin-800.css'
import '@fontsource/manrope/cyrillic-700.css'
import '@fontsource/manrope/cyrillic-800.css'
import '@fontsource/manrope/latin-700.css'
import '@fontsource/manrope/latin-800.css'
import '@fontsource/golos-text/cyrillic-400.css'
import '@fontsource/golos-text/cyrillic-600.css'
import '@fontsource/golos-text/cyrillic-700.css'
import '@fontsource/golos-text/latin-400.css'
import '@fontsource/golos-text/latin-600.css'
import '@fontsource/golos-text/latin-700.css'
import '@fontsource/jetbrains-mono/cyrillic-500.css'
import '@fontsource/jetbrains-mono/cyrillic-600.css'
import '@fontsource/jetbrains-mono/latin-500.css'
import '@fontsource/jetbrains-mono/latin-600.css'
import App from './App.vue'
import './styles.css'

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
document.documentElement.classList.toggle('motion-ready', !prefersReducedMotion)
document.documentElement.classList.toggle('no-motion', prefersReducedMotion)

createApp(App).mount('#app')
