function initNavigation() {
  const menuButton = document.querySelector(".mb");
  const navigation = document.querySelector("#main-menu");

  if (!menuButton || !navigation) {
    return;
  }

  function closeMenu() {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menu");
  }

  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Fechar menu" : "Abrir menu",
    );
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });
}

function initCarouselControls() {
  document.querySelectorAll(".ar button").forEach((button) => {
    button.addEventListener("click", () => {
      const carousel = document.getElementById(button.dataset.t);
      const firstCard = carousel?.firstElementChild;

      if (!carousel || !firstCard) {
        return;
      }

      const styles = window.getComputedStyle(carousel);
      const gap = Number.parseFloat(styles.columnGap) || 0;
      const direction = Number(button.dataset.d);

      carousel.scrollBy({
        left: direction * (firstCard.getBoundingClientRect().width + gap),
        behavior: "auto",
      });
    });
  });
}

function initHeroCarousel() {
  const hero = document.querySelector(".hero");
  const slides = [...document.querySelectorAll(".slide")];
  const indicators = [...document.querySelectorAll(".dots button")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!hero || slides.length === 0 || slides.length !== indicators.length) {
    return;
  }

  let activeIndex = slides.findIndex((slide) => slide.classList.contains("on"));
  let timer;
  let isHovered = false;
  let hasFocus = false;

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle("on", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
      slide.inert = !isActive;
    });

    indicators.forEach((indicator, indicatorIndex) => {
      const isActive = indicatorIndex === activeIndex;
      indicator.classList.toggle("on", isActive);
      indicator.setAttribute("aria-pressed", String(isActive));
    });
  }

  function stopAutoplay() {
    window.clearInterval(timer);
  }

  function updateAutoplay() {
    stopAutoplay();

    if (reducedMotion.matches || isHovered || hasFocus || document.hidden) {
      return;
    }

    timer = window.setInterval(() => {
      showSlide(activeIndex + 1);
    }, 6000);
  }

  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      showSlide(index);
      updateAutoplay();
    });
  });

  hero.addEventListener("pointerenter", () => {
    isHovered = true;
    updateAutoplay();
  });

  hero.addEventListener("pointerleave", () => {
    isHovered = false;
    updateAutoplay();
  });

  hero.addEventListener("focusin", () => {
    hasFocus = true;
    updateAutoplay();
  });

  hero.addEventListener("focusout", (event) => {
    if (!hero.contains(event.relatedTarget)) {
      hasFocus = false;
      updateAutoplay();
    }
  });

  reducedMotion.addEventListener("change", updateAutoplay);
  document.addEventListener("visibilitychange", updateAutoplay);
  showSlide(Math.max(activeIndex, 0));
  updateAutoplay();
}

initNavigation();
initCarouselControls();
initHeroCarousel();
