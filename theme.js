/**
 * theme.js
 * Alterna entre o tema escuro (padrão do site) e o tema claro,
 * salvando a escolha do usuário no localStorage.
 */

(function () {
  const STORAGE_KEY = "portfolio-theme";
  const root = document.documentElement;

  function isLightActive() {
    return root.getAttribute("data-theme") === "light";
  }

  function updateToggleUI() {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;

    const light = isLightActive();
    btn.querySelector(".theme-icon").textContent = light ? "🌙" : "☀️";
    btn.setAttribute(
      "aria-label",
      light ? "Ativar tema escuro" : "Ativar tema claro"
    );
    btn.setAttribute("aria-pressed", String(light));
  }

  function applyTheme(theme) {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }
    updateToggleUI();
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (err) {
      /* localStorage indisponível: a escolha só vale para esta sessão */
    }
  }

  function toggleTheme() {
    const next = isLightActive() ? "dark" : "light";
    applyTheme(next);
    saveTheme(next);
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateToggleUI();
    const btn = document.getElementById("theme-toggle");
    if (btn) btn.addEventListener("click", toggleTheme);
  });
})();