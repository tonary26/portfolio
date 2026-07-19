<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProjectCard from './components/ProjectCard.vue'
import ProjectDrawer from './components/ProjectDrawer.vue'
import { filters, projects } from './data/projects'

gsap.registerPlugin(ScrollTrigger)

const ready = ref(false)
const progress = ref(0)
const activeFilter = ref('all')
const selectedProject = ref(null)
const mobileMenu = ref(false)
let revealObserver
let progressFrame
let scrollMotion

const filteredProjects = computed(() => activeFilter.value === 'all'
  ? projects
  : projects.filter((project) => project.category === activeFilter.value))

const loaderStage = computed(() => {
  if (progress.value < 28) return 'Подготавливаем среду'
  if (progress.value < 62) return 'Собираем проекты'
  if (progress.value < 92) return 'Настраиваем интерфейс'
  return 'Почти готово'
})

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
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible'))
  }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' })
  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element))
}

const animateHero = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  gsap.timeline({ defaults: { ease: 'power4.out' } })
    .from('.hero-title__line > span', { yPercent: 110, duration: 1.05, stagger: 0.11 })
    .from('.hero-footer > *', { opacity: 0, y: 20, duration: 0.7, stagger: 0.08 }, '-=0.55')
}

const setupScrollMotion = () => {
  scrollMotion?.revert()
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  scrollMotion = gsap.context(() => {
    gsap.utils.toArray('.project-visual').forEach((visual, index) => {
      const object = visual.querySelector('.project-media, .tenant-ui, .terminal-ui')
      if (!object) return

      const direction = index % 2 === 0 ? 1 : -1
      gsap.fromTo(object, {
        '--scroll-y': `${direction * -12}px`,
        '--scroll-rotate': `${direction * 0.65}deg`,
      }, {
        '--scroll-y': `${direction * 12}px`,
        '--scroll-rotate': `${direction * -0.65}deg`,
        ease: 'none',
        scrollTrigger: {
          trigger: visual,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.15,
        },
      })
    })
  })

  ScrollTrigger.refresh()
}

const setFilter = (id) => {
  activeFilter.value = id
}

const scrollTo = (id) => {
  mobileMenu.value = false
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

watch(filteredProjects, async () => { await nextTick(); setupReveals(); setupScrollMotion() })

onMounted(() => {
  const startedAt = performance.now()
  const tickProgress = (now) => {
    progress.value = Math.min(100, Math.round((now - startedAt) / 8))
    if (progress.value < 100) {
      progressFrame = window.requestAnimationFrame(tickProgress)
      return
    }
    window.setTimeout(() => {
      ready.value = true
      nextTick(() => {
        animateHero()
        setupReveals()
        setupScrollMotion()
      })
    }, 180)
  }
  progressFrame = window.requestAnimationFrame(tickProgress)
})

onBeforeUnmount(() => {
  revealObserver?.disconnect()
  scrollMotion?.revert()
  window.cancelAnimationFrame(progressFrame)
})
</script>

<template>
  <Transition name="preloader">
    <div v-if="!ready" class="preloader">
      <div class="preloader-top"><span>DEVSPACE</span><small>DIGITAL WORKSHOP</small></div>
      <div class="preloader-core">
        <div class="preloader-mark" aria-hidden="true"><span>S</span><i></i></div>
        <p>{{ loaderStage }}</p>
      </div>
      <div class="preloader-bottom">
        <div class="preloader-track"><i :style="{ transform: `scaleX(${progress / 100})` }"></i></div>
        <strong>{{ progress }}<small>%</small></strong>
      </div>
    </div>
  </Transition>

  <div class="site-shell">
    <header class="site-header">
      <button class="brand" type="button" @click="scrollTo('top')"><b>DEV</b><span>SPACE</span></button>
      <nav :class="{ open: mobileMenu }">
        <button type="button" @click="scrollTo('projects')">Проекты</button>
        <button type="button" @click="scrollTo('services')">Компетенции</button>
        <button class="nav-contact" type="button" @click="scrollTo('contact')">Контакты</button>
      </nav>
      <button class="menu-toggle" type="button" :aria-expanded="mobileMenu" aria-label="Меню" @click="mobileMenu = !mobileMenu"><span></span><span></span></button>
    </header>

    <main>
      <section id="top" class="hero-section">
        <h1 class="hero-title" aria-label="Создаём цифровые продукты">
          <span class="hero-title__line"><span>СОЗДАЁМ</span></span>
          <span class="hero-title__line hero-title__line--outline"><span>ПРОДУКТЫ</span></span>
        </h1>
        <div class="hero-footer"><p>Telegram-боты, веб-сервисы и интерфейсы под запуск.</p><button type="button" @click="scrollTo('projects')">Смотреть работы <span>↓</span></button></div>
      </section>

      <div class="paper-sheet">
        <section id="services" class="service-intro section-pad reveal">
          <p class="section-index">1 / ПОДХОД</p>
          <div><h2>От идеи до работающего процесса.</h2><p>Интерфейс, API, окружение и проверка реального сценария собираются в один запуск.</p></div>
        </section>

        <div class="marquee" aria-hidden="true"><div class="marquee-track"><span v-for="repeat in 2" :key="repeat">VUE.JS · PYTHON · LARAVEL · TELEGRAM API · DOCKER · PINIA · GSAP · BYBIT · WORDPRESS · </span></div></div>

        <section id="projects" class="projects-section section-pad">
          <div class="section-heading reveal"><div><p class="section-index">2 / ИЗБРАННЫЕ РАБОТЫ</p><h2>Проекты</h2></div><div class="filter-tabs" role="tablist" aria-label="Фильтр проектов"><button v-for="filter in filters" :key="filter.id" type="button" role="tab" :aria-selected="activeFilter === filter.id" :class="{ active: activeFilter === filter.id }" @click="setFilter(filter.id)">{{ filter.label }}</button></div></div>
          <Transition name="filter-swap" mode="out-in">
            <div :key="activeFilter" class="project-list">
              <ProjectCard
                v-for="(project, index) in filteredProjects"
                :key="project.id"
                :project="project"
                :position="cardPosition(index)"
                @open="selectedProject = $event"
              />
            </div>
          </Transition>
        </section>

        <section class="capabilities section-pad">
          <p class="section-index reveal">3 / КОМПЕТЕНЦИИ</p>
          <div class="capability-row reveal"><h3>Web & UI</h3><p>Vue, API-интеграции, адаптивность и production-сборка.</p><span>1</span></div>
          <div class="capability-row reveal"><h3>Telegram</h3><p>Боты, сигналы, команды, состояния и устойчивые уведомления.</p><span>2</span></div>
          <div class="capability-row reveal"><h3>Backend & Deploy</h3><p>Laravel, WordPress, REST, Docker, Nginx и VPS/хостинг.</p><span>3</span></div>
        </section>
      </div>

      <section id="contact" class="contact-section section-pad">
        <p class="section-index reveal">4 / СВЯЗЬ</p>
        <div class="contact-title reveal"><h2>Есть задача?</h2><a href="https://t.me/DevSpaceWork" target="_blank" rel="noreferrer">Обсудить в Telegram <span>↗</span></a></div>
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
            <i>↗</i>
          </div>
          <a href="mailto:devspaceletters@gmail.com"><span>Email</span><b>devspaceletters@gmail.com</b><i>↗</i></a>
        </div>
        <footer><span>DEVSPACE</span><span>VUE / VITE / GSAP</span><button type="button" @click="scrollTo('top')">Наверх ↑</button></footer>
      </section>
    </main>
  </div>

  <Transition name="drawer"><ProjectDrawer v-if="selectedProject" :project="selectedProject" @close="selectedProject = null" /></Transition>
</template>
