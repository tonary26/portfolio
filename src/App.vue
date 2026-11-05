<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import gsap from 'gsap'
import ArrowIcon from './components/ArrowIcon.vue'
import ProjectCard from './components/ProjectCard.vue'
import ProjectDrawer from './components/ProjectDrawer.vue'
import TestimonialsSection from './components/TestimonialsSection.vue'
import { filters, projects } from './data/projects'
import i18n from './data/i18n.json'

const activeFilter = ref('all')
const selectedProject = ref(null)
const mobileMenu = ref(false)
let revealObserver

const { languages, messages, projectTranslations } = i18n

const savedLanguage = localStorage.getItem('devspace-language')
const currentLanguage = ref(languages.some((language) => language.id === savedLanguage) ? savedLanguage : 'ru')

const t = computed(() => messages[currentLanguage.value])

const localizedFilters = computed(() => filters.map((filter) => ({
  ...filter,
  label: t.value.filters[filter.id] || filter.label,
})))

const localizedProjects = computed(() => projects.map((project) => ({
  ...project,
  ...(projectTranslations[currentLanguage.value]?.[project.id] || {}),
})))

const filteredProjects = computed(() => activeFilter.value === 'all'
  ? localizedProjects.value
  : localizedProjects.value.filter((project) => project.category === activeFilter.value))

const cardPosition = (index) => {
  if (filteredProjects.value.length === 1) return 'single'
  if (index === 0) return 'first'
  if (index === filteredProjects.value.length - 1) return 'last'
  return 'middle'
}

const setupReveals = () => {
  revealObserver?.disconnect()
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.documentElement.classList.toggle('no-motion', reduced)
  document.documentElement.classList.toggle('motion-ready', !reduced)

  if (reduced) {
    document.querySelectorAll('.reveal').forEach((element) => {
      element.classList.add('is-visible', 'is-copy-visible', 'is-visual-visible')
    })
    return
  }

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-visible')
      revealObserver?.unobserve(entry.target)
    })
  }, { threshold: 0.01, rootMargin: '0px 0px 18% 0px' })

  document.querySelectorAll('.reveal').forEach((element) => {
    revealObserver.observe(element)
  })
}

const animateHero = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  gsap.timeline({ defaults: { ease: 'power4.out' } })
    .from('.hero-title__line > span', { yPercent: 110, duration: 1.05, stagger: 0.11 })
    .from('.hero-footer > *', { opacity: 0, y: 20, duration: 0.7, stagger: 0.08 }, '-=0.55')
}

const setFilter = (id) => {
  activeFilter.value = id
}

const scrollTo = (id) => {
  mobileMenu.value = false
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

const setLanguage = (language) => {
  currentLanguage.value = language
  localStorage.setItem('devspace-language', language)
  document.documentElement.lang = language
  mobileMenu.value = false
}

onMounted(() => {
  document.documentElement.lang = currentLanguage.value
  nextTick(() => {
    animateHero()
    setupReveals()
  })
})

onBeforeUnmount(() => {
  revealObserver?.disconnect()
})
</script>

<template>
  <div class="site-shell">
    <header class="site-header">
      <button class="brand" type="button" @click="scrollTo('top')"><b>DEV</b><span>SPACE</span></button>
      <nav :class="{ open: mobileMenu }">
        <button type="button" @click="scrollTo('projects')">{{ t.nav.projects }}</button>
        <button type="button" @click="scrollTo('services')">{{ t.nav.services }}</button>
        <button type="button" @click="scrollTo('reviews')">{{ t.nav.reviews }}</button>
        <button class="nav-contact" type="button" @click="scrollTo('contact')">{{ t.nav.contact }}</button>
      </nav>
      <div class="header-actions">
        <div class="language-switch" role="group" aria-label="Language">
          <button
            v-for="language in languages"
            :key="language.id"
            type="button"
            :class="{ active: currentLanguage === language.id }"
            :aria-pressed="currentLanguage === language.id"
            :title="language.name"
            @click="setLanguage(language.id)"
          >
            {{ language.label }}
          </button>
        </div>
        <button class="menu-toggle" type="button" :aria-expanded="mobileMenu" :aria-label="t.nav.menu" @click="mobileMenu = !mobileMenu"><span></span><span></span></button>
      </div>
    </header>

    <main>
      <section id="top" class="hero-section">
        <h1 class="hero-title" :aria-label="t.hero.aria">
          <span class="hero-title__line"><span>{{ t.hero.first }}</span></span>
          <span class="hero-title__line hero-title__line--outline"><span>{{ t.hero.second }}</span></span>
        </h1>
        <div class="hero-footer"><button class="directional-action directional-action--dark directional-action--down" type="button" @click="scrollTo('projects')"><span>{{ t.hero.cta }}</span><i aria-hidden="true"><ArrowIcon direction="down" /></i></button></div>
      </section>

      <div class="paper-sheet">
        <section id="projects" class="projects-section section-pad">
          <div class="section-heading reveal"><h2>{{ t.sections.projects }}</h2><div class="filter-tabs" role="tablist" aria-label="Project filter"><button v-for="filter in localizedFilters" :key="filter.id" type="button" role="tab" :aria-selected="activeFilter === filter.id" :class="{ active: activeFilter === filter.id }" @click="setFilter(filter.id)">{{ filter.label }}</button></div></div>
          <div class="project-list">
            <ProjectCard
              v-for="(project, index) in filteredProjects"
              :key="project.id"
              :project="project"
              :position="cardPosition(index)"
              :labels="t.projectLabels"
              @open="selectedProject = $event"
            />
          </div>
        </section>

        <section id="services" class="capabilities section-pad">
          <div v-for="service in t.services" :key="service.title" class="capability-row reveal"><h3>{{ service.title }}</h3><p>{{ service.text }}</p></div>
        </section>

        <TestimonialsSection :key="currentLanguage" :content="t.reviews" />
      </div>

      <section id="contact" class="contact-section section-pad">
        <div class="contact-title reveal"><h2>{{ t.contact.title }}</h2><a class="directional-action directional-action--dark" href="https://t.me/DevSpaceWork" target="_blank" rel="noreferrer"><span>{{ t.contact.telegram }}</span><i aria-hidden="true"><ArrowIcon /></i></a></div>
        <div class="contact-links reveal">
          <div class="contact-links__row">
            <span>Telegram</span>
            <b class="contact-links__handles">
              <a href="https://t.me/cryvento" target="_blank" rel="noreferrer">@cryvento</a>
              <i>/</i>
              <a href="https://t.me/tonaryy" target="_blank" rel="noreferrer">@tonaryy</a>
              <i>/</i>
              <a href="https://t.me/DevSpaceWork" target="_blank" rel="noreferrer">@DevSpaceWork</a>
            </b>
            <i aria-hidden="true"><ArrowIcon /></i>
          </div>
          <a href="mailto:devspaceletters@gmail.com"><span>Email</span><b>devspaceletters@gmail.com</b><i aria-hidden="true"><ArrowIcon /></i></a>
        </div>
        <footer><button class="directional-action directional-action--dark directional-action--up" type="button" @click="scrollTo('top')"><span>{{ t.contact.top }}</span><i aria-hidden="true"><ArrowIcon direction="up" /></i></button></footer>
      </section>
    </main>
  </div>

  <Transition name="drawer"><ProjectDrawer v-if="selectedProject" :project="selectedProject" :labels="t.projectLabels" @close="selectedProject = null" /></Transition>
</template>
