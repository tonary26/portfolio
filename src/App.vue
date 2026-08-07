<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import gsap from 'gsap'
import ArrowIcon from './components/ArrowIcon.vue'
import ProjectCard from './components/ProjectCard.vue'
import ProjectDrawer from './components/ProjectDrawer.vue'
import { filters, projects } from './data/projects'

const ready = ref(false)
const progress = ref(0)
const loaderComplete = ref(false)
const activeFilter = ref('all')
const selectedProject = ref(null)
const mobileMenu = ref(false)
let revealObserver
let progressFrame
let completionTimer
const mobileQuery = window.matchMedia('(max-width: 620px)')

const languages = [
  { id: 'en', label: 'EN', name: 'English' },
  { id: 'ro', label: 'RO', name: 'Romana' },
  { id: 'ru', label: 'RU', name: 'Русский' },
]

const savedLanguage = localStorage.getItem('devspace-language')
const currentLanguage = ref(languages.some((language) => language.id === savedLanguage) ? savedLanguage : 'ru')

const messages = {
  ru: {
    loader: ['Подготавливаем среду', 'Собираем проекты', 'Настраиваем интерфейс', 'Почти готово'],
    nav: { projects: 'Проекты', services: 'Компетенции', contact: 'Контакты', menu: 'Меню' },
    hero: { aria: 'От идеи – до продакшена', first: 'ОТ ИДЕИ –', second: 'ДО ПРОДАКШЕНА', cta: 'Смотреть работы' },
    filters: { all: 'Все проекты', web: 'Web-системы', bots: 'Telegram-боты' },
    sections: { projects: 'Проекты' },
    services: [
      { title: 'Web & UI', text: 'Vue, API-интеграции, адаптивность и production-сборка.' },
      { title: 'Telegram', text: 'Боты, сигналы, команды, состояния и устойчивые уведомления.' },
      { title: 'Backend & Deploy', text: 'Laravel, WordPress, REST, Docker, Nginx и VPS/хостинг.' },
    ],
    contact: { title: 'Есть задача?', telegram: 'Обсудить в Telegram', top: 'Наверх' },
    projectLabels: {
      more: 'Подробнее о проекте',
      open: 'Открыть сайт',
      openReady: 'Открыть готовый сайт',
      close: 'Закрыть',
      about: 'О проекте',
      features: 'Что реализовано',
      moreAria: (title) => `Подробнее о проекте ${title}`,
    },
  },
  en: {
    loader: ['Preparing the workspace', 'Loading projects', 'Tuning the interface', 'Almost ready'],
    nav: { projects: 'Projects', services: 'Expertise', contact: 'Contact', menu: 'Menu' },
    hero: { aria: 'From idea to production', first: 'FROM IDEA -', second: 'TO PRODUCTION', cta: 'View work' },
    filters: { all: 'All projects', web: 'Web systems', bots: 'Telegram bots' },
    sections: { projects: 'Projects' },
    services: [
      { title: 'Web & UI', text: 'Vue, API integrations, responsive interfaces, and production builds.' },
      { title: 'Telegram', text: 'Bots, signals, commands, states, and reliable notifications.' },
      { title: 'Backend & Deploy', text: 'Laravel, WordPress, REST, Docker, Nginx, and VPS/hosting setup.' },
    ],
    contact: { title: 'Have a task?', telegram: 'Discuss in Telegram', top: 'Back to top' },
    projectLabels: {
      more: 'Project details',
      open: 'Open site',
      openReady: 'Open live site',
      close: 'Close',
      about: 'About the project',
      features: 'What was built',
      moreAria: (title) => `More about ${title}`,
    },
  },
  ro: {
    loader: ['Pregatim spatiul', 'Incarcam proiectele', 'Ajustam interfata', 'Aproape gata'],
    nav: { projects: 'Proiecte', services: 'Competente', contact: 'Contact', menu: 'Meniu' },
    hero: { aria: 'De la idee la productie', first: 'DE LA IDEE -', second: 'LA PRODUCTIE', cta: 'Vezi lucrarile' },
    filters: { all: 'Toate proiectele', web: 'Sisteme web', bots: 'Boti Telegram' },
    sections: { projects: 'Proiecte' },
    services: [
      { title: 'Web & UI', text: 'Vue, integrari API, interfete responsive si build-uri de productie.' },
      { title: 'Telegram', text: 'Boti, semnale, comenzi, stari si notificari stabile.' },
      { title: 'Backend & Deploy', text: 'Laravel, WordPress, REST, Docker, Nginx si VPS/hosting.' },
    ],
    contact: { title: 'Ai un task?', telegram: 'Discutam pe Telegram', top: 'Sus' },
    projectLabels: {
      more: 'Detalii proiect',
      open: 'Deschide site-ul',
      openReady: 'Deschide site-ul live',
      close: 'Inchide',
      about: 'Despre proiect',
      features: 'Ce a fost realizat',
      moreAria: (title) => `Mai multe despre ${title}`,
    },
  },
}

const projectTranslations = {
  en: {
    'hotel-rai': {
      type: 'Website',
      subtitle: 'Premium hotel website in Tetyushi',
      description: 'Room catalog, bath complexes, photo gallery, and a fast booking path.',
      long: 'A fast visual route: guests view real photos, choose accommodation, and move straight to booking.',
      features: ['Responsive catalog and filters', 'Looped swipe carousels', 'Lightbox gallery', 'Yandex Maps and direct call'],
    },
    'tenant-system': {
      type: 'WordPress system',
      subtitle: 'Owner, tenant, and specialist dashboards',
      description: 'Apartments, roles, receipts, notifications, and a single protected sign-in. Access is issued by the client.',
      long: 'An extension of an existing WordPress plugin: role-based dashboards, several apartments per account, and correct sign-in routing. Users cannot register by themselves; the client grants access.',
      features: ['Single sign-in form', 'Role-based dashboards', 'Several apartments per account', 'Notifications and change history'],
    },
    'quoravo-moto': {
      type: 'Website',
      subtitle: 'Online store for motorcycle gear and accessories',
      description: 'Product catalog, cart, checkout, and a responsive shopping interface.',
      long: 'A commercial WordPress and WooCommerce site: category storefront, product pages, cart, payments, legal pages, and mobile version.',
      features: ['Catalog and product categories', 'Cart and checkout', 'Payment and legal pages', 'Responsive storefront'],
    },
    'motohelmets-shop': {
      type: 'WordPress / E-commerce',
      subtitle: 'Bilingual motorcycle helmet store for Spain and Europe',
      description: 'Store recovery from backups, GMC audit, local Docker stand, and safe production deployment.',
      long: 'The live store was fully restored locally from WordPress backups. Catalog, product pages, and checkout received EN/ES fixes for Google Merchant Center, delivery scenarios were added for three geographic zones, and a dedicated plugin was prepared to move changes to production safely.',
      features: ['Full local recovery from backup', 'EN/ES storefront and legal pages', 'Dynamic delivery times for three zones', 'Catalog batch processing and production plugin'],
    },
    padraqio: {
      type: 'WordPress / E-commerce',
      subtitle: 'Multilingual online store for padel products',
      description: 'Backup recovery and redesign of the storefront, product pages, and service pages in four languages.',
      long: 'The active WooCommerce store was restored locally from a full backup. The homepage, navigation, product pages, checkout, and legal sections were updated in English, Spanish, German, and Italian. A compact installation plugin was prepared for safe production transfer without reuploading a multi-gigabyte archive.',
      features: ['Local recovery from backup', 'Storefront and service pages in EN / ES / DE / IT', 'Responsive product pages and checkout', 'Compact installation plugin for production'],
    },
    'smart-money': {
      type: 'Telegram / Trading',
      subtitle: 'Auto-scanning Bybit and staged SMC signals',
      description: 'Automatic selection of liquid markets and SMC signals without a manual coin list.',
      long: 'The bot updates the market with bulk requests, filters volume, analyzes candles, and sends deduplicated ready-to-use signals.',
      features: ['Automatic market selection from 5M volume', 'BOS -> OB -> Rejection -> MSS', 'Signal history and deduplication', 'Containerized VPS launch'],
    },
    'short-bot-suite': {
      type: 'Bot suite',
      subtitle: 'Signals, pump analytics, and shared journal',
      description: 'Two bots: SHORT setups, pump analytics, RSI, ATR, and a shared journal.',
      long: 'A container suite with a shared trade journal, pump analytics, and automatic cleanup of unavailable markets.',
      features: ['Shared journal between containers', '365 days of market history', 'ATR / RSI / Volume analytics', 'Cleanup of unavailable symbols'],
    },
    'daily-liquidity-bot': {
      type: 'Telegram / Liquidity',
      subtitle: 'Breaks of the previous day high / low',
      description: 'Daily Bybit scanner from $5M volume with alerts when upper or lower liquidity is taken.',
      long: 'The bot scans the entire Bybit USDT market and immediately reports when price crosses the previous day high or low. The trading day starts at 03:00 Moscow time, with no RSI, ATR, or extra filters.',
      features: ['Market autoscan from $5M volume', 'Daily candles from 03:00 MSK', 'Previous day high / low break', 'Container autostart with unless-stopped'],
    },
    'sol-analytics-bot': {
      type: 'Telegram / Analytics',
      subtitle: 'Report for SOL, ZEC, HYPE, XAU, and XAG',
      description: 'Analytics bot for major instruments: daily boundaries, RSI, ATR, volumes, and proximity to levels.',
      long: 'The bot runs on a 15-minute timeframe and shows the previous day high / low, price position, RSI, ATR, and volumes. CoinGlass is not connected because there is no API key.',
      features: ['5 selected instruments', '15-minute timeframe', 'Daily boundaries and volumes', 'Report on proximity to high / low'],
    },
    'twelve-bot': {
      type: 'Telegram / Markets',
      subtitle: 'Currency and metals signals through Twelve Data',
      description: 'Forex and metals via Twelve Data with the existing SMC engine preserved.',
      long: 'Candles are normalized to a unified format, passed through the existing analyzer, and returned to Telegram through commands and callback buttons.',
      features: ['Forex and metals', '/help and /summary commands', 'Correct callback routing', 'Configurable instrument list'],
    },
    'smc-short-scanner': {
      type: 'Telegram / SMC Short',
      subtitle: 'Structural SHORT setups on Bybit',
      description: 'Scanner for active Bybit USDT futures: downward CHoCH, Bearish OB, return to zone, and entry confirmation.',
      long: 'The service runs on a 15-minute timeframe, first reporting that a setup is forming and then sending a confirmed SHORT entry. Unlike the pump bot, it is based on market structure and Order Block logic.',
      features: ['Scanning all active USDT futures', 'Downward CHoCH and Bearish Order Block', 'Setup forming notification', 'Confirmed SHORT entry'],
    },
    'p2p-bot': {
      type: 'Telegram / P2P',
      subtitle: 'Autoscan for USDT / MDL ads',
      description: 'P2P ad filter by price, limits, and allowlist access.',
      long: 'The service filters Binance P2P ads by limit intersection and price, then notifies only approved users.',
      features: ['/run and /stop commands', 'Limit intersection filter', 'Ad deduplication', 'UTC+3 and VPS deployment'],
    },
  },
  ro: {
    'hotel-rai': {
      type: 'Website',
      subtitle: 'Site premium pentru un hotel din Tetyushi',
      description: 'Catalog de camere, complexe de sauna, galerie foto si traseu rapid de rezervare.',
      long: 'Un traseu vizual rapid: oaspetii vad fotografii reale, aleg cazarea si trec direct la rezervare.',
      features: ['Catalog responsive si filtre', 'Carusele swipe in bucla', 'Galerie Lightbox', 'Yandex Maps si apel direct'],
    },
    'tenant-system': {
      type: 'Sistem WordPress',
      subtitle: 'Cabinete pentru proprietari, chiriasi si specialisti',
      description: 'Apartamente, roluri, chitante, notificari si autentificare protejata. Accesul este oferit de client.',
      long: 'Extinderea unui plugin WordPress existent: cabinete pe roluri, mai multe apartamente pe cont si rutare corecta la autentificare. Utilizatorii nu se pot inregistra singuri; clientul acorda accesul.',
      features: ['Formular unic de autentificare', 'Cabinete pe roluri', 'Mai multe apartamente pe cont', 'Notificari si istoric modificari'],
    },
    'quoravo-moto': {
      type: 'Website',
      subtitle: 'Magazin online de echipamente si accesorii moto',
      description: 'Catalog de produse, cos, checkout si interfata responsive pentru cumparatori.',
      long: 'Site comercial pe WordPress si WooCommerce: vitrina de categorii, pagini de produs, cos, plata, pagini juridice si versiune mobila.',
      features: ['Catalog si categorii de produse', 'Cos si checkout', 'Pagini de plata si juridice', 'Vitrina responsive'],
    },
    'motohelmets-shop': {
      type: 'WordPress / E-commerce',
      subtitle: 'Magazin bilingv de casti moto pentru Spania si Europa',
      description: 'Recuperare din backup, audit GMC, stand Docker local si deploy sigur in productie.',
      long: 'Magazinul live a fost restaurat complet local din backup-uri WordPress. Catalogul, paginile de produs si checkout-ul au primit corectii EN/ES pentru Google Merchant Center, au fost adaugate scenarii de livrare pentru trei zone geografice si a fost pregatit un plugin separat pentru transfer controlat in productie.',
      features: ['Restaurare locala completa din backup', 'Vitrina EN/ES si pagini juridice', 'Termene dinamice de livrare pentru trei zone', 'Procesare in masa a catalogului si plugin de productie'],
    },
    padraqio: {
      type: 'WordPress / E-commerce',
      subtitle: 'Magazin online multilingv pentru produse de padel',
      description: 'Restaurare din backup si refacerea vitrinei, paginilor de produs si paginilor de servicii in patru limbi.',
      long: 'Magazinul WooCommerce activ a fost restaurat local dintr-un backup complet. Homepage-ul, navigatia, paginile de produs, checkout-ul si sectiunile juridice au fost actualizate in engleza, spaniola, germana si italiana. Pentru transfer sigur a fost pregatit un plugin compact de instalare, fara reincarcarea unei arhive de mai multi GB.',
      features: ['Restaurare locala din backup', 'Vitrina si pagini de servicii in EN / ES / DE / IT', 'Pagini de produs si checkout responsive', 'Plugin compact de instalare pentru productie'],
    },
    'smart-money': {
      type: 'Telegram / Trading',
      subtitle: 'Scanare automata Bybit si semnale SMC etapizate',
      description: 'Selectie automata a pietelor lichide si semnale SMC fara lista manuala de monede.',
      long: 'Botul actualizeaza piata prin cereri bulk, filtreaza volumul, analizeaza lumanarile si trimite semnale gata de folosire fara duplicate.',
      features: ['Selectie automata a pietei de la 5M volum', 'BOS -> OB -> Rejection -> MSS', 'Istoric si deduplicare semnale', 'Lansare containerizata pe VPS'],
    },
    'short-bot-suite': {
      type: 'Suită de boti',
      subtitle: 'Semnale, analiza pump si jurnal comun',
      description: 'Doi boti: setup-uri SHORT, analiza pump, RSI, ATR si jurnal comun.',
      long: 'Suită de containere cu jurnal comun de tranzactii, analiza pump si curatare automata a pietelor indisponibile.',
      features: ['Jurnal comun intre containere', '365 de zile de istoric de piata', 'Analiza ATR / RSI / Volume', 'Curatarea simbolurilor indisponibile'],
    },
    'daily-liquidity-bot': {
      type: 'Telegram / Liquidity',
      subtitle: 'Strapungeri high / low ale zilei precedente',
      description: 'Scanner zilnic Bybit de la $5M volum, cu alerte cand este luata lichiditatea superioara sau inferioara.',
      long: 'Botul scaneaza intreaga piata Bybit USDT si raporteaza imediat cand pretul trece peste high sau low al zilei precedente. Ziua de trading incepe la 03:00 MSK, fara RSI, ATR sau filtre suplimentare.',
      features: ['Autoscan piata de la $5M volum', 'Lumanari zilnice de la 03:00 MSK', 'Strapungere high / low precedent', 'Container cu autostart unless-stopped'],
    },
    'sol-analytics-bot': {
      type: 'Telegram / Analytics',
      subtitle: 'Raport pentru SOL, ZEC, HYPE, XAU si XAG',
      description: 'Bot analitic pentru instrumente mari: limite zilnice, RSI, ATR, volume si apropiere de niveluri.',
      long: 'Botul ruleaza pe timeframe de 15 minute si arata high / low al zilei precedente, pozitia pretului, RSI, ATR si volumele. CoinGlass nu este conectat deoarece nu exista API key.',
      features: ['5 instrumente selectate', 'Timeframe de 15 minute', 'Limite zilnice si volume', 'Raport de apropiere de high / low'],
    },
    'twelve-bot': {
      type: 'Telegram / Markets',
      subtitle: 'Semnale pentru valute si metale prin Twelve Data',
      description: 'Forex si metale prin Twelve Data cu motorul SMC existent pastrat.',
      long: 'Lumanarile sunt normalizate intr-un format unic, trec prin analizatorul existent si revin in Telegram prin comenzi si butoane callback.',
      features: ['Forex si metale', 'Comenzi /help si /summary', 'Rutare callback corecta', 'Lista configurabila de instrumente'],
    },
    'smc-short-scanner': {
      type: 'Telegram / SMC Short',
      subtitle: 'Setup-uri SHORT structurale pe Bybit',
      description: 'Scanner pentru futures Bybit USDT active: CHoCH in jos, Bearish OB, revenire in zona si confirmarea intrarii.',
      long: 'Serviciul ruleaza pe timeframe de 15 minute, anunta mai intai ca setup-ul se formeaza, apoi trimite intrarea SHORT confirmata. Spre deosebire de botul de pump, baza este structura pietei si Order Block.',
      features: ['Scanarea tuturor futures USDT active', 'CHoCH in jos si Bearish Order Block', 'Notificare de setup in formare', 'Intrare SHORT confirmata'],
    },
    'p2p-bot': {
      type: 'Telegram / P2P',
      subtitle: 'Autoscan anunturi USDT / MDL',
      description: 'Filtru de anunturi P2P dupa pret, limite si acces allowlist.',
      long: 'Serviciul filtreaza anunturile Binance P2P dupa intersectia limitelor si pret, apoi notifica doar utilizatorii aprobati.',
      features: ['Comenzi /run si /stop', 'Filtru pentru intersectia limitelor', 'Deduplicare anunturi', 'UTC+3 si deploy pe VPS'],
    },
  },
}

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

const loaderStage = computed(() => {
  if (progress.value < 28) return t.value.loader[0]
  if (progress.value < 62) return t.value.loader[1]
  if (progress.value < 92) return t.value.loader[2]
  return t.value.loader[3]
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
  const mobile = mobileQuery.matches
  document.documentElement.classList.toggle('no-motion', reduced)
  document.documentElement.classList.toggle('motion-ready', !reduced)

  if (reduced) {
    document.querySelectorAll('.reveal').forEach((element) => {
      element.classList.add('is-visible', 'is-copy-visible', 'is-visual-visible')
    })
    return
  }

  document.querySelectorAll('.project-card.reveal').forEach((card) => {
    const shown = card.classList.contains('is-visible')
      || (card.classList.contains('is-copy-visible') && card.classList.contains('is-visual-visible'))
    if (shown) card.classList.add('is-visible', 'is-copy-visible', 'is-visual-visible')
  })

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      if (entry.target.classList.contains('project-card__copy')) {
        entry.target.closest('.project-card')?.classList.add('is-copy-visible')
      } else if (entry.target.classList.contains('project-visual')) {
        entry.target.closest('.project-card')?.classList.add('is-visual-visible')
      } else {
        entry.target.classList.add('is-visible')
      }
      revealObserver?.unobserve(entry.target)
    })
  }, { threshold: 0.01, rootMargin: '0px 0px 18% 0px' })

  document.querySelectorAll('.reveal').forEach((element) => {
    if (mobile && element.classList.contains('project-card')) {
      const copy = element.querySelector('.project-card__copy')
      const visual = element.querySelector('.project-visual')
      if (copy) revealObserver.observe(copy)
      if (visual) revealObserver.observe(visual)
      return
    }
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

const onBreakpointChange = () => setupReveals()

onMounted(() => {
  document.documentElement.lang = currentLanguage.value
  mobileQuery.addEventListener('change', onBreakpointChange)
  const startedAt = performance.now()
  const tickProgress = (now) => {
    progress.value = Math.min(100, Math.round((now - startedAt) / 8))
    if (progress.value < 100) {
      progressFrame = window.requestAnimationFrame(tickProgress)
      return
    }
    loaderComplete.value = true
    completionTimer = window.setTimeout(() => {
      ready.value = true
      nextTick(() => {
        animateHero()
        setupReveals()
      })
    }, 1250)
  }
  progressFrame = window.requestAnimationFrame(tickProgress)
})

onBeforeUnmount(() => {
  mobileQuery.removeEventListener('change', onBreakpointChange)
  revealObserver?.disconnect()
  window.cancelAnimationFrame(progressFrame)
  window.clearTimeout(completionTimer)
})
</script>

<template>
  <Transition name="preloader">
    <div v-if="!ready" class="preloader">
      <div class="preloader-top"><span>DEVSPACE</span></div>
      <div class="preloader-core" :class="{ 'is-complete': loaderComplete }">
        <div class="preloader-mark" :class="{ 'is-complete': loaderComplete }" aria-hidden="true"><span class="preloader-letter">D</span><span class="preloader-word"><b>DEV</b><em>SPACE</em></span></div>
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
        <button type="button" @click="scrollTo('projects')">{{ t.nav.projects }}</button>
        <button type="button" @click="scrollTo('services')">{{ t.nav.services }}</button>
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
        <div class="marquee" aria-hidden="true"><div class="marquee-track"><span v-for="repeat in 2" :key="repeat">VUE.JS · PYTHON · LARAVEL · TELEGRAM API · DOCKER · PINIA · GSAP · BYBIT · WORDPRESS · </span></div></div>

        <section id="projects" class="projects-section section-pad">
          <div class="section-heading reveal"><h2>{{ t.sections.projects }}</h2><div class="filter-tabs" role="tablist" aria-label="Project filter"><button v-for="filter in localizedFilters" :key="filter.id" type="button" role="tab" :aria-selected="activeFilter === filter.id" :class="{ active: activeFilter === filter.id }" @click="setFilter(filter.id)">{{ filter.label }}</button></div></div>
          <Transition name="filter-swap" mode="out-in" @after-enter="setupReveals">
            <div :key="activeFilter" class="project-list">
              <ProjectCard
                v-for="(project, index) in filteredProjects"
                :key="project.id"
                :project="project"
                :position="cardPosition(index)"
                :labels="t.projectLabels"
                @open="selectedProject = $event"
              />
            </div>
          </Transition>
        </section>

        <section id="services" class="capabilities section-pad">
          <div v-for="service in t.services" :key="service.title" class="capability-row reveal"><h3>{{ service.title }}</h3><p>{{ service.text }}</p></div>
        </section>
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
