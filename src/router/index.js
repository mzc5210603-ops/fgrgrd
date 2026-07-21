import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: 'Ebook Library - Free Public Domain Books',
      description: 'Browse hundreds of free public domain ebooks. Read classic literature, fiction, philosophy, and science books online in English and Japanese.',
    },
  },
  {
    path: '/category/:category',
    name: 'Category',
    component: () => import('../views/Category.vue'),
    meta: {
      title: 'Category - Ebook Library',
      description: 'Browse ebooks by category. Find classic literature, fiction, philosophy, science and more.',
    },
  },
  {
    path: '/search/:keyword',
    name: 'Search',
    component: () => import('../views/Search.vue'),
    meta: {
      title: 'Search - Ebook Library',
      description: 'Search free public domain ebooks by title, author, or keyword.',
    },
  },
  {
    path: '/book/:id',
    name: 'BookDetail',
    component: () => import('../views/BookDetail.vue'),
    meta: {
      title: 'Book Detail - Ebook Library',
      description: 'Read book details and access the online reader.',
    },
  },
  {
    path: '/read/:id',
    name: 'Reader',
    component: () => import('../views/Reader.vue'),
    meta: {
      title: 'Online Reader - Ebook Library',
      description: 'Read public domain ebooks online for free.',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/Home.vue'),
    meta: {
      title: 'Page Not Found - Ebook Library',
      description: 'The page you are looking for does not exist.',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  },
})

router.afterEach((to) => {
  const title = to.meta.title
  const description = to.meta.description

  if (title) {
    document.title = title
  }

  if (description) {
    let metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', description)
    } else {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      metaDesc.setAttribute('content', description)
      document.head.appendChild(metaDesc)
    }
  }
})

export default router
