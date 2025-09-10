async function loadHeader() {
  const headerEl = document.getElementById("header");
  const res = await fetch("/components/Header.html");
  const html = await res.text();
  headerEl.innerHTML = html;

  headerEl.addEventListener("click", (e) => {
    const target = e.target.closest("a[href^='#']");
    if (target) {
      e.preventDefault();
      const hash = target.getAttribute("href");
      if (hash) {
        location.hash = hash;
      }
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  loadHeader();
});
