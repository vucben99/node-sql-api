import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

const NewArticleSchema = z.object({
  title: z.string().max(100),
  description: z.string().max(5000),
})

function validateNewArticleRequest(req: Request, res: Response, next: NextFunction) {
  const result = NewArticleSchema.safeParse(req.body)
  if (result.success === false) return res.status(400).json({
    error: result.error.issues
  })

  next()
}

export default validateNewArticleRequest