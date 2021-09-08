import { Router } from 'express'

const filesRouter = Router()

filesRouter.post('/:id', (req, res, next) => {
  console.log('upload file')
  return next()
})

filesRouter.get('/:id', (req, res, next) => {
  console.log('send file')
  return next()
})

export default filesRouter
