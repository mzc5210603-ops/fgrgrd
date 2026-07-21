<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { fetchBooks, canReadOnline } from '../utils/books'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const loading = ref(true)
const error = ref(false)
const errorMsg = ref('')
const book = ref(null)
const iframeUrl = ref('')
const isFullscreen = ref(false)

const loadBook = async () => {
  loading.value = true
  error.value = false
  errorMsg.value = ''

  try {
    const all = await fetchBooks()
    book.value = all.find(b => b.id === route.params.id)

    if (!book.value) {
      error.value = true
      errorMsg.value = 'Book not found'
      loading.value = false
      return
    }

    if (!canReadOnline(book.value)) {
      error.value = true
      errorMsg.value = 'This book cannot be read online'
      loading.value = false
      return
    }

    iframeUrl.value = book.value.readUrl || ''
    await nextTick()

    setTimeout(() => {
      loading.value = false
    }, 1500)
  } catch (err) {
    console.error('Failed to load book:', err)
    error.value = true
    errorMsg.value = err.message || 'Unknown error'
    loading.value = false
  }
}

const handleIframeLoad = () => {
  loading.value = false
}

const openExternal = () => {
  if (book.value?.readUrl) window.open(book.value.readUrl, '_blank')
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

onMounted(() => {
  loadBook()
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })
})

onBeforeUnmount(() => {
  if (document.fullscreenElement) document.exitFullscreen()
})
</script>

<template>
  <div class="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Toolbar -->
    <div class="bg-white dark:bg-gray-800 shadow-md px-4 py-2 flex items-center justify-between flex-wrap gap-2 z-10">
      <div class="flex items-center space-x-2">
        <button @click="router.back()" class="btn-secondary text-sm flex items-center space-x-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>{{ t('reader.close') }}</span>
        </button>
      </div>
      <div v-if="book" class="flex-1 text-center min-w-0 px-4">
        <span class="text-sm text-gray-600 dark:text-gray-300 truncate inline-block max-w-xs">{{ book.title }}</span>
        <span class="text-xs text-gray-400 ml-2">{{ book.author }}</span>
      </div>
      <div class="flex items-center space-x-2">
        <button @click="openExternal" class="btn-secondary text-sm flex items-center space-x-1" :title="t('reader.open_external')">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
        <button @click="toggleFullscreen" class="btn-secondary text-sm flex items-center space-x-1" :title="isFullscreen ? t('reader.exit_fullscreen') : t('reader.fullscreen')">
          <svg v-if="!isFullscreen" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15h4.5M15 15v4.5m0-4.5l5.5 5.5" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Reader area -->
    <div class="flex-1 relative overflow-hidden" style="min-height: 0;">
      <!-- Loading -->
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 z-20">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p class="text-gray-500 dark:text-gray-400">{{ t('reader.loading') }}</p>
        </div>
      </div>

      <!-- Error -->
      <div v-if="error" class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 z-20">
        <div class="text-center max-w-md px-4">
          <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="text-gray-600 dark:text-gray-300 mb-2">{{ t('reader.error') }}</p>
          <p v-if="errorMsg" class="text-sm text-gray-400 mb-4">{{ errorMsg }}</p>
          <div class="flex items-center justify-center space-x-3">
            <button @click="openExternal" class="btn-primary text-sm">{{ t('reader.open_external') }}</button>
            <button @click="router.back()" class="btn-secondary text-sm">{{ t('reader.close') }}</button>
          </div>
        </div>
      </div>

      <!-- Iframe reader -->
      <iframe
        v-if="iframeUrl && !error"
        :src="iframeUrl"
        class="w-full h-full border-0"
        :style="{ opacity: loading ? 0 : 1, transition: 'opacity 0.3s' }"
        title="Book Reader"
        @load="handleIframeLoad"
      ></iframe>
    </div>
  </div>
</template>
