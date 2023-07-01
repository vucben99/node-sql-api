import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const port = 3000
const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
})

app.listen(port, (): void => {
  console.log(`Listening on port ${port}`)
})

async function main() {
  const article = await prisma.article.create({
    data: {
      title: 'New article',
      description: 'Lorem ipsum dolor sit amet.',
    },
  })
  console.log(article)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })