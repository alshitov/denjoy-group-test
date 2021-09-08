import { Router } from 'express'
import { upload, send } from '../controllers/files/files.controller'

const filesRouter = Router()

filesRouter.post('/', upload)
filesRouter.get('/:id', send)

export default filesRouter
