<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BookCard from '../components/BookCard.vue'
import { fetchBooks, sortBooks } from '../utils/books'

const route = useRoute()
const { t } = useI18n()
const allBooks = ref([])
const loading = ref(true)
const sortBy = ref('default')
const displayCount = ref(24)

const keyword = computed(() => decodeURIComponent(route.params.keyword || ''))

const filteredBooks = computed(() => {
  const term = keyword.value.toLowerCase().trim()
  if (!term) return allBooks.value
  return allBooks.value.filter(b =>
    (b.title || '').toLowerCase().includes(term) ||
    (b.author || '').toLowerCase().includes(term) ||
    (b.description || '').toLowerCase().includes(term)
  )
})

const sortedBooks = computed(() => sortBooks(filteredBooks.value, sortBy.value))
const displayedBooks = computed(() => sortedBooks.value.slice(0, displayCount.value))
const hasMore = computed(() => displayCount.value < sortedBooks.value.length)

const loadMore = () => { displayCount.value += 24 }

const loadBooks = async () => {
  loading.value = true
  displayCount.value = 24
  allBooks.value = await fetchBooks()
  loading.value = false
}

onMounted(loadBooks)
watch(() => route.params.keyword, loadBooks)
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8 flex items-center justify-between flex-wrap gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ t('search.results') }}: "{{ keyword }}"</h2>
        <p v-if="!loading" class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ filteredBooks.length }} {{ t('search.found') }}</p>
      </div>
      <select
        v-if="!loading && filteredBooks.length > 0"
        v-model="sortBy"
        class="text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="default">{{ t('sort.default') }}</option>
        <option value="title">{{ t('sort.title') }}</option>
        <option value="title-desc">{{ t('sort["title-desc"]') }}</option>
        <option value="author">{{ t('sort.author') }}</option>
        <option value="date">{{ t('sort.date') }}</option>
      </select>
    </div>

    <!-- Skeleton -->
    <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      <div v-for="i in 12" :key="i" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
        <div class="w-full aspect-[3/4] bg-gray-200 dark:bg-gray-700"></div>
        <div class="p-4 space-y-2">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <div v-else-if="filteredBooks.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('search.no_results') }}</h3>
      <p class="text-sm text-gray-400 mt-2">{{ t('search.hint') }}</p>
    </div>

    <div v-else>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <BookCard v-for="book in displayedBooks" :key="book.id" :book="book" />
      </div>
      <div v-if="hasMore" class="text-center mt-8">
        <button @click="loadMore" class="btn-primary px-8 py-3">{{ t('common.show_all') }} ({{ sortedBooks.length - displayCount }})</button>
      </div>
    </div>
  </div>
</template>
