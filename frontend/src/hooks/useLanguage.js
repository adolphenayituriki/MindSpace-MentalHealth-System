import { getLanguage, setLanguage } from '../i18n/i18n';

export function useLanguage() {
  return {
    getLanguage,
    setLanguage,
  };
}
