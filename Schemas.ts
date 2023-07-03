import { z } from "zod"

export const NewTokenRequestSchema = z.object({
  platform: z.enum(['WEB', 'IOS', 'ANDROID'])
})
export type NewTokenRequest = z.infer<typeof NewTokenRequestSchema>

export const RenewTokenRequestSchema = z.object({
  token: z.string().uuid()
})
export type RenewTokenRequest = z.infer<typeof RenewTokenRequestSchema>

export const NewArticleSchema = z.object({
  title: z.string().max(100),
  description: z.string().max(5000),
})
export type NewArticle = z.infer<typeof NewArticleSchema>