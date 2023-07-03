import express, { Request, Response } from 'express'

import { prisma } from '../index'
import authenticateRequest from '../middleware/authenticateRequest'
import validateRequestSchema from '../middleware/validateRequestSchema'
import { NewArticleSchema, NewArticle } from '../Schemas'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: API endpoints for managing articles
 */

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Get a paginated list of articles
 *     tags: [Articles]
 *     description: Returns a paginated list of articles based on the provided query parameters.
 *     parameters:
 *       - in: query
 *         name: pageSize
 *         required: true
 *         schema:
 *           type: integer
 *         description: The number of articles to display per page.
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *         description: The page number.
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Invalid or missing query parameters
 */
router.get('/', async (req, res) => {
  if (!req.query.pageSize || !req.query.page) return res.status(400).json({
    error: "Missing 'pageSize' and/or 'page' query parameters!"
  })

  const pageSize = parseInt(req.query.pageSize as string)
  const page = parseInt(req.query.page as string)

  if (isNaN(pageSize) || isNaN(page)) return res.status(400).json({
    error: "Invalid 'pageSize' and/or 'page' query parameters! Please use numbers."
  })

  const startIndex = (page - 1) * pageSize
  const endIndex = page * pageSize

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
})

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: Get an article by ID
 *     tags: [Articles]
 *     description: Returns an article by the specified ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the article.
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Article not found
 *       401:
 *         description: Unauthorized request
 */
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

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Create a new article
 *     tags: [Articles]
 *     description: Creates a new article with the provided title and description.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewArticle'
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized request
 *       500:
 *         description: Internal server error
 */
router.post('/', [authenticateRequest, validateRequestSchema(NewArticleSchema)], async (req: Request, res: Response) => {
  const { title, description } = req.body as NewArticle
  const article = await prisma.article.create({
    data: {
      title,
      description
    }
  })
  if (!article) return res.sendStatus(500)
  return res.json(article)
})

export default router