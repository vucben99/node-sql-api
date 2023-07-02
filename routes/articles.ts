import express from 'express'
import { prisma } from '../index'

import authenticateRequest from '../middleware/authenticateRequest'

const router = express.Router()

router.get('/', async (req, res) => {
  if (!req.query.pageSize || !req.query.page) return res.status(400).json({
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
      const pageData = articleList.slice(startIndex, endIndex)
      return res.json({
        list: pageData,
        meta: {
          pageSize,
          pageCount: Math.ceil(articleList.length / pageSize),
          page
        }
      })
    } catch (error) {
      console.error(error)
      return res.sendStatus(500)
    }
  } catch (error) {
    console.error('Error in query params:', error)
    return res.status(400).json({
      error: "Invalid 'pageSize' and/or 'page' query parameters!"
    })
  }
})

router.get('/:id', authenticateRequest, async (req, res) => {
  const id = parseInt(req.params.id)
  if (isNaN(id)) return res.status(400).json({
    error: "Invalid id format! Please use a number"
  })

  const article = await prisma.article.findUnique({
    where: { id }
  })

  if (!article) return res.status(404).json({
    error: "No article found with the given id"
  })
  return res.json(article)
})

type CreateArticleReq = {
  title: string
  description: string
}

router.post('/', authenticateRequest, async (req, res) => {
  const { title, description } = req.body as CreateArticleReq
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