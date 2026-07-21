import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      // 通用CORS代理：/api/proxy?url=xxx
      // 本地开发时使用，绕过浏览器CORS限制
      '/api/proxy': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // 从请求中提取目标URL
            const url = req.url.replace(/^\/api\/proxy\?url=/, '')
            const decodedUrl = decodeURIComponent(url)
            
            // 设置目标主机和路径
            const parsedUrl = new URL(decodedUrl)
            proxyReq.setHeader('Host', parsedUrl.host)
            proxyReq.path = parsedUrl.pathname + parsedUrl.search
            
            // 更新proxy目标
            options.target = parsedUrl.origin
          })
        },
      },
    },
  },
})
