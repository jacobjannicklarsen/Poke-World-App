const root = document.documentElement;
const button = document.getElementById("theme-toggle");
function setTheme(theme) {
    root.dataset.theme = theme;
    if (!button) return;
    button.textContent = theme === "dark" ? "☼" : "☾";
    button.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    button.setAttribute("aria-pressed", String(theme === "light"));
}
let savedTheme = "dark";
try { savedTheme = localStorage.getItem("pokemon-theme") || "dark"; } catch {}
setTheme(savedTheme === "light" ? "light" : "dark");
button?.addEventListener("click", () => {
    const theme = root.dataset.theme === "dark" ? "light" : "dark";
    setTheme(theme);
    try { localStorage.setItem("pokemon-theme", theme); } catch {}
});
