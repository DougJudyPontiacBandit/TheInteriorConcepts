import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()
const port = Number(process.env.PORT) || 3000
const root = path.dirname(fileURLToPath(import.meta.url))

const distPath = path.join(root, 'dist')
app.use(express.static(distPath))
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next()
  return res.sendFile(path.join(distPath, 'index.html'), (error) => {
    if (error) next(error)
  })
})

app.listen(port, () => {
  console.log(`The Interior Concepts server is listening on http://localhost:${port}`)
})
