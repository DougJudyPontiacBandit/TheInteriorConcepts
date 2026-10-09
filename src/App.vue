<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const menuOpen = ref(false)
const currentPage = ref(getPageFromPath())
const projects = [
  {
    id: 'taurus',
    title: 'Taurus Cafe',
    category: 'Cafe fit-out',
    description:
      'Warm timber finishes, custom service counters, and feature lighting come together to give this cafe its welcoming character.',
    images: [
      {
        src: '/works/taurus1.jpg',
        alt: 'Taurus Cafe interior showing the timber service counter and feature wall',
      },
      {
        src: '/works/taurus2.jpg',
        alt: 'Taurus Cafe timber feature wall, lighting, and service counter',
      },
      {
        src: '/works/taurus3.jpg',
        alt: 'Taurus Cafe fit-out with timber cabinetry and illuminated signage',
      },
    ],
  },
  {
    id: 'jtower',
    title: 'JTOWER',
    category: 'Interior project',
    description:
      'Explore the JTOWER interiors and the considered details captured throughout the project.',
    images: Array.from({ length: 8 }, (_, index) => ({
      src: `/works/Jtower/${index + 1}.jpg`,
      alt: `JTOWER interior project, view ${index + 1}`,
    })),
  },
  {
    id: 'galleria-residences',
    title: 'Galleria Residences',
    category: 'Condominium interior',
    description:
      'A contemporary condominium interior featuring custom cabinetry, warm wood finishes, and considered lighting.',
    images: Array.from({ length: 13 }, (_, index) => ({
      src: `/works/Galleria%20Residences/${index + 1}.jpg`,
      alt: `Galleria Residences condominium interior, view ${index + 1}`,
    })),
  },
  {
    id: 'tambuli-seaside-living',
    title: 'Tambuli Seaside Living Condominium',
    category: 'Condominium interior',
    description: 'Interior project views from Tambuli Seaside Living Condominium.',
    images: Array.from({ length: 8 }, (_, index) => ({
      src: `/works/Tambuli%20Seaside%20Living%20Condominium/${index + 1}.jpg`,
      alt: `Tambuli Seaside Living Condominium interior, view ${index + 1}`,
    })),
  },
  {
    id: 'royal-oceancrest-mactan',
    title: 'Royal Oceancrest Mactan',
    category: 'Condominium interior',
    description: 'Interior project views from Royal Oceancrest Mactan.',
    images: Array.from({ length: 9 }, (_, index) => ({
      src: `/works/Royal%20Oceancrest%20Mactan/${index + 1}.jpg`,
      alt: `Royal Oceancrest Mactan interior, view ${index + 1}`,
    })),
  },
  {
    id: 'amani-grand-residences',
    title: 'Amani Grand Residences',
    category: 'Condominium interior',
    description: 'Interior project views from Amani Grand Residences.',
    images: Array.from({ length: 2 }, (_, index) => ({
      src: `/works/Amani%20Grand%20Residences/${index + 1}.jpg`,
      alt: `Amani Grand Residences interior, view ${index + 1}`,
    })),
  },
  {
    id: 'volte-taft-east-gate',
    title: 'VOLTE @ Taft East Gate',
    category: 'Condominium interior',
    description: 'Interior project views from VOLTE @ Taft East Gate.',
    images: Array.from({ length: 4 }, (_, index) => ({
      src: `/works/VOLTE%20@%20Taft%20East%20Gate/${index + 1}.jpg`,
      alt: `VOLTE @ Taft East Gate interior, view ${index + 1}`,
    })),
  },
  {
    id: 'urban-deca-homes-banilad',
    title: 'Urban Deca Homes Banilad',
    category: 'Condominium interior',
    description: 'Interior project views from Urban Deca Homes Banilad.',
    images: Array.from({ length: 5 }, (_, index) => ({
      src: `/works/Urban%20Deca%20Homes%20Banilad/${index + 1}.jpg`,
      alt: `Urban Deca Homes Banilad interior, view ${index + 1}`,
    })),
  },
  {
    id: 'mandani-bay',
    title: 'Mandani Bay',
    category: 'Condominium interior',
    description: 'Interior project views from Mandani Bay.',
    images: Array.from({ length: 10 }, (_, index) => ({
      src: `/works/Mandani%20Bay/${index + 1}.jpg`,
      alt: `Mandani Bay condominium interior, view ${index + 1}`,
    })),
  },
]
const activeProject = ref(projects[0])
const activeProjectImage = ref(0)
const featuredVideo = ref(null)
const videoNeedsGesture = ref(false)
const videoError = ref(false)
const submitting = ref(false)
const feedback = ref('')
const feedbackIsError = ref(false)

const projectTypes = [
  'Condominium',
  'House',
  'Modular cabinets & fit-outs',
  'Other',
]

let galleryTouchStartX = 0

const form = ref({
  name: '',
  email: '',
  projectType: '',
  location: '',
  timeline: '',
  message: '',
  website: '',
})

function getPageFromPath() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  return {
    '/projects': 'projects',
    '/portfolio': 'projects',
    '/about': 'about',
    '/contact': 'contact',
  }[path] || 'home'
}

function syncPageFromPath() {
  currentPage.value = getPageFromPath()
}

function navigate(path) {
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path)
  }

  syncPageFromPath()
  closeMenu()
  window.scrollTo(0, 0)
}

function closeMenu() {
  menuOpen.value = false
}

function selectProject(project) {
  activeProject.value = project
  activeProjectImage.value = 0
}

function openProject(project) {
  selectProject(project)
  navigate('/projects')
}

function showProjectImage(index) {
  activeProjectImage.value =
    (index + activeProject.value.images.length) % activeProject.value.images.length
}

function formatCounter(value) {
  return String(value).padStart(2, '0')
}

function handleGalleryTouchStart(event) {
  galleryTouchStartX = event.changedTouches[0].clientX
}

function handleGalleryTouchEnd(event) {
  const distance = event.changedTouches[0].clientX - galleryTouchStartX
  if (Math.abs(distance) > 45) {
    showProjectImage(activeProjectImage.value + (distance < 0 ? 1 : -1))
  }
}

async function playFeaturedVideo() {
  if (!featuredVideo.value) return

  try {
    await featuredVideo.value.play()
    videoNeedsGesture.value = false
    videoError.value = false
  } catch (error) {
    if (error instanceof DOMException && error.name === 'NotAllowedError') {
      videoNeedsGesture.value = true
      return
    }

    videoError.value = true
  }
}

watch(currentPage, async (page) => {
  if (page === 'home') {
    await nextTick()
    void playFeaturedVideo()
  }
})

onMounted(() => {
  window.addEventListener('popstate', syncPageFromPath)
  void playFeaturedVideo()
})
onBeforeUnmount(() => window.removeEventListener('popstate', syncPageFromPath))

async function submitInquiry(event) {
  submitting.value = true
  feedback.value = ''
  feedbackIsError.value = false

  try {
    const response = await fetch('https://formspree.io/f/xppqraej', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(event.currentTarget),
    })
    let result

    try {
      result = await response.json()
    } catch {
      throw new Error('The form service returned an unreadable response. Please try again or email us directly.')
    }

    if (!response.ok) {
      const serviceError = Array.isArray(result.errors)
        ? result.errors.map((item) => item.message).filter(Boolean).join(' ')
        : ''
      throw new Error(serviceError || 'We couldn’t send your message. Please try again.')
    }

    feedbackIsError.value = false
    feedback.value = 'Thanks for reaching out. Your inquiry has been sent; we’ll be in touch soon.'
    form.value = {
      name: '',
      email: '',
      projectType: '',
      location: '',
      timeline: '',
      message: '',
      website: '',
    }
  } catch (error) {
    feedbackIsError.value = true
    feedback.value =
      error instanceof TypeError
        ? 'We couldn’t connect just now. Please email us directly at theinteriorconcepts2023@gmail.com.'
        : error instanceof Error
          ? error.message
          : 'We couldn’t send your message. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <header class="site-header">
    <a class="brand" href="/" aria-label="The Interior Concepts home" @click.prevent="navigate('/')">
      <img class="brand-mark" src="/logo.png" alt="" />
      <span class="brand-name">The Interior Concepts</span>
    </a>

    <button
      class="menu-toggle"
      type="button"
      :aria-expanded="menuOpen"
      aria-label="Toggle navigation"
      @click="menuOpen = !menuOpen"
    >
      <span></span><span></span>
    </button>

    <nav class="main-nav" :class="{ 'is-open': menuOpen }" aria-label="Main navigation">
      <a href="/projects" :aria-current="currentPage === 'projects' ? 'page' : undefined" @click.prevent="navigate('/projects')">Projects</a>
      <a href="/about" :aria-current="currentPage === 'about' ? 'page' : undefined" @click.prevent="navigate('/about')">About us</a>
      <a class="nav-contact" href="/contact" :aria-current="currentPage === 'contact' ? 'page' : undefined" @click.prevent="navigate('/contact')">Let’s talk <span>↗</span></a>
    </nav>
  </header>

  <main v-if="currentPage === 'home'">
    <section id="home" class="hero">
      <div class="hero-image" role="img" aria-label="A hand-drawn interior scene from The Interior Concepts"></div>
      <div class="hero-shade"></div>
      <div class="hero-content">
        <p class="eyebrow hero-eyebrow"><span></span> Interior design · Cabinets · Fit-outs</p>
        <h1>Spaces that<br />feel like <em>you.</em></h1>
        <p class="hero-copy">
          Thoughtful interiors for the everyday moments that make a house feel like home.
        </p>
        <a class="button button-light" href="/projects" @click.prevent="navigate('/projects')">Explore our projects <span>↗</span></a>
      </div>
      <div class="hero-note"><span>01</span> A more personal kind of interior</div>
      <a class="scroll-cue" href="#approach" aria-label="Scroll to our approach">↓</a>
    </section>

    <section id="approach" class="intro section-pad">
      <div class="intro-kicker">
        <span class="small-line"></span>
        <p class="eyebrow">A place to begin</p>
      </div>
      <div class="intro-main">
        <h2>Good design is<br />about <em>how you live.</em></h2>
        <div class="intro-aside">
          <p>
            Your home should work beautifully for the life happening inside it. We bring
            thoughtful design and practical details together to make every space feel
            considered, comfortable and distinctly yours.
          </p>
          <a class="text-link" href="/about" @click.prevent="navigate('/about')">Get to know us <span>↗</span></a>
        </div>
      </div>
      <div class="intro-index"><span>01</span> / A considered approach</div>
    </section>

    <section id="spaces" class="spaces section-pad">
      <div class="section-heading">
        <div>
          <p class="eyebrow"><span class="small-line"></span> Made for your kind of living</p>
          <h2>Room for <em>what matters.</em></h2>
        </div>
        <p class="section-description">
          From a first-home refresh to the details that pull a room together, we help make
          your space work harder and feel more like home.
        </p>
      </div>

      <div class="space-grid">
        <article class="space-card space-card-large">
          <div class="space-illustration illustration-condo">
            <span class="sun-disc"></span>
            <span class="window-frame"><i></i><i></i></span>
            <span class="plant plant-one"><i></i><i></i><i></i></span>
            <span class="sofa"><i></i><i></i></span>
            <span class="side-table"></span>
            <span class="floor-line"></span>
          </div>
          <div class="space-card-copy">
            <span class="card-number">01</span>
            <div><h3>Condominium interiors</h3><p>Make every square metre feel like yours.</p></div>
            <a href="/contact" aria-label="Ask about condominium interiors" @click.prevent="navigate('/contact')">↗</a>
          </div>
        </article>

        <article class="space-card">
          <div class="space-illustration illustration-home">
            <span class="sun-disc"></span>
            <span class="arch arch-one"></span>
            <span class="arch arch-two"></span>
            <span class="plant plant-two"><i></i><i></i><i></i></span>
            <span class="low-cabinet"><i></i><i></i><i></i></span>
            <span class="floor-line"></span>
          </div>
          <div class="space-card-copy">
            <span class="card-number">02</span>
            <div><h3>Homes & living spaces</h3><p>Comfortable, considered rooms for real life.</p></div>
            <a href="/contact" aria-label="Ask about home interiors" @click.prevent="navigate('/contact')">↗</a>
          </div>
        </article>

        <article class="space-card">
          <div class="space-illustration illustration-cabinet">
            <span class="cabinet-tall"><i></i><i></i><i></i><i></i></span>
            <span class="cabinet-low"><i></i><i></i><i></i></span>
            <span class="vase"></span>
            <span class="floor-line"></span>
          </div>
          <div class="space-card-copy">
            <span class="card-number">03</span>
            <div><h3>Modular cabinets & fit-outs</h3><p>Smart storage, made to fit your space.</p></div>
            <a href="/contact" aria-label="Ask about modular cabinets and fit-outs" @click.prevent="navigate('/contact')">↗</a>
          </div>
        </article>
      </div>
      <p class="visual-note">Explore recent spaces and fit-outs in our project gallery.</p>
    </section>

    <section class="featured-work section-pad">
      <div class="featured-work-heading">
        <div>
          <p class="eyebrow"><span class="small-line"></span> A closer look</p>
          <h2>Made with care.<br /><em>Made to feel right.</em></h2>
        </div>
        <a class="text-link" href="/projects" @click.prevent="navigate('/projects')">See all projects <span>↗</span></a>
      </div>
      <div class="home-feature-grid">
        <a
          v-for="(project, index) in projects"
          :key="project.id"
          class="home-feature-card home-feature-project"
          href="/projects"
          :aria-label="`Explore the ${project.title} project`"
          @click.prevent="openProject(project)"
        >
          <img :src="project.images[0].src" :alt="project.images[0].alt" loading="lazy" />
          <span class="home-feature-label">
            <span>{{ formatCounter(index + 1) }} · {{ project.category }}</span>
            <strong>{{ project.title }}</strong>
          </span>
          <span class="home-feature-arrow" aria-hidden="true">↗</span>
        </a>
      </div>
    </section>

    <section class="film-feature section-pad">
      <div class="film-feature-inner">
        <div class="film-feature-copy">
          <p class="eyebrow"><span class="small-line"></span> The work, in motion</p>
          <h2>Step inside<br /><em>the details.</em></h2>
          <p>Take a closer look at an interior project and the thoughtful details that bring it together.</p>
        </div>
        <div class="film-feature-player">
          <video
            ref="featuredVideo"
            autoplay
            controls
            playsinline
            preload="auto"
            aria-label="Featured interior project film"
            @error="videoError = true"
          >
            <source src="/videos/video1.mp4" type="video/mp4" />
            Your browser does not support embedded video.
          </video>
          <button
            v-if="videoNeedsGesture && !videoError"
            class="film-play-button"
            type="button"
            @click="playFeaturedVideo"
          >
            Play with sound <span>▶</span>
          </button>
          <p v-if="videoError" class="film-error" role="status">The featured film couldn’t be loaded. Please try again later.</p>
        </div>
      </div>
    </section>

    <section class="process section-pad">
      <div class="process-heading">
        <div class="process-heading-title">
          <p class="eyebrow"><span class="small-line"></span> The way we work</p>
          <h2>Good spaces start<br />with <em>good listening.</em></h2>
        </div>
        <p>Every project is different. We take time to understand what matters to you, then shape the details around your space and everyday life.</p>
      </div>
      <div class="process-steps">
        <article>
          <span>01</span>
          <h3>Listen</h3>
          <p>We start with your ideas, needs, and the way you want your space to feel.</p>
        </article>
        <article>
          <span>02</span>
          <h3>Plan</h3>
          <p>We explore the layout, materials, and details that make sense for your project.</p>
        </article>
        <article>
          <span>03</span>
          <h3>Bring it together</h3>
          <p>We work through the finishing touches to create a space that feels considered and personal.</p>
        </article>
      </div>
      <a class="process-cta" href="/contact" @click.prevent="navigate('/contact')">Have a space in mind? <span>Let’s talk ↗</span></a>
    </section>

  </main>

  <main v-else-if="currentPage === 'projects'" class="projects-page">
    <section class="page-heading section-pad">
      <p class="eyebrow"><span class="small-line"></span> Selected projects</p>
      <h1>Spaces shaped<br />around <em>real life.</em></h1>
      <p>A selection of spaces and details we’ve brought to life.</p>
    </section>
    <section class="projects-showcase section-pad">
      <div
        class="project-gallery"
        role="region"
        :aria-label="`${activeProject.title} project photos`"
        aria-roledescription="carousel"
        @touchstart.passive="handleGalleryTouchStart"
        @touchend.passive="handleGalleryTouchEnd"
        @keydown.left.prevent="showProjectImage(activeProjectImage - 1)"
        @keydown.right.prevent="showProjectImage(activeProjectImage + 1)"
        tabindex="0"
      >
        <div class="project-selector" role="group" aria-label="Choose a project">
          <button
            v-for="project in projects"
            :key="project.id"
            type="button"
            :aria-pressed="activeProject.id === project.id"
            @click="selectProject(project)"
          >
            <span>{{ project.category }}</span>
            <strong>{{ project.title }}</strong>
          </button>
        </div>
        <div class="project-gallery-visual">
          <div class="project-gallery-image">
            <img
              :src="activeProject.images[activeProjectImage].src"
              :alt="activeProject.images[activeProjectImage].alt"
            />
            <span class="gallery-counter">
              {{ formatCounter(activeProjectImage + 1) }}
              <i>/</i>
              {{ formatCounter(activeProject.images.length) }}
            </span>
          </div>
          <div class="project-gallery-thumbnails" :aria-label="`All ${activeProject.title} project photos`">
            <button
              v-for="(image, index) in activeProject.images"
              :key="image.src"
              type="button"
              :aria-label="`View photo ${index + 1} of ${activeProject.images.length}`"
              :aria-pressed="activeProjectImage === index"
              @click="showProjectImage(index)"
            >
              <img :src="image.src" :alt="image.alt" loading="lazy" />
            </button>
          </div>
        </div>
        <div class="project-gallery-details">
          <p class="eyebrow"><span class="small-line"></span> {{ activeProject.category }}</p>
          <h2>{{ activeProject.title }}</h2>
          <p>{{ activeProject.description }}</p>
          <div class="gallery-controls" aria-label="Project photo controls">
            <button class="gallery-arrow" type="button" aria-label="Previous project photo" @click="showProjectImage(activeProjectImage - 1)">←</button>
            <div class="gallery-dots" aria-label="Choose a project photo">
              <button
                v-for="(image, index) in activeProject.images"
                :key="image.src"
                type="button"
                :aria-label="`Show photo ${index + 1} of ${activeProject.images.length}`"
                :aria-pressed="activeProjectImage === index"
                @click="showProjectImage(index)"
              ></button>
            </div>
            <button class="gallery-arrow" type="button" aria-label="Next project photo" @click="showProjectImage(activeProjectImage + 1)">→</button>
          </div>
          <p class="gallery-hint">Swipe or use the arrows to explore the project.</p>
        </div>
      </div>
    </section>
    <section class="projects-cta section-pad">
      <p>Planning a space of your own?</p>
      <a class="button button-dark" href="/contact" @click.prevent="navigate('/contact')">Let’s talk <span>↗</span></a>
    </section>
  </main>

  <main v-else-if="currentPage === 'about'" class="standalone-page about-page">
    <section class="about">
      <div class="about-image">
        <img src="/about-logo.png" alt="The Interior Concepts logo" />
      </div>
      <div class="about-copy">
        <p class="eyebrow"><span class="small-line"></span> Who’s behind it</p>
        <h2>A little more<br />thought. A lot more <em>you.</em></h2>
        <p>
          The Interior Concepts is a design-focused team with a love for considered
          spaces, useful details and the way a home can make you feel. We listen first,
          work through the details with you, and shape a design around your space, needs
          and everyday life.
        </p>
        <p class="about-signoff">Your space. Your story. Thoughtfully considered.</p>
        <a class="button button-dark" href="/contact" @click.prevent="navigate('/contact')">Start a conversation <span>↗</span></a>
      </div>
      <span class="about-mark">TIC<span>®</span></span>
    </section>
  </main>

  <main v-else class="standalone-page contact-page">
    <section class="contact section-pad">
      <div class="contact-intro">
        <p class="eyebrow"><span class="small-line"></span> Your next chapter starts here</p>
        <h2>Let’s make<br />room for <em>better.</em></h2>
        <p>Tell us a little about your space. We’d love to hear what you have in mind.</p>
        <a class="contact-email" href="mailto:theinteriorconcepts2023@gmail.com">
          theinteriorconcepts2023@gmail.com <span>↗</span>
        </a>
      </div>

      <form
        class="contact-form"
        action="https://formspree.io/f/xppqraej"
        method="POST"
        @submit.prevent="submitInquiry"
      >
        <div class="form-row">
          <label>
            Your name
            <input v-model.trim="form.name" name="name" type="text" autocomplete="name" placeholder="How should we address you?" minlength="2" maxlength="100" required />
          </label>
          <label>
            Email address
            <input v-model.trim="form.email" name="email" type="email" autocomplete="email" placeholder="you@example.com" maxlength="254" required />
          </label>
        </div>
        <label>
          What are you dreaming up?
          <select v-model="form.projectType" name="projectType" required>
            <option disabled value="">Choose a project type</option>
            <option v-for="type in projectTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </label>
        <div class="form-row">
          <label>
            Where is your project?
            <input v-model.trim="form.location" name="location" type="text" autocomplete="address-level2" placeholder="City or area (optional)" maxlength="120" />
          </label>
          <label>
            When are you hoping to start?
            <select v-model="form.timeline" name="timeline">
              <option value="">Timeline is flexible</option>
              <option value="As soon as possible">As soon as possible</option>
              <option value="Within 1–3 months">Within 1–3 months</option>
              <option value="Within 3–6 months">Within 3–6 months</option>
              <option value="More than 6 months">More than 6 months</option>
            </select>
          </label>
        </div>
        <label>
          Tell us about your project
          <textarea v-model.trim="form.message" name="message" rows="4" minlength="10" maxlength="3000" placeholder="A few details about your space, ideas or timeline..." required></textarea>
        </label>
        <label class="form-trap" aria-hidden="true">
          Leave this field empty
          <input v-model="form.website" name="_gotcha" type="text" tabindex="-1" autocomplete="off" />
        </label>
        <div class="form-footer">
          <Transition name="feedback" mode="out-in">
            <p
              v-if="feedback"
              :key="feedback"
              class="form-feedback"
              :class="{ 'is-error': feedbackIsError, 'is-success': !feedbackIsError }"
              :role="feedbackIsError ? 'alert' : 'status'"
              :aria-live="feedbackIsError ? 'assertive' : 'polite'"
            >{{ feedback }}</p>
          </Transition>
          <button class="button button-dark" type="submit" :disabled="submitting">
            {{ submitting ? 'Sending…' : 'Send your enquiry' }} <span>↗</span>
          </button>
        </div>
      </form>
    </section>
  </main>

  <footer class="site-footer">
    <a class="footer-brand" href="/" @click.prevent="navigate('/')">
      <img src="/logo.png" alt="" />
      <span>The Interior Concepts<small>Modular cabinets and fit-outs</small></span>
    </a>
    <p>Thoughtful spaces, made personal.</p>
    <div class="footer-links">
      <a href="/projects" @click.prevent="navigate('/projects')">Projects</a>
      <a href="/about" @click.prevent="navigate('/about')">About us</a>
      <a href="/contact" @click.prevent="navigate('/contact')">Let’s talk ↗</a>
    </div>
    <span class="copyright">© {{ new Date().getFullYear() }} The Interior Concepts</span>
  </footer>
</template>
