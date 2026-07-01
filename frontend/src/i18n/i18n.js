import en from './en.json';
import rw from './rw.json';

const translations = { en, rw };

let currentLang = localStorage.getItem('mindspace_lang') || 'en';

export function t(key) {
  const keys = key.split('.');
  let val = translations[currentLang];
  for (const k of keys) {
    val = val?.[k];
  }
  return val || key;
}

export function setLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem('mindspace_lang', lang);
    return true;
  }
  return false;
}

export function getLanguage() {
  return currentLang;
}

export function useTranslation() {
  return { t, setLanguage, getLanguage, currentLang };
}
