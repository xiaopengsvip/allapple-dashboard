'use client';

import { ReactNode, useState, useEffect } from 'react';
import i18n from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import zh from '@/locales/zh.json';
import en from '@/locales/en.json';

export default function I18nProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(i18n.isInitialized);

  useEffect(() => {
    if (!i18n.isInitialized) {
      const saved = localStorage.getItem('eoc-locale') || 'zh';
      i18n.use(initReactI18next).init({
        resources: {
          zh: { translation: zh },
          en: { translation: en },
        },
        lng: saved,
        fallbackLng: 'zh',
        interpolation: { escapeValue: false },
      }).then(() => {
        setReady(true);
      });
    } else {
      // Already initialized, check if language needs update
      const saved = localStorage.getItem('eoc-locale');
      if (saved && saved !== i18n.language) {
        i18n.changeLanguage(saved);
      }
      setReady(true);
    }
  }, []);

  if (!ready) return null; // 不渲染子组件直到 i18n 就绪

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
