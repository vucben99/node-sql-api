import { prisma } from "../index"
import { Request, Response, NextFunction } from "express"

async function authenticateRequest(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.sendStatus(401)

  const session = await prisma.token.findUnique({
    where: { token }
  })

  if (!session) return res.sendStatus(401)
  if (session.remaining === 0) return res.status(403).json({
    error: "Token expired! Please reset it at /token/renew"
  })

  await prisma.token.update({
    where: {
      token
    },
    data: {
      remaining: session.remaining - 1
    }
  })
  next()
}

export default authenticateRequest