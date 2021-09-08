import { Router } from 'express'
import { login, loginStatus } from '../controllers/auth/auth.controller'

const authRouter = Router()

authRouter.post('/login', login)
authRouter.get('/status', loginStatus)

export default authRouter
