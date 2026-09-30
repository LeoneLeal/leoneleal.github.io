// Respeita quem tem "reduzir movimento" ativado no sistema
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// =====================================================
// LOADER: barra de progresso de ~3s antes de mostrar o site
// =====================================================
const loader = document.getElementById("loader");
const loaderProgress = document.getElementById("loader-progress");
const loaderPercent = document.getElementById("loader-percent");

function finishLoading() {
  if (loader) loader.classList.add("is-hidden");
  document.body.classList.remove("is-loading");
  document.body.classList.add("is-loaded");
}

if (loader && loaderProgress && loaderPercent) {
  document.body.classList.add("is-loading");
  document.body.style.overflow = "hidden";

  if (prefersReducedMotion) {
    finishLoading();
    document.body.style.overflow = "";
  } else {
    const DURATION = 3000;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / DURATION, 1);
      const percent = Math.round(progress * 100);

      loaderProgress.style.width = `${percent}%`;
      loaderPercent.textContent = `${percent}%`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          finishLoading();
          document.body.style.overflow = "";
        }, 200);
      }
    }

    requestAnimationFrame(tick);
  }
} else {
  document.body.classList.add("is-loaded");
}

// =====================================================
// REVEAL AO ROLAR
// =====================================================
const revealEls = document.querySelectorAll(".reveal");

if (revealEls.length) {
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }
}

// =====================================================
// PARALAXE SUTIL DA CONSTELAÇÃO NO HERO
// =====================================================
const constellation = document.querySelector(".constellation");
const heroSection = document.querySelector(".hero");

if (constellation && heroSection && !prefersReducedMotion) {
  heroSection.addEventListener("mousemove", (event) => {
    const rect = heroSection.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    constellation.style.transform = `translate(${x * -14}px, ${y * -14}px)`;
  });

  heroSection.addEventListener("mouseleave", () => {
    constellation.style.transform = "translate(0, 0)";
  });
}

// =====================================================
// DESFOQUE AO NAVEGAR ENTRE SEÇÕES (clique em links internos)
// =====================================================
const mainEl = document.querySelector("main");
const internalLinks = document.querySelectorAll('a[href^="#"]');

if (mainEl && internalLinks.length && !prefersReducedMotion) {
  let scrollEndTimer;

  const clearBlurWhenScrollEnds = () => {
    clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(() => {
      mainEl.classList.remove("is-scrolling");
      window.removeEventListener("scroll", clearBlurWhenScrollEnds);
    }, 150);
  };

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href").slice(1);
      const target = document.getElementById(targetId || "top");
      if (!target) return;

      event.preventDefault();
      mainEl.classList.add("is-scrolling");

      window.addEventListener("scroll", clearBlurWhenScrollEnds);
      clearBlurWhenScrollEnds();

      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  });
}

// Realça o link do menu correspondente à seção visível no momento
const sections = document.querySelectorAll("main .section, .hero");
const navLinks = document.querySelectorAll(".nav a");

const setActive = (id) => {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;
    link.style.color = isActive ? "var(--text)" : "";
  });
};

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((section) => {
    if (section.id) observer.observe(section);
  });
}

// Formulário de contato: envia via Formspree sem sair da página
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitBtn = contactForm.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    formStatus.textContent = "Enviando...";
    formStatus.classList.remove("is-error", "is-success");

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        formStatus.textContent = "Mensagem enviada! Obrigado pelo contato.";
        formStatus.classList.add("is-success");
        contactForm.reset();
      } else {
        throw new Error("Falha no envio");
      }
    } catch (err) {
      formStatus.textContent =
        "Não consegui enviar agora. Tente novamente em instantes.";
      formStatus.classList.add("is-error");
    } finally {
      submitBtn.disabled = false;
    }
  });
}