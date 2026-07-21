<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <footer class="bg-gray-800 dark:bg-gray-950 text-white py-12 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-xl font-bold text-primary-400 mb-4">{{ t('app.title') }}</h3>
          <p class="text-gray-400 text-sm">{{ t('footer.description') }}</p>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-4">{{ t('nav.categories') }}</h4>
          <ul class="space-y-2 text-gray-400 text-sm">
            <li><a href="/category/fiction" class="hover:text-white">{{ t('categories.fiction') }}</a></li>
            <li><a href="/category/classic" class="hover:text-white">{{ t('categories.classic') }}</a></li>
            <li><a href="/category/history" class="hover:text-white">{{ t('categories.history') }}</a></li>
            <li><a href="/category/philosophy" class="hover:text-white">{{ t('categories.philosophy') }}</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-4">Links</h4>
          <p class="text-gray-400 text-sm">{{ t('footer.disclaimer') }}</p>
        </div>
      </div>
      <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
        {{ t('footer.copyright') }}
      </div>
    </div>
  </footer>
</template>
