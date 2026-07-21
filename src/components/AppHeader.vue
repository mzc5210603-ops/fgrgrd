<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTheme } from '../composables/useTheme'
import SearchBar from './SearchBar.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import CategoryNav from './CategoryNav.vue'

const router = useRouter()
const { t } = useI18n()
const { isDark, initTheme, toggleTheme } = useTheme()

const isMenuOpen = ref(false)

const handleSearch = (keyword) => {
  if (keyword.trim()) {
    router.push(`/search/${encodeURIComponent(keyword.trim())}`)
    isMenuOpen.value = false
  }
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleResize = () => {
  if (window.innerWidth >= 768) {
    isMenuOpen.value = false
  }
}

onMounted(() => {
  initTheme()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <header class="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center cursor-pointer" @click="router.push('/')">
          <svg class="w-8 h-8 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h1 class="text-xl font-bold text-primary-600">{{ t('app.title') }}</h1>
        </div>

        <nav class="hidden md:flex items-center space-x-8">
          <a href="/" class="text-gray-700 dark:text-gray-200 hover:text-primary-600 font-medium"
            :class="{ 'text-primary-600': router.currentRoute.value.path === '/' }">
            {{ t('nav.home') }}
          </a>
          <CategoryNav />
        </nav>

        <div class="hidden md:flex items-center space-x-3">
          <SearchBar @search="handleSearch" />
          <LanguageSwitcher />
          <button @click="toggleTheme" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <svg v-if="isDark" class="w-5 h-5 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
        </div>

        <button class="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300" @click="toggleMenu">
          <svg v-if="!isMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div v-if="isMenuOpen" class="md:hidden py-4 border-t dark:border-gray-700">
        <div class="flex flex-col space-y-4">
          <a href="/" class="text-gray-700 dark:text-gray-200 font-medium py-2" @click="isMenuOpen = false">
            {{ t('nav.home') }}
          </a>
          <CategoryNav mobile @navigate="isMenuOpen = false" />
          <SearchBar @search="handleSearch" mobile />
          <div class="flex items-center justify-between">
            <LanguageSwitcher />
            <button @click="toggleTheme" class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <span class="text-sm text-gray-700 dark:text-gray-200">{{ isDark ? t('theme.dark') : t('theme.light') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
