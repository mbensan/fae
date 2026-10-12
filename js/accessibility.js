let lastFocus = null;

export function focusMain() {
  const main = document.getElementById("main-content");
  if (main) main.focus({ preventScroll: true });
}

export function trapFocus(dialog) {
  const focusable = dialog.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (first) first.focus();

  function onKey(event) {
    if (event.key !== "Tab" || focusable.length === 0) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
  dialog.addEventListener("keydown", onKey);
  dialog.dataset.trap = "1";
  return () => dialog.removeEventListener("keydown", onKey);
}

export function openDialog(dialog, render) {
  lastFocus = document.activeElement;
  render();
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
  trapFocus(dialog);
}

export function closeDialog(dialog) {
  if (dialog.open) dialog.close();
  if (lastFocus && typeof lastFocus.focus === "function") {
    lastFocus.focus();
  }
}

export function applyPreferences() {
  const large = localStorage.getItem("desafioAcoge:text") === "large";
  const contrast = localStorage.getItem("desafioAcoge:contrast") === "high";
  document.body.classList.toggle("text-large", large);
  document.body.classList.toggle("contrast-high", contrast);
}

export function togglePreference(key, value, className) {
  const enabled = value === "on";
  localStorage.setItem(key, enabled ? (key.endsWith("text") ? "large" : "high") : "off");
  applyPreferences();
  document.body.classList.toggle(className, enabled);
}
