import express from 'express'
import { v4 as uuidv4 } from 'uuid'

import { prisma } from '../index'
import { NewTokenRequestSchema, NewTokenRequest, RenewTokenRequestSchema, RenewTokenRequest } from '../Schemas'
import validateRequestSchema from '../middleware/validateRequestSchema'

const router = express.Router()

// POST /token endpoint
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

// POST /token/renew endpoint
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