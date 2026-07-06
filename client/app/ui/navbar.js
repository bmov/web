export const scrollEvent = () => {
  const navbar = document.querySelector('nav');
  const navbarBrand = navbar.querySelector('.brand a');
  navbar.classList.remove('bg');
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    navbar.classList.add('bg');
  } else {
    navbar.classList.remove('bg');
  }

  if (navbarBrand.getAttribute('data-is-home') === 'true') {
    if (currentScroll > 100) {
      navbarBrand.classList.remove('hide');
    } else {
      navbarBrand.classList.add('hide');
    }
  }
};
