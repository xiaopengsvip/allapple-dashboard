'use client';

import { useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zh from '@/locales/zh.json';
import en from '@/locales/en.json';

let initialized = false;

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!initialized) {
      const saved = localStorage.getItem('eoc-locale') || 'zh';
      i18n.use(initReactI18next).init({
        resources: {
          zh: { translation: zh },
          en: { translation: en },
        },
        lng: saved,
        fallbackLng: 'zh',
        interpolation: { escapeValue: false },
      });
      initialized = true;
    }
  }, []);

  return <>{children}</>;
}
