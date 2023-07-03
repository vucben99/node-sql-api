import express from 'express'
import { v4 as uuidv4 } from 'uuid'

import { prisma } from '../index'
import { NewTokenRequestSchema, NewTokenRequest, RenewTokenRequestSchema, RenewTokenRequest } from '../Schemas'
import validateRequestSchema from '../middleware/validateRequestSchema'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API endpoints for authentication
 */

/**
 * @swagger
 * /token:
 *   post:
 *     summary: Generate a new token
 *     tags: [Authentication]
 *     description: Generates a new token for the provided platform.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewTokenRequest'
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Missing platform or invalid platform value
 *       500:
 *         description: Internal server error
 */
router.post('/', validateRequestSchema(NewTokenRequestSchema), async (req, res) => {
  const { platform } = req.body as NewTokenRequest
  if (!platform) return res.status(400).json({
    error: 'Please provide a platform! (WEB | IOS | ANDROID)'
  })
  const session = await prisma.token.create({
    data: {
      token: uuidv4(),
      platform
    }
  })
  if (!session) return res.sendStatus(500)
  return res.json({
    token: session.token,
    remaining: session.remaining
  })
})

/**
 * @swagger
 * /token/renew:
 *   post:
 *     summary: Renew a token
 *     tags: [Authentication]
 *     description: Renews an existing token with a new expiration.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RenewTokenRequest'
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Missing token
 *       403:
 *         description: Invalid token
 */
router.post('/renew', validateRequestSchema(RenewTokenRequestSchema), async (req, res) => {
  const { token } = req.body as RenewTokenRequest
  if (!token) return res.status(400).json({
    error: 'Missing token'
  })

  const session = await prisma.token.update({
    where: {
      token
    },
    data: {
      remaining: 5
    }
  })

  if (!session) return res.status(403).json({
    error: 'Not a valid token'
  })

  return res.json({
    token: session.token,
    remaining: session.remaining
  })
})

export default router