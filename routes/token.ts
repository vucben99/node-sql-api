import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '../index'

const router = express.Router()

type TokenRequest = {
  platform: string
}

router.post('/', async (req, res) => {
  const { platform } = req.body as TokenRequest
  try {
    const session = await prisma.token.create({
      data: {
        token: uuidv4(),
        platform
      }
    })
    return res.json({
      token: session.token,
      usesLeft: session.remaining
    })
  } catch (error) {
    console.error(error)
    return res.sendStatus(500)
  }
})

type RenewTokenRequest = {
  token: string
}

router.post('/renew', async (req, res) => {
  const { token } = req.body as RenewTokenRequest
  try {
    const session = await prisma.token.update({
      where: {
        token
      },
      data: {
        remaining: 5
      }
    })
    return res.json({
      token: session.token,
      remaining: session.remaining
    })
  } catch(error) {
    console.error(error)
    return res.sendStatus(500)
  }
})

export default router