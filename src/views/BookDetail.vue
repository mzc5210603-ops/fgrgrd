<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BookCard from '../components/BookCard.vue'
import { fetchBooks, getCategoryColor, formatDate, getLanguageLabel, canReadOnline } from '../utils/books'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const book = ref(null)
const allBooks = ref([])
const loading = ref(true)

const categoryClass = computed(() => book.value ? getCategoryColor(book.value.category) : '')
const canRead = computed(() => canReadOnline(book.value))

const relatedBooks = computed(() => {
  if (!book.value) return []
  return allBooks.value
    .filter(b => b.category === book.value.category && b.id !== book.value.id)
    .slice(0, 6)
})

onMounted(async () => {
  loading.value = true
  allBooks.value = await fetchBooks()
  book.value = allBooks.value.find(b => b.id === route.params.id)
  loading.value = false
  if (book.value) {
    document.title = `${book.value.title} - ${t('app.title')}`
  }
})

const readOnline = () => {
  if (canRead.value) router.push(`/read/${route.params.id}`)
}

const openInNewTab = () => {
  if (book.value?.readUrl) window.open(book.value.readUrl, '_blank')
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <button @click="router.back()" class="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-600 mb-6 transition-colors">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      {{ t('book.back') }}
    </button>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="!book" class="text-center py-12">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Book not found</h3>
    </div>

    <div v-else>
      <!-- Main info card -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          <div class="flex justify-center">
            <div class="relative w-48 h-64 rounded-lg shadow-md overflow-hidden bg-gray-200 dark:bg-gray-700">
              <img
                v-if="book.cover"
                :src="book.cover"
                :alt="book.title"
                class="w-full h-full object-cover"
                @error="$event.target.style.display='none'"
              />
              <div v-if="!book.cover" class="absolute inset-0 flex items-center justify-center">
                <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          <div class="md:col-span-2">
            <span :class="['category-badge mb-3', categoryClass]">{{ t(`categories.${book.category}`) }}</span>
            <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{{ book.title }}</h1>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-4">{{ book.author }}</p>

            <div class="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div v-if="book.language">
                <span class="text-gray-500 dark:text-gray-500">{{ t('book.language') }}:</span>
                <span class="text-gray-800 dark:text-gray-200 ml-2">{{ getLanguageLabel(book.language) }}</span>
              </div>
              <div v-if="book.publisher">
                <span class="text-gray-500 dark:text-gray-500">{{ t('book.publisher') }}:</span>
                <span class="text-gray-800 dark:text-gray-200 ml-2">{{ book.publisher }}</span>
              </div>
              <div v-if="book.publishDate">
                <span class="text-gray-500 dark:text-gray-500">{{ t('book.publish_date') }}:</span>
                <span class="text-gray-800 dark:text-gray-200 ml-2">{{ formatDate(book.publishDate) }}</span>
              </div>
              <div v-if="book.source">
                <span class="text-gray-500 dark:text-gray-500">{{ t('book.source') }}:</span>
                <span class="text-gray-800 dark:text-gray-200 ml-2">{{ book.source }}</span>
              </div>
            </div>

            <div class="flex flex-wrap gap-3">
              <button
                v-if="canRead"
                @click="readOnline"
                class="btn-primary flex items-center space-x-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>{{ t('book.read_online') }}</span>
              </button>
              <button
                v-if="book.readUrl"
                @click="openInNewTab"
                class="btn-secondary flex items-center space-x-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>{{ t('book.open_new_tab') }}</span>
              </button>
              <a
                v-if="book.downloadUrl"
                :href="book.downloadUrl"
                target="_blank"
                class="btn-secondary flex items-center space-x-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>{{ t('book.download') }}</span>
              </a>
            </div>
          </div>
        </div>

        <div class="px-6 pb-6 border-t dark:border-gray-700 pt-6">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">{{ t('book.description') }}</h3>
          <p v-if="book.description" class="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{{ book.description }}</p>
          <p v-else class="text-gray-400">{{ t('book.no_description') }}</p>
        </div>
      </div>

      <!-- Related books -->
      <div v-if="relatedBooks.length > 0" class="mt-8">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{{ t('book.related') }}</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <BookCard v-for="b in relatedBooks" :key="b.id" :book="b" />
        </div>
      </div>
    </div>
  </div>
</template>
