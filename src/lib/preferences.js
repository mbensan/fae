const TEXT_KEY = "desafioAcoge:text";
const CONTRAST_KEY = "desafioAcoge:contrast";

export function applyPreferences() {
  const large = localStorage.getItem(TEXT_KEY) === "large";
  const contrast = localStorage.getItem(CONTRAST_KEY) === "high";
  document.body.classList.toggle("text-large", large);
  document.body.classList.toggle("contrast-high", contrast);
}

export function readPreferences() {
  return {
    largeText: localStorage.getItem(TEXT_KEY) === "large",
    highContrast: localStorage.getItem(CONTRAST_KEY) === "high"
  };
}

export function setLargeText(enabled) {
  localStorage.setItem(TEXT_KEY, enabled ? "large" : "off");
  applyPreferences();
}

export function setHighContrast(enabled) {
  localStorage.setItem(CONTRAST_KEY, enabled ? "high" : "off");
  applyPreferences();
}
