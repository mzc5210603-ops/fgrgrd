<script setup>
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()

const switchLanguage = (lang) => {
  locale.value = lang
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('lang', lang)
  }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang
  }
}
</script>

<template>
  <div class="flex items-center space-x-1">
    <button
      v-for="lang in [{code:'en',label:'EN'},{code:'ja',label:'JA'}]"
      :key="lang.code"
      @click="switchLanguage(lang.code)"
      class="px-2 py-1 text-sm rounded transition-colors"
      :class="locale === lang.code
        ? 'bg-primary-600 text-white'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
    >
      {{ lang.label }}
    </button>
  </div>
</template>
