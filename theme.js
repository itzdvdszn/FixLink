// FixLink theme: light / dark. Load this in <head> on every page.
(function () {
  var KEY = "fixlink_theme", root = document.documentElement;
  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function systemDark() { return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches); }
  function current() { return saved() || (systemDark() ? "dark" : "light"); }
  function apply(theme) {
    root.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0b1220" : "#062b5c");
    var button = document.getElementById("themeToggle");
    if (button) {
      button.textContent = theme === "dark" ? "☀" : "☾";
      var label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
      button.setAttribute("aria-label", label);
      button.title = label;
    }
  }
  apply(current());
  document.addEventListener("DOMContentLoaded", function () {
    var button = document.createElement("button");
    button.id = "themeToggle";
    button.type = "button";
    button.className = "theme-toggle";
    button.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      try { localStorage.setItem(KEY, next); } catch (e) {}
      apply(next);
    });
    document.body.appendChild(button);
    apply(current());
  });
  if (window.matchMedia) {
    var query = window.matchMedia("(prefers-color-scheme: dark)");
    var onChange = function () { if (!saved()) apply(current()); };
    if (query.addEventListener) query.addEventListener("change", onChange);
  }
})();
