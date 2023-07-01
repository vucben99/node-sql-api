import express from 'express'
import cors from 'cors'

const port = 3000
const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
})

app.listen(port, (): void => {
  console.log(`Listening on port ${port}`)
})