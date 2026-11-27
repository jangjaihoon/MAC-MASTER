import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.resolve(__dirname, '../data')

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-data',
      configureServer(server) {
        server.middlewares.use('/data', (req, res, next) => {
          const filePath = path.join(dataDir, req.url || '')
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(fs.readFileSync(filePath, 'utf-8'))
          } else {
            next()
          }
        })
      }
    }
  ]
})
