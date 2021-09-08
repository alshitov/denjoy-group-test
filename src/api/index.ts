import express from 'express'
import authRouter from './routes/auth.route'
import filesRouter from './routes/files.route'

const api = express()
api.use(express.json())

api.use('/auth', authRouter)
api.use('/files', filesRouter)

export default api
