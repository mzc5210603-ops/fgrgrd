/**
 * ============================================================
 * 电子书采集配置文件
 * ============================================================
 * 合规资源清单（均为公版/开源授权电子书）：
 *
 * 英文公版图书源：
 * 1. Internet Archive (https://archive.org) - 开放图书资源，提供大量EPUB直链
 *    - Advanced Search API: https://archive.org/advancedsearch.php
 *    - 包含数百万本公版图书，支持英文和日文
 *
 * 2. Project Gutenberg (https://www.gutenberg.org) - 全球最大的公版英文图书库
 *    - OPDS Catalog: https://m.gutenberg.org/ebooks.opds/
 *
 * 3. Standard Ebooks (https://standardebooks.org) - 精排版公版图书
 *    - OPDS: https://standardebooks.org/feeds/opds
 *
 * 日文公版古籍源：
 * 1. Internet Archive 日文书籍 - 通过archive.org搜索日文EPUB格式公版书
 *    - 使用格式: epub AND language:jpn
 *
 * 注意：本脚本仅采集图书元数据（书名、作者、封面、简介等），
 * 不下载也不存储EPUB实体文件，仅保存外部资源直链。
 * ============================================================
 */

export const BOOK_SOURCES = [
  // ========== Internet Archive - English EPUB Books ==========
  // 使用archive.org高级搜索API获取真正的EPUB直链
  {
    name: 'Internet Archive - Popular English',
    type: 'ia-search',
    url: 'https://archive.org/advancedsearch.php?q=mediatype:texts+AND+format:epub+AND+language:eng+AND+subject:popular&fl=identifier,title,creator,description,cover_url,downloads,year,collection&sort=downloads+desc&rows=30&output=json',
    category: 'classic',
    language: 'en',
    maxBooks: 30,
  },
  {
    name: 'Internet Archive - Fiction',
    type: 'ia-search',
    url: 'https://archive.org/advancedsearch.php?q=mediatype:texts+AND+format:epub+AND+language:eng+AND+subject:fiction&fl=identifier,title,creator,description,cover_url,downloads,year&sort=downloads+desc&rows=20&output=json',
    category: 'fiction',
    language: 'en',
    maxBooks: 20,
  },
  {
    name: 'Internet Archive - Children',
    type: 'ia-search',
    url: 'https://archive.org/advancedsearch.php?q=mediatype:texts+AND+format:epub+AND+language:eng+AND+subject:children&fl=identifier,title,creator,description,cover_url,downloads,year&sort=downloads+desc&rows=20&output=json',
    category: 'children',
    language: 'en',
    maxBooks: 20,
  },
  {
    name: 'Internet Archive - History',
    type: 'ia-search',
    url: 'https://archive.org/advancedsearch.php?q=mediatype:texts+AND+format:epub+AND+language:eng+AND+subject:history&fl=identifier,title,creator,description,cover_url,downloads,year&sort=downloads+desc&rows=20&output=json',
    category: 'history',
    language: 'en',
    maxBooks: 20,
  },
  {
    name: 'Internet Archive - Science',
    type: 'ia-search',
    url: 'https://archive.org/advancedsearch.php?q=mediatype:texts+AND+format:epub+AND+language:eng+AND+subject:science&fl=identifier,title,creator,description,cover_url,downloads,year&sort=downloads+desc&rows=20&output=json',
    category: 'science',
    language: 'en',
    maxBooks: 20,
  },
  {
    name: 'Internet Archive - Philosophy',
    type: 'ia-search',
    url: 'https://archive.org/advancedsearch.php?q=mediatype:texts+AND+format:epub+AND+language:eng+AND+subject:philosophy&fl=identifier,title,creator,description,cover_url,downloads,year&sort=downloads+desc&rows=20&output=json',
    category: 'philosophy',
    language: 'en',
    maxBooks: 20,
  },

  // ========== Internet Archive - Japanese EPUB Books ==========
  // 日文公版图书，提供真正的EPUB直链
  {
    name: 'Internet Archive - Japanese Classics',
    type: 'ia-search',
    url: 'https://archive.org/advancedsearch.php?q=mediatype:texts+AND+format:epub+AND+language:jpn+AND+subject:classics&fl=identifier,title,creator,description,cover_url,downloads,year&sort=downloads+desc&rows=20&output=json',
    category: 'classic',
    language: 'ja',
    maxBooks: 20,
  },
  {
    name: 'Internet Archive - Japanese Fiction',
    type: 'ia-search',
    url: 'https://archive.org/advancedsearch.php?q=mediatype:texts+AND+format:epub+AND+language:jpn+AND+subject:fiction&fl=identifier,title,creator,description,cover_url,downloads,year&sort=downloads+desc&rows=20&output=json',
    category: 'fiction',
    language: 'ja',
    maxBooks: 20,
  },

  // ========== Standard Ebooks - High Quality EPUB ==========
  {
    name: 'Standard Ebooks',
    type: 'opds-xml',
    url: 'https://standardebooks.org/feeds/opds',
    category: 'classic',
    language: 'en',
    maxBooks: 20,
  },

  // ========== Project Gutenberg - Popular Books ==========
  {
    name: 'Project Gutenberg - Popular',
    type: 'opds',
    url: 'https://m.gutenberg.org/ebooks/feed/catalog/popular.json',
    category: 'classic',
    language: 'en',
    maxBooks: 20,
  },
]

export const OUTPUT_DIR = 'public/books'
export const OUTPUT_FILE = `${OUTPUT_DIR}/books.json`
export const MAX_TOTAL_BOOKS = 200
