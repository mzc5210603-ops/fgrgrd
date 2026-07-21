<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const props = defineProps({ mobile: Boolean })
const emit = defineEmits(['navigate'])
const router = useRouter()
const { t } = useI18n()

// 所有分类列表（与数据中的分类匹配）
const categories = [
  { id: 'classic', name: 'categories.classic' },
  { id: 'fiction', name: 'categories.fiction' },
  { id: 'adventure', name: 'categories.adventure' },
  { id: 'romance', name: 'categories.romance' },
  { id: 'mystery', name: 'categories.mystery' },
  { id: 'horror', name: 'categories.horror' },
  { id: 'scifi', name: 'categories.scifi' },
  { id: 'fantasy', name: 'categories.fantasy' },
  { id: 'children', name: 'categories.children' },
  { id: 'history', name: 'categories.history' },
  { id: 'philosophy', name: 'categories.philosophy' },
  { id: 'science', name: 'categories.science' },
  { id: 'poetry', name: 'categories.poetry' },
  { id: 'drama', name: 'categories.drama' },
  { id: 'travel', name: 'categories.travel' },
]

const handleClick = (id) => {
  router.push(`/category/${id}`)
  emit('navigate')
}
</script>

<template>
  <div v-if="mobile" class="space-y-2">
    <span class="text-gray-500 text-sm font-medium">{{ t('nav.categories') }}</span>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="cat in categories" :key="cat.id"
        @click="handleClick(cat.id)"
        class="px-3 py-1 text-sm rounded-full transition-colors"
        :class="router.currentRoute.value.params.category === cat.id
          ? 'bg-primary-600 text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
      >
        {{ t(cat.name) }}
      </button>
    </div>
  </div>
  <div v-else class="relative group">
    <button class="text-gray-700 dark:text-gray-200 hover:text-primary-600 font-medium flex items-center space-x-1 transition-colors">
      <span>{{ t('nav.categories') }}</span>
      <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div class="absolute top-full left-0 mt-1 w-56 max-h-96 overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border dark:border-gray-700">
      <button
        v-for="cat in categories" :key="cat.id"
        @click="handleClick(cat.id)"
        class="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700 hover:text-primary-600 transition-colors text-sm flex items-center justify-between"
      >
        <span>{{ t(cat.name) }}</span>
        <svg v-if="router.currentRoute.value.params.category === cat.id" class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </button>
    </div>
  </div>
</template>
