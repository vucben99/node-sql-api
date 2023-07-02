import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

router.get('/', async (req, res) => {
  if (!req.query.pageSize || !req.query.page) return res.sendStatus(400).json({
    error: "Missing 'pageSize' and/or 'page' query parameters!"
  })

  try {
    const pageSize = parseInt(req.query.pageSize as string)
    const page = parseInt(req.query.page as string)
    const startIndex = (page - 1) * pageSize
    const endIndex = page * pageSize

    try {
      const articles = await prisma.article.findMany()
      const articleList = articles.map(article => ({
        id: article.id,
        title: article.title
      }))
      const data = articleList.slice(startIndex, endIndex)
      return res.json(data)
    } catch (error) {
      console.error(error)
      return res.sendStatus(500)
    }
  } catch (error) {
    console.error('Error in query params:', error)
    return res.sendStatus(400).json({
      error: "Invalid 'pageSize' and/or 'page' query parameters!"
    })
  }
})

router.post('/', async (req, res) => {
  const { title, description } = req.body
  try {
    const article = await prisma.article.create({
      data: {
        title,
        description
      }
    })
    res.json(article)
  } catch (error) {
    console.error(error)
    return res.sendStatus(500)
  }
})

export default router