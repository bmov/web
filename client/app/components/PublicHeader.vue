<script setup>
onMounted(() => {
  /* Control Navbar */
  const navbar = document.querySelector("nav");
  const hideStart = 100;
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll < hideStart) {
      navbar.classList.remove("hide");
      lastScroll = currentScroll;
    }

    if (currentScroll > lastScroll) {
      navbar.classList.add("hide");
    } else {
      navbar.classList.remove("hide");
    }

    lastScroll = currentScroll;
  });

  const menu = document.querySelector(".fullscreen-menu");
  const openBtn = document.querySelector(".menu-btn");
  const closeBtn = menu.querySelector(".close-btn");
  const menuLinks = document.querySelectorAll('.fullscreen-menu a');

  openBtn.addEventListener("click", () => {
    menu.classList.add("active");
    closeBtn.focus();
  });

  closeBtn.addEventListener("click", () => {
    menu.classList.remove("active");
    openBtn.focus();
  });

  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
    });
  });

});
</script>

<style scoped>
/* NAV */
nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 3.5rem;
  transform: translateY(0);
  transition: transform .35s ease, background-color .35s ease;
}

nav.hide {
  transform: translateY(-100%);
}

nav.bg {
  background-color: #fff;
  mix-blend-mode: normal;
}

nav .brand {
  height: 32px;
}

nav .brand .hide {
  display: none;
}

nav .menu ul {
  display: flex;
  gap: 2.5rem;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
}

nav .menu a {
  position: relative;
  color: #000;
  text-decoration: none;
  font-size: 0.92rem;
  letter-spacing: 0.12em;
  font-weight: 600;
  padding-bottom: 0.2rem;
}

nav .menu a::after {
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

nav .menu a:hover::after,
nav .menu a.is-active::after {
  transform: scaleX(1);
}

.menu-btn {
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: none;
}

.fullscreen-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: -webkit-fill-available;
  height: 100dvh;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease;
}

.fullscreen-menu.active {
  opacity: 1;
  visibility: visible;
}

.fullscreen-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
  text-align: center;
}

.fullscreen-menu li {
  margin: 20px 0;
}

.fullscreen-menu a {
  color: white;
  text-decoration: none;
  font-size: 3rem;
  font-weight: bold;
  transition: color 0.3s;
}

.fullscreen-menu a:hover {
  color: #aaa;
}

.fullscreen-menu .close-btn {
  position: absolute;
  top: 1.8rem;
  right: 1.8rem;

  background: none;
  border: none;
  color: #fff;

  font-size: 2.5rem;
  cursor: pointer;
  line-height: 1;

  transition: color .2s;
}

.fullscreen-menu .close-btn:hover {
  color: #aaa;
}

@media (max-width:720px) {
  nav {
    padding: .8rem 1.5rem;
  }

  nav .menu ul {
    display: none
  }

  nav .menu-btn {
    display: block
  }
}
</style>

<template>
  <header>
    <div class="fullscreen-menu">
      <button class="close-btn" aria-label="Close menu">✕</button>
      <ul>
        <li>
          <RouterLink to="/#about">ABOUT</RouterLink>
        </li>
        <li>
          <RouterLink to="/blog" active-class="is-active">BLOG</RouterLink>
        </li>
        <li>
          <RouterLink to="/#contact">CONTACT</RouterLink>
        </li>
      </ul>
    </div>

    <nav>
      <div class="brand">
        <RouterLink to="/" :class="{ hide: $route.path === '/' }" :data-is-home="$route.path === '/'">
          <img src="/img/bmov.min.svg" height="32" alt="BMOV Home">
        </RouterLink>
      </div>
      <div class="menu">
        <ul>
          <li>
            <RouterLink to="/#about">ABOUT</RouterLink>
          </li>
          <li>
            <RouterLink to="/blog" active-class="is-active">BLOG</RouterLink>
          </li>
          <li>
            <RouterLink to="/#contact">CONTACT</RouterLink>
          </li>
        </ul>
        <button class="menu-btn">
          <span class="sr-only">Open menu</span>
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24"
            fill="none">
            <path d="M3 6H21M3 12H21M3 18H21" stroke="#000" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </nav>
  </header>
</template>
