/**
 * 数据清洗与去重模块
 */

/**
 * 清洗文本
 */
export function cleanText(text) {
  if (!text) return ''
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * 过滤无效链接的图书
 */
export function filterValidBooks(books) {
  const filtered = books.filter(book => {
    // 必须有标题
    if (!book.title || book.title.length === 0) return false
    // 必须有下载链接（外部直链）
    if (!book.downloadUrl || book.downloadUrl.length === 0) return false
    // 过滤无效URL
    try {
      new URL(book.downloadUrl)
    } catch {
      return false
    }
    return true
  })

  console.log(`  [Filter] ${books.length - filtered.length} invalid books removed`)
  return filtered
}

/**
 * 去重 - 基于书名+作者
 */
export function removeDuplicates(books) {
  const seen = new Set()
  const unique = []

  for (const book of books) {
    const key = `${book.title.toLowerCase().trim()}|${book.author.toLowerCase().trim()}`
    if (!seen.has(key)) {
      seen.add(key)
      unique.push(book)
    }
  }

  console.log(`  [Dedup] ${books.length - unique.length} duplicates removed`)
  return unique
}

/**
 * 与已有数据合并去重
 */
export function mergeWithExisting(newBooks, existingBooks) {
  const existingKeys = new Set(
    existingBooks.map(b => `${b.title.toLowerCase().trim()}|${b.author.toLowerCase().trim()}`)
  )

  const merged = [...existingBooks]
  let addedCount = 0

  for (const book of newBooks) {
    const key = `${book.title.toLowerCase().trim()}|${book.author.toLowerCase().trim()}`
    if (!existingKeys.has(key)) {
      merged.push(book)
      existingKeys.add(key)
      addedCount++
    }
  }

  console.log(`  [Merge] ${addedCount} new books added to ${existingBooks.length} existing`)
  return merged
}

/**
 * 标准化图书数据
 */
export function normalizeBook(book) {
  return {
    id: book.id || generateId(book.title),
    title: cleanText(book.title),
    author: cleanText(book.author) || 'Unknown',
    description: cleanText(book.description),
    cover: book.cover || '',
    downloadUrl: book.downloadUrl,
    category: book.category || 'classic',
    language: book.language || 'en',
    publisher: book.publisher || '',
    publishDate: book.publishDate || '',
    source: book.source || '',
    epubUrl: book.epubUrl || book.downloadUrl || '',
  }
}

function generateId(title) {
  return 'book-' + (title || 'untitled').toLowerCase()
    .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]+/g, '-')
    .substring(0, 50) + '-' + Date.now()
}
