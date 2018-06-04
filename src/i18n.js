/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your app.
 *
 */
import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import zhLocaleData from 'react-intl/locale-data/zh';
import ptLocaleData from 'react-intl/locale-data/pt';
import ruLocaleData from 'react-intl/locale-data/ru';
import frLocaleData from 'react-intl/locale-data/fr';

import enTranslationMessages from './i18n/en.json';
import zhTranslationMessages from './i18n/zh.json';
import ruTranslationMessages from './i18n/en.json';
import ptTranslationMessages from './i18n/en.json';
import frTranslationMessages from './i18n/en.json';

addLocaleData(enLocaleData);
addLocaleData(zhLocaleData);
addLocaleData(ruLocaleData);
addLocaleData(ptLocaleData);
addLocaleData(frLocaleData);

export const DEFAULT_LOCALE = 'en';

export const appLocales = ['en', 'zh', "ru", "uk", "fr", "pt"];

export const formatTranslationMessages = (locale, messages) => {
  const defaultFormattedMessages =
    locale !== DEFAULT_LOCALE
      ? formatTranslationMessages(DEFAULT_LOCALE, enTranslationMessages)
      : {};
  return Object.keys(messages).reduce((formattedMessages, key) => {
    const formattedMessage =
      !messages[key] && locale !== DEFAULT_LOCALE
        ? defaultFormattedMessages[key]
        : messages[key];
    return Object.assign(formattedMessages, {[key]: formattedMessage});
  }, {});
};

export const translationMessages = {
  en: formatTranslationMessages('en', enTranslationMessages),
  zh: formatTranslationMessages('zh', zhTranslationMessages),
  ru: formatTranslationMessages('ru', enTranslationMessages),
  uk: formatTranslationMessages('uk', enTranslationMessages),
  fr: formatTranslationMessages('fr', enTranslationMessages),
  pt: formatTranslationMessages('pt', enTranslationMessages)
};
