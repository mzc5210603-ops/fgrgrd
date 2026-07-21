<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getCategoryColor } from '../utils/books'

const props = defineProps({ book: { type: Object, required: true } })
const router = useRouter()
const { t } = useI18n()
const imgError = ref(false)

const handleClick = () => {
  router.push(`/book/${props.book.id}`)
}
</script>

<template>
  <div class="book-card cursor-pointer group" @click="handleClick">
    <div class="relative overflow-hidden">
      <img
        v-if="book.cover && !imgError"
        :src="book.cover"
        :alt="book.title"
        class="book-card-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        @error="imgError = true"
      />
      <div v-else class="book-card-cover flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
        <div class="text-center p-4">
          <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{{ book.title }}</p>
        </div>
      </div>
      <span :class="['category-badge absolute top-2 left-2', getCategoryColor(book.category)]">
        {{ t(`categories.${book.category}`) }}
      </span>
    </div>
    <div class="book-card-content">
      <h3 class="book-card-title">{{ book.title }}</h3>
      <p class="book-card-author">{{ book.author }}</p>
    </div>
  </div>
</template>
