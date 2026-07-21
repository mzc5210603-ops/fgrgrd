/**
 * ============================================================
 * 电子书采集主脚本
 * 在 GitHub Actions CI 环境中运行
 * ============================================================
 *
 * 流程:
 * 1. 读取配置文件中的电子书源
 * 2. 依次抓取各源的图书元数据
 * 3. 数据清洗、去重、过滤无效链接
 * 4. 与已有数据合并
 * 5. 输出标准化JSON到 public/books/books.json
 * 6. 如果数据有变化则标记需要commit
 * ============================================================
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { BOOK_SOURCES, OUTPUT_DIR, OUTPUT_FILE, MAX_TOTAL_BOOKS } from '../config.js'
import { fetchGutenbergJson, fetchOpdsXml, fetchAozoraBooks, fetchIaSearch } from './fetcher.js'
import { cleanText, filterValidBooks, removeDuplicates, mergeWithExisting, normalizeBook } from './cleanup.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * 加载已有的图书数据
 */
function loadExistingBooks() {
  try {
    const outputPath = path.resolve(__dirname, '..', OUTPUT_FILE)
    if (fs.existsSync(outputPath)) {
      const data = fs.readFileSync(outputPath, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Failed to load existing books:', error.message)
  }
  return []
}

/**
 * 保存图书数据到JSON
 */
function saveBooks(books) {
  const outputDir = path.resolve(__dirname, '..', OUTPUT_DIR)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Sort by title
  const sorted = books.sort((a, b) => a.title.localeCompare(b.title)).slice(0, MAX_TOTAL_BOOKS)

  fs.writeFileSync(
    path.resolve(__dirname, '..', OUTPUT_FILE),
    JSON.stringify(sorted, null, 2),
    'utf-8'
  )

  console.log(`\nSaved ${sorted.length} books to ${OUTPUT_FILE}`)
  return sorted.length > 0
}

/**
 * 主流程
 */
async function main() {
  console.log('========================================')
  console.log('  Ebook Collection Process Started')
  console.log('========================================')
  console.log(`Timestamp: ${new Date().toISOString()}`)
  console.log(`Sources: ${BOOK_SOURCES.length}`)
  console.log('')

  // 1. Load existing data
  const existingBooks = loadExistingBooks()
  console.log(`Existing books: ${existingBooks.length}`)

  // 2. Fetch from all sources
  const allNewBooks = []

  for (const source of BOOK_SOURCES) {
    console.log(`\n--- Processing: ${source.name} ---`)
    try {
      let books = []

      switch (source.type) {
        case 'ia-search':
          books = await fetchIaSearch(source)
          break
        case 'opds':
          books = await fetchGutenbergJson(source)
          break
        case 'opds-xml':
          books = await fetchOpdsXml(source)
          break
        case 'aozora-new':
          books = await fetchAozoraBooks(source)
          break
        default:
          console.warn(`  Unknown source type: ${source.type}`)
      }

      allNewBooks.push(...books)
    } catch (error) {
      console.error(`  Failed to fetch ${source.name}: ${error.message}`)
      // Continue with next source - error isolation
    }
  }

  console.log(`\n========================================`)
  console.log(`Total fetched: ${allNewBooks.length} books`)
  console.log('========================================')

  if (allNewBooks.length === 0) {
    console.log('No new books fetched. Checking if existing data should be kept.')
    if (existingBooks.length > 0) {
      console.log('Keeping existing data. No changes needed.')
      console.log('========================================')
      console.log('  Process completed. No changes.')
      console.log('========================================')
      return
    }
    console.log('No data available at all. Exiting.')
    return
  }

  // 3. Normalize
  const normalized = allNewBooks.map(normalizeBook)
  console.log(`After normalization: ${normalized.length}`)

  // 4. Filter invalid
  const valid = filterValidBooks(normalized)
  console.log(`After filtering: ${valid.length}`)

  // 5. Remove duplicates within new batch
  const unique = removeDuplicates(valid)
  console.log(`After dedup: ${unique.length}`)

  // 6. Merge with existing
  const merged = mergeWithExisting(unique, existingBooks)
  console.log(`After merge: ${merged.length}`)

  // 7. Save
  const saved = saveBooks(merged)

  console.log('========================================')
  if (saved) {
    console.log('  Process completed successfully!')
  } else {
    console.log('  Process completed with issues.')
  }
  console.log('========================================')
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
