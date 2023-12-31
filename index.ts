import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { PrismaClient } from '@prisma/client'
import swaggerDoc from './swagger'

import articles from './routes/articles'
import token from './routes/token'

// Config
const PORT = process.env.PORT || 3000
export const prisma = new PrismaClient()
const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

// Routes
app.use('/articles', articles)
app.use('/token', token)

// Swagger
swaggerDoc(app)

// Start server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})