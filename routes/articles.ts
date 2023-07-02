import express from 'express'
import { prisma } from '../index'
const router = express.Router()

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
      return res.json({
        list: data,
        meta: {
          pageSize,
          pageCount: articles.length / pageSize,
          page
        }
      })
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

type CreateArticleReq = {
  title: string
  description: string
}

router.post('/', async (req, res) => {
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