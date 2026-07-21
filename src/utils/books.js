import axios from 'axios'

let bookCache = null
let bookMap = null

/**
 * 获取所有图书数据（带缓存）
 * 首次加载后缓存，避免重复请求
 */
export async function fetchBooks() {
  if (bookCache) return bookCache
  try {
    const response = await axios.get(`/books/books.json`)
    bookCache = response.data
    // 构建ID索引，快速查找
    bookMap = new Map(bookCache.map(b => [b.id, b]))
    return bookCache
  } catch (error) {
    console.error('Failed to fetch books:', error)
    return []
  }
}

/**
 * 强制刷新缓存
 */
export function clearCache() {
  bookCache = null
  bookMap = null
}

/**
 * 根据ID获取单本书（使用索引，O(1)）
 */
export async function getBookById(id) {
  if (!bookMap) await fetchBooks()
  return bookMap?.get(id) || null
}

/**
 * 获取所有分类及其图书数量
 */
export async function getCategoriesWithCount() {
  const books = await fetchBooks()
  const counts = {}
  for (const book of books) {
    const cat = book.category || 'other'
    counts[cat] = (counts[cat] || 0) + 1
  }
  return counts
}

/**
 * 搜索图书（支持高亮匹配）
 */
export async function searchBooks(keyword) {
  const books = await fetchBooks()
  const term = keyword.toLowerCase().trim()
  if (!term) return books
  return books.filter(b =>
    (b.title || '').toLowerCase().includes(term) ||
    (b.author || '').toLowerCase().includes(term) ||
    (b.description || '').toLowerCase().includes(term)
  )
}

/**
 * 排序图书
 */
export function sortBooks(books, sortBy = 'default') {
  const sorted = [...books]
  switch (sortBy) {
    case 'title':
      return sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    case 'title-desc':
      return sorted.sort((a, b) => (b.title || '').localeCompare(a.title || ''))
    case 'author':
      return sorted.sort((a, b) => (a.author || '').localeCompare(b.author || ''))
    case 'date':
      return sorted.sort((a, b) => new Date(b.publishDate || 0) - new Date(a.publishDate || 0))
    default:
      return sorted
  }
}

const COLORS = {
  fiction: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
  nonfiction: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
  classic: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200',
  poetry: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200',
  history: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200',
  philosophy: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200',
  science: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-200',
  children: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200',
  adventure: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-200',
  romance: 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200',
  mystery: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
  drama: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
  horror: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
  scifi: 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-200',
  fantasy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200',
  travel: 'bg-lime-100 text-lime-700 dark:bg-lime-900 dark:text-lime-200',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
}

export function getCategoryColor(category) {
  return COLORS[category] || COLORS.other
}

export function formatDate(dateString) {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return dateString
  }
}

export function getLanguageLabel(lang) {
  const labels = { en: 'English', ja: '日本語' }
  return labels[lang] || lang
}

/**
 * 判断图书是否可在线阅读
 */
export function canReadOnline(book) {
  if (!book) return false
  // 有readUrl且readType为iframe或link都可以
  if (book.readUrl && book.readType) return true
  // 有epub下载链接也可以
  if (book.downloadUrl) {
    const url = book.downloadUrl.toLowerCase()
    return url.endsWith('.epub') || url.includes('epub')
  }
  return false
}
