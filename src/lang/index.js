import { createI18n } from 'vue-i18n'
import en from './en'
import ja from './ja'

const messages = { en, ja }

const savedLang = typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : null
const initialLocale = savedLang || 'en'

const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'en',
  messages,
})

export default i18n
