<script setup>
import "@cap.js/widget";
import { scrollEvent } from '~/ui/navbar';
import { sendContactMessage } from '~/services/contact';

const config = useRuntimeConfig();

const form = reactive({
  name: '',
  email: '',
  message: '',
});

const isSubmitting = ref(false);
const formError = ref('');
const formSuccess = ref('');
const capToken = ref('');

const resetFeedback = () => {
  formError.value = '';
  formSuccess.value = '';
};

const handleSolve = (e) => {
  console.log("CAPTCHA Token:", e.detail.token);
  capToken.value = e.detail.token;
};

const handleError = (e) => {
  formError.value = 'CAPTCHA error';
  return;
};

const handleSubmitContact = async () => {
  resetFeedback();

  if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
    formError.value = 'Please fill in all required fields.';
    return;
  }

  isSubmitting.value = true;
  try {
    const { message } = await sendContactMessage({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
      capToken: capToken.value,
    });

    formSuccess.value = message ?? 'Your message has been sent successfully.';
    form.name = '';
    form.email = '';
    form.message = '';
  } catch (error) {
    formError.value = error?.message ?? 'Failed to send message. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};

useSeoMeta({
  title: ``,
})

onMounted(() => {
  const revealEls = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  /* Control Navbar */
  const navbar = document.querySelector("nav");
  navbar.classList.remove("bg");
  window.addEventListener("scroll", scrollEvent);
});
</script>

<template>
  <section class="hero" id="home">
    <div class="hero-inner">
      <div class="logo-box"><img src="/img/bmov.min.svg" height="64" alt="BMOV Logo"></div>
      <p>We are a software development team that shapes the future with cutting-edge technology.</p>
      <p class="gh"><a href="https://github.com/bmov" target="_blank" class="link">GITHUB</a></p>
    </div>
    <div class="scroll-cue">
      SCROLL DOWN
      <div class="arrow">↓</div>
    </div>
  </section>

  <section class="split-sec" id="about">
    <div class="sec1">
      <div class="sec1-inner" data-reveal>
        <h2 class="display">Move Fast</h2>
        <p class="lede">Faster than anyone, different from everyone.</p>
        <p class="sub">We move fast to seize opportunities before others do.</p>
      </div>
    </div>
    <div class="sec2">
      <div class="sec2-inner" data-reveal>
        <h2 class="display">Create Value</h2>
        <p class="lede">Speed in process, excellence in results.</p>
        <p class="sub">We turn that momentum into real value for our clients.</p>
      </div>
    </div>
  </section>

  <section class="team-sec" id="team">
    <div class="team-inner">
      <p class="team-eyebrow">OUR TEAM</p>
      <h2 class="display">About Members</h2>
      <p class="team-intro">We turn new ideas into reality and create services that make everyday life better.</p>
      <div class="team-grid">
        <div class="team-card">
          <div class="team-photo"><a href="https://github.com/rzglitch" target="_blank"><img
                src="https://avatars.githubusercontent.com/u/60917154?v=4" alt="Photo of rzglitch"></a></div>
          <p class="team-name">Douglas K. Han</p>
          <p class="team-handle"><a href="https://github.com/rzglitch" target="_blank"
              class="link font-soft">@rzglitch</a></p>
          <p class="team-role">Founder</p>
        </div>
      </div>
      <p class="team-join">Want to join us? <a href="#contact" class="link">Let’s do it together!</a></p>
    </div>
  </section>

  <section class="contact-sec" id="contact">
    <div class="contact-inner">
      <div>
        <p class="contact-eyebrow">GET IN TOUCH</p>
        <h2 class="display">Contact Us</h2>
        <p class="contact-intro">Have a message for us? Leave it here, and we'll get back to you soon.</p>
      </div>
      <form class="contact-form" @submit.prevent="handleSubmitContact">
        <div class="form-row">
          <label for="cf-name">Name</label>
          <input id="cf-name" v-model="form.name" type="text" placeholder="Your name" required>
        </div>
        <div class="form-row">
          <label for="cf-email">Email</label>
          <input id="cf-email" v-model="form.email" type="email" placeholder="you@company.com" required>
        </div>
        <div class="form-row">
          <label for="cf-message">Message</label>
          <textarea id="cf-message" v-model="form.message" rows="4" placeholder="Message" required></textarea>
        </div>
        <div class="form-row">
          <cap-widget :data-cap-api-endpoint="`${config.public.capEndpoint}/${config.public.capSiteKey}/`"
            @solve="handleSolve" @error="handleError">
          </cap-widget>
        </div>
        <p v-if="formError" class="form-feedback form-feedback-error">{{ formError }}</p>
        <p v-if="formSuccess" class="form-feedback form-feedback-success">{{ formSuccess }}</p>
        <button class="contact-submit" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Sending...' : 'Send Message' }}
        </button>
      </form>
    </div>
  </section>
</template>

<style scoped>
section {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* HERO */
.hero {
  background: var(--hero-bg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 3.5rem;
}

.hero-inner {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  animation: riseIn 0.9s ease both;
}

.logo-box {
  width: 220px;
  font-size: 1.35rem;
  margin-bottom: 2.2rem;
  letter-spacing: 0.02em;
}

.hero p {
  font-size: 1.35rem;
  line-height: 1.55;
  color: #787e82;
  max-width: 520px;
  margin: 0;
}

.gh {
  margin-top: 2rem !important;
}

.gh a {
  font-size: 1rem;
  color: #787e82 !important
}

a.link {
  position: relative;
  color: #000;
  text-decoration: none;
  font-weight: 600;
}

a.link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 100%;
  height: 2px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.35s ease;
}

a.link:hover::after {
  transform: scaleX(1);
}


.scroll-cue {
  position: absolute;
  bottom: 4.5rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  font-size: 0.78rem;
  letter-spacing: 0.22em;
  color: var(--ink-soft);
}

.scroll-cue .arrow {
  margin-top: 0.5rem;
  animation: bob 1.6s ease-in-out infinite;
}

/* SECTION 2 - Move Fast / Create Value (Single page, Diagonal 2-Column Split) */
.split-sec {
  position: relative;
  background: var(--sec2-bg);
  padding: 0;
}

.sec1 {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(to right, var(--sec1-bg) 0%, var(--sec1-bg) 45%, rgba(253, 240, 173, 0.55) 60%, rgba(253, 240, 173, 0) 80%), url(../img/ben-stern-wQNHTxEhIr8-unsplash.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: right center;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 14vh 0 0 3.5rem;
  clip-path: polygon(0 0, 100% 0, 100% 40%, 0 60%);
  z-index: 2;
}

.sec1 .display,
.sec2 .display {
  font-size: 6rem;
  line-height: 0.95;
  margin: 0 0 1.2rem 0;
}

.lede {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 0.6rem 0;
}

.sub {
  font-size: 1.15rem;
  color: var(--ink-soft);
  margin: 0;
}

.sec2 {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to left, var(--sec2-bg) 0%, var(--sec2-bg) 45%, rgba(182, 251, 232, 0.55) 60%, rgba(182, 251, 232, 0) 80%),
    url('../img/jakub-zerdzicki-fXlL5I0IvK0-unsplash.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: left center;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 0 3.5rem 14vh 0;
  text-align: right;
  clip-path: polygon(0 60%, 100% 40%, 100% 100%, 0 100%);
  z-index: 1;
}

/* TEAM */
.team-sec {
  background: var(--footer-bg);
  display: flex;
  align-items: center;
  padding: 8vh 3.5rem;
}

.team-inner {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
}

.team-eyebrow {
  font-size: 0.85rem;
  letter-spacing: 0.22em;
  color: var(--ink-soft);
  font-weight: 600;
  margin: 0 0 0.8rem 0;
}

.team-sec h2 {
  font-size: 4.2rem;
  line-height: 0.95;
  margin: 0 0 1.2rem 0;
}

.team-intro {
  font-size: 1.15rem;
  color: var(--ink-soft);
  max-width: 520px;
  margin: 0 0 5vh 0;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2.5rem;
}

.team-card {
  text-align: left;
}

.team-photo {
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1.3rem;
  background: var(--logo-gray);
  filter: grayscale(100%);
  transition: filter 0.4s ease, transform 0.4s ease;
}

.team-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.team-card:hover .team-photo {
  filter: grayscale(0%);
  transform: translateY(-4px);
}

.team-name {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 0.2rem 0;
}

.team-handle {
  font-size: 0.95rem;
  color: var(--ink-soft);
  margin: 0 0 0.6rem 0;
}

.team-role {
  font-size: 0.9rem;
  color: var(--ink-xsoft);
  margin: 0;
}

.team-join {
  margin-top: 4rem;
  text-align: center;
}

@media (max-width:900px) {
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .team-sec h2 {
    font-size: 3rem;
  }
}

@media (max-width:480px) {
  .team-grid {
    grid-template-columns: 1fr;
  }
}

/* CONTACT */
.contact-sec {
  background: var(--ink);
  color: #fff;
  display: flex;
  align-items: center;
  padding: 8vh 3.5rem;
}

.contact-inner {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5vw;
  align-items: center;
}

.contact-eyebrow {
  font-size: 0.85rem;
  letter-spacing: 0.22em;
  color: #a7a49b;
  font-weight: 600;
  margin: 0 0 0.8rem 0;
}

.contact-sec h2 {
  font-size: 4.2rem;
  line-height: 0.95;
  margin: 0 0 1.2rem 0;
  color: #fff;
}

.contact-intro {
  font-size: 1.15rem;
  color: #c7c4bb;
  max-width: 460px;
  margin: 0;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row label {
  font-size: 0.85rem;
  letter-spacing: 0.06em;
  color: #a7a49b;
}

.form-row input,
.form-row textarea {
  background: transparent;
  border: none;
  border-bottom: 1px solid #55524a;
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 1.05rem;
  padding: 0.6rem 0;
  outline: none;
  transition: border-color 0.3s ease;
  resize: none;
}

.form-row input:focus,
.form-row textarea:focus {
  border-color: #fff;
}

.form-row input::placeholder,
.form-row textarea::placeholder {
  color: #6f6c63;
}

.contact-submit {
  align-self: flex-start;
  margin-top: 0.5rem;
  padding: 0.9rem 2.2rem;
  background: #fff;
  color: var(--ink);
  border: none;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.contact-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.form-feedback {
  margin: 0;
  font-size: 0.92rem;
}

.form-feedback-error {
  color: #ff9b9b;
}

.form-feedback-success {
  color: #8de7b6;
}

.contact-submit:hover {
  background: #e7e7e5;
  transform: translateY(-2px);
}

@media (max-width:820px) {
  .contact-inner {
    grid-template-columns: 1fr;
    gap: 4vh;
  }

  .contact-sec h2 {
    font-size: 3rem;
  }
}

@keyframes bob {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(6px);
  }
}

/* MOBILE */
@media (max-width:960px) {
  nav {
    padding: 1.3rem 1.5rem;
    gap: 1.4rem;
  }

  .sec1 .display,
  .sec2 .display {
    font-size: 4rem;
  }

  .lede {
    font-size: 1.25rem
  }

  .sub {
    font-size: 1.1rem
  }

  .hero p {
    font-size: 1.1rem;
  }

  .split-sec {
    height: 1200px;
  }

  .sec1,
  .sec2 {
    position: relative;
    inset: auto;
    clip-path: none;
    height: 600px;
    width: 100%;
    padding: 3rem 1.5rem;
    justify-content: flex-start;
  }

  .sec1 {
    align-items: flex-start;
  }

  .sec2 {
    align-items: flex-start;
    justify-content: flex-end;
    text-align: right;
  }

  .sec1-inner,
  .sec2-inner {
    max-width: 100%;
  }

  /* MOBILE: Vertical gradient */
  .sec1 {
    background-image:
      linear-gradient(to bottom, var(--sec1-bg) 0%, var(--sec1-bg) 36%, rgba(253, 240, 173, 0.55) 50%, rgba(253, 240, 173, 0) 72%),
      url('../img/ben-stern-wQNHTxEhIr8-unsplash.jpg');
    background-position: center;
  }

  .sec2 {
    background-image:
      linear-gradient(to bottom, var(--sec2-bg) 0%, var(--sec2-bg) 36%, rgba(182, 251, 232, 0.55) 50%, rgba(182, 251, 232, 0) 72%),
      url('../img/jakub-zerdzicki-fXlL5I0IvK0-unsplash.jpg');
    background-position: center;
  }
}

@media (max-width:480px) {

  .sec1 .display,
  .sec2 .display {
    font-size: 2.5rem;
    margin: 0 0 .8rem 0;
  }

  .lede {
    font-size: 1.15rem;
    margin: 0 0 .5rem 0;
  }

  .sub {
    font-size: 1rem
  }

  .hero,
  .team-sec,
  .contact-sec {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}
</style>
