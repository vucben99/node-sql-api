import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const port = 3000
const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

app.get('/articles', (req, res) => {
  const articles = prisma.article.findMany()
  res.json(articles)
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})