<script setup>
import { ref, watch, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchBooks } from '../utils/books'

const emit = defineEmits(['search'])
const props = defineProps({ mobile: Boolean })
const { t } = useI18n()
const keyword = ref('')
const suggestions = ref([])
const showSuggestions = ref(false)
const allBooks = ref([])
const activeIndex = ref(-1)

let debounceTimer = null

// 加载书籍数据用于搜索建议
const loadBooks = async () => {
  if (!allBooks.value.length) {
    allBooks.value = await fetchBooks()
  }
}

const filteredSuggestions = computed(() => {
  const term = keyword.value.toLowerCase().trim()
  if (!term) return []
  return allBooks.value
    .filter(b =>
      (b.title || '').toLowerCase().includes(term) ||
      (b.author || '').toLowerCase().includes(term)
    )
    .slice(0, 5)
})

watch(keyword, (val) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  if (val.trim()) {
    debounceTimer = setTimeout(() => {
      loadBooks()
      suggestions.value = filteredSuggestions.value
      showSuggestions.value = true
    }, 300)
  } else {
    suggestions.value = []
    showSuggestions.value = false
  }
})

const handleSubmit = (e) => {
  e.preventDefault()
  if (keyword.value.trim()) {
    emit('search', keyword.value.trim())
    showSuggestions.value = false
    activeIndex.value = -1
  }
}

const selectSuggestion = (book) => {
  keyword.value = book.title
  emit('search', book.title)
  showSuggestions.value = false
  activeIndex.value = -1
}

const handleKeydown = (e) => {
  if (!showSuggestions.value || suggestions.value.length === 0) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = Math.min(activeIndex.value + 1, suggestions.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, -1)
  } else if (e.key === 'Enter' && activeIndex.value >= 0) {
    e.preventDefault()
    selectSuggestion(suggestions.value[activeIndex.value])
  } else if (e.key === 'Escape') {
    showSuggestions.value = false
    activeIndex.value = -1
  }
}

const hideSuggestions = () => {
  setTimeout(() => {
    showSuggestions.value = false
    activeIndex.value = -1
  }, 200)
}

const focusInput = () => {
  showSuggestions.value = keyword.value.trim().length > 0
}

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<template>
  <div class="relative" :class="mobile ? 'w-full' : 'w-56'">
    <form @submit="handleSubmit" class="flex items-center">
      <input
        v-model="keyword"
        type="text"
        :placeholder="t('search.placeholder')"
        @focus="focusInput"
        @blur="hideSuggestions"
        @keydown="handleKeydown"
        class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
      />
      <button type="submit" class="bg-primary-600 text-white px-3 py-2 rounded-r-lg hover:bg-primary-700 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </form>

    <div
      v-if="showSuggestions && suggestions.length > 0"
      class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden"
    >
      <ul>
        <li
          v-for="(book, idx) in suggestions"
          :key="book.id"
          @mousedown.prevent="selectSuggestion(book)"
          @mouseenter="activeIndex = idx"
          class="px-3 py-2 cursor-pointer text-sm transition-colors"
          :class="activeIndex === idx ? 'bg-primary-50 dark:bg-primary-900/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700'"
        >
          <div class="font-medium text-gray-800 dark:text-gray-100 truncate">{{ book.title }}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ book.author }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>
