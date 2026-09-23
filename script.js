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
