import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

const NewTokenSchema = z.object({
  platform: z.enum(['WEB', 'IOS', 'ANDROID'])
})

function validateNewTokenRequest(req: Request, res: Response, next: NextFunction) {
  const result = NewTokenSchema.safeParse(req.body)
  if (result.success === false) return res.status(400).json({
    error: result.error.issues
  })

  next()
}

export default validateNewTokenRequest