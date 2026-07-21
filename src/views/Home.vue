<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BookCard from '../components/BookCard.vue'
import { fetchBooks, sortBooks } from '../utils/books'

const { t } = useI18n()
const allBooks = ref([])
const loading = ref(true)
const sortBy = ref('default')
const displayCount = ref(24)

const sortedBooks = computed(() => sortBooks(allBooks.value, sortBy.value))
const displayedBooks = computed(() => sortedBooks.value.slice(0, displayCount.value))
const hasMore = computed(() => displayCount.value < sortedBooks.value.length)

const loadMore = () => {
  displayCount.value += 24
}

onMounted(async () => {
  loading.value = true
  allBooks.value = await fetchBooks()
  loading.value = false
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Hero section -->
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100">{{ t('app.title') }}</h2>
      <p class="text-gray-600 dark:text-gray-400 mt-2">{{ t('app.slogan') }}</p>
      <div v-if="!loading && allBooks.length" class="mt-3 flex items-center gap-4">
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ allBooks.length }} {{ t('book.count') }}</span>
        <!-- Sort dropdown -->
        <select
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
    </div>

    <!-- Skeleton loading -->
    <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      <div v-for="i in 12" :key="i" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
        <div class="w-full aspect-[3/4] bg-gray-200 dark:bg-gray-700"></div>
        <div class="p-4 space-y-2">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="allBooks.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('book.no_books') }}</h3>
    </div>

    <!-- Book grid -->
    <div v-else>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <BookCard v-for="book in displayedBooks" :key="book.id" :book="book" />
      </div>

      <!-- Load more -->
      <div v-if="hasMore" class="text-center mt-8">
        <button @click="loadMore" class="btn-primary px-8 py-3">
          {{ t('common.show_all') }} ({{ sortedBooks.length - displayCount }})
        </button>
      </div>
      <div v-else-if="sortedBooks.length > 24" class="text-center mt-8 text-sm text-gray-400">
        {{ t('common.no_more') }}
      </div>
    </div>
  </div>
</template>
