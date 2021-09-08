import express from 'express'
import dotenv from 'dotenv'
import api from './api'

dotenv.config()
const port = process.env.SERVER_PORT || 3000

const app = express()
app.use('/api/v1', api)
app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
})
