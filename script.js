(function () {
  "use strict";

  var prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -------------------------------------------------------------
   * 1. Header Scroll Behavior & Hero Scroll Cue Fade
   * ----------------------------------------------------------- */
  var header = document.getElementById("main-header");
  var heroScroll = document.querySelector(".hero-scroll");
  var heroProgress = document.querySelector(".hero-progress");

  function onScroll() {
    var y = window.scrollY || window.pageYOffset || 0;
    if (header) {
      if (y > 80) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
    if (heroScroll) {
      heroScroll.classList.toggle("hidden", y > 40);
    }
    if (heroProgress) {
      heroProgress.classList.toggle("hidden", y > 40);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* -------------------------------------------------------------
   * 2. Slide-Over Navigation Drawer
   * ----------------------------------------------------------- */
  var burger = document.getElementById("burger-menu");
  var navOverlay = document.getElementById("nav-overlay");
  var navClose = document.getElementById("nav-close");

  function setDrawerOpen(isOpen) {
    if (!navOverlay) return;
    navOverlay.classList.toggle("open", isOpen);
    navOverlay.setAttribute("aria-hidden", isOpen ? "false" : "true");
    document.body.classList.toggle("menu-open", isOpen);
    if (burger) {
      burger.classList.toggle("active", isOpen);
      burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
  }

  if (burger) {
    burger.addEventListener("click", function () {
      var open = navOverlay && navOverlay.classList.contains("open");
      setDrawerOpen(!open);
    });
  }

  if (navClose) {
    navClose.addEventListener("click", function () {
      setDrawerOpen(false);
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener("click", function (e) {
      if (e.target === navOverlay) {
        setDrawerOpen(false);
      }
    });

    var drawerLinks = navOverlay.querySelectorAll(".nav-link");
    drawerLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        setDrawerOpen(false);
      });
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (navOverlay && navOverlay.classList.contains("open")) {
        setDrawerOpen(false);
      }
    }
  });

  /* -------------------------------------------------------------
   * 3. Home Hero 6s Slideshow
   * ----------------------------------------------------------- */
  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var progressButtons = Array.prototype.slice.call(
    document.querySelectorAll(".hero-progress-line")
  );
  var currentSlide = 0;
  var slideTimer = null;

  function showSlide(index) {
    if (!slides.length) return;
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach(function (slide, idx) {
      slide.classList.toggle("active", idx === currentSlide);
    });
    progressButtons.forEach(function (btn, idx) {
      btn.classList.toggle("active", idx === currentSlide);
      btn.setAttribute("aria-pressed", idx === currentSlide ? "true" : "false");
    });
  }

  function resetSlideTimer() {
    if (slideTimer) {
      clearInterval(slideTimer);
      slideTimer = null;
    }
    if (!prefersReducedMotion && slides.length > 1) {
      slideTimer = setInterval(function () {
        showSlide(currentSlide + 1);
      }, 6000);
    }
  }

  if (slides.length) {
    showSlide(0);
    resetSlideTimer();
    progressButtons.forEach(function (btn, idx) {
      btn.addEventListener("click", function () {
        showSlide(idx);
        resetSlideTimer();
      });
    });
  }

  /* -------------------------------------------------------------
   * 4. Scroll Reveal Animations (IntersectionObserver + Fallback)
   * ----------------------------------------------------------- */
  var revealItems = Array.prototype.slice.call(
    document.querySelectorAll(".fade-in-up, .reveal")
  );

  var albumCards = Array.prototype.slice.call(
    document.querySelectorAll(".album-grid-columns .album-card")
  );
  albumCards.forEach(function (card, idx) {
    card.style.transitionDelay = (idx % 2) * 80 + "ms";
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (el) {
      el.classList.add("visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -24px 0px",
      }
    );

    revealItems.forEach(function (el) {
      observer.observe(el);
    });

    setTimeout(function () {
      revealItems.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 120) {
          el.classList.add("visible");
        }
      });
    }, 450);
  }

  /* -------------------------------------------------------------
   * 5. Lazy Image Fade-in
   * ----------------------------------------------------------- */
  var lazyImages = Array.prototype.slice.call(
    document.querySelectorAll("img.dp-lazy")
  );
  lazyImages.forEach(function (img) {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add("loaded");
    } else {
      img.addEventListener("load", function () {
        img.classList.add("loaded");
      });
      img.addEventListener("error", function () {
        img.classList.add("loaded");
      });
    }
  });

  /* -------------------------------------------------------------
   * 6. Lightbox Viewer with Preloading & Touch Swipe
   * ----------------------------------------------------------- */
  var lightbox = document.getElementById("lightbox");
  var galleryItems = Array.prototype.slice.call(
    document.querySelectorAll(".gallery-item")
  );

  if (lightbox && galleryItems.length) {
    var lbImg = document.getElementById("lightbox-img");
    var lbWrap = lightbox.querySelector(".lightbox-image-wrapper");
    var lbCounter = document.getElementById("lightbox-counter");
    var lbProgress = document.getElementById("lightbox-progress-bar");
    var lbClose = lightbox.querySelector(".lightbox-close");
    var lbPrev = lightbox.querySelector(".lightbox-prev");
    var lbNext = lightbox.querySelector(".lightbox-next");
    var lbIndex = 0;
    var touchStartX = 0;

    var sources = galleryItems.map(function (item) {
      var img = item.querySelector("img");
      return {
        src: item.getAttribute("data-src") || (img ? img.getAttribute("src") : ""),
        alt: img ? img.getAttribute("alt") || "" : "",
      };
    });

    function pad2(n) {
      return n < 10 ? "0" + n : String(n);
    }

    function preloadIndex(i) {
      var target = sources[(i + sources.length) % sources.length];
      if (!target || !target.src) return;
      var pre = new Image();
      pre.referrerPolicy = "no-referrer";
      pre.src = target.src;
    }

    function renderLightbox(index) {
      lbIndex = (index + sources.length) % sources.length;
      var current = sources[lbIndex];
      if (lbImg && current) {
        lbImg.src = current.src;
        lbImg.alt = current.alt;
      }
      if (lbWrap && !prefersReducedMotion) {
        lbWrap.classList.remove("animating");
        void lbWrap.offsetWidth;
        lbWrap.classList.add("animating");
      }
      if (lbCounter) {
        lbCounter.textContent = pad2(lbIndex + 1) + " / " + pad2(sources.length);
      }
      if (lbProgress) {
        var pct = ((lbIndex + 1) / sources.length) * 100;
        lbProgress.style.width = pct + "%";
      }
      preloadIndex(lbIndex + 1);
      preloadIndex(lbIndex - 1);
    }

    function openLightbox(index) {
      renderLightbox(index);
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("menu-open");
    }

    function closeLightbox() {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("menu-open");
    }

    galleryItems.forEach(function (item, idx) {
      item.addEventListener("click", function () {
        openLightbox(idx);
      });
    });

    if (lbClose) lbClose.addEventListener("click", closeLightbox);
    if (lbPrev) {
      lbPrev.addEventListener("click", function () {
        renderLightbox(lbIndex - 1);
      });
    }
    if (lbNext) {
      lbNext.addEventListener("click", function () {
        renderLightbox(lbIndex + 1);
      });
    }

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox || e.target.classList.contains("lightbox-stage")) {
        closeLightbox();
      }
    });

    lightbox.addEventListener(
      "touchstart",
      function (e) {
        if (e.changedTouches && e.changedTouches[0]) {
          touchStartX = e.changedTouches[0].clientX;
        }
      },
      { passive: true }
    );

    lightbox.addEventListener(
      "touchend",
      function (e) {
        if (!e.changedTouches || !e.changedTouches[0]) return;
        var dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) >= 50) {
          if (dx < 0) {
            renderLightbox(lbIndex + 1);
          } else {
            renderLightbox(lbIndex - 1);
          }
        }
      },
      { passive: true }
    );

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") renderLightbox(lbIndex - 1);
      if (e.key === "ArrowRight") renderLightbox(lbIndex + 1);
    });
  }

  /* -------------------------------------------------------------
   * 7. Smooth Page Transition Fade (200ms)
   * ----------------------------------------------------------- */
  window.addEventListener("pageshow", function () {
    document.body.classList.remove("page-leaving");
  });

  if (!prefersReducedMotion) {
    document.addEventListener("click", function (e) {
      var anchor = e.target.closest("a");
      if (!anchor) return;
      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }
      var href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }
      try {
        var url = new URL(anchor.href, window.location.href);
        if (url.origin === window.location.origin && url.pathname.endsWith(".html")) {
          e.preventDefault();
          document.body.classList.add("page-leaving");
          setTimeout(function () {
            window.location.href = url.href;
          }, 200);
        }
      } catch (_err) {
        // Ignore invalid URLs
      }
    });
  }

  /* -------------------------------------------------------------
   * 8. English Contact Form Feedback
   * ----------------------------------------------------------- */
  var contactForm = document.getElementById("dp-contact-form");
  var contactStatus = document.getElementById("dp-contact-status");
  if (contactForm && contactStatus) {
    contactForm.addEventListener("submit", function (e) {
      var action = contactForm.getAttribute("action") || "";
      if (!action || action === "#") {
        e.preventDefault();
        contactStatus.textContent =
          "Thank you for your message. Your inquiry has been prepared for info@dominikphotofficial.lt.";
        contactStatus.classList.add("visible");
        contactForm.reset();
      }
    });
  }
})();
