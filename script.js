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
