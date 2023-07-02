import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import articles from './routes/articles'
import token from './routes/token'

const PORT = process.env.PORT || 3000
const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

// Routes
app.use('/articles', articles)
app.use('/token', token)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})