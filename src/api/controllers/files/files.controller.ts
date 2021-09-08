import { Request, Response, NextFunction } from 'express'
import { v4 as uuid } from 'uuid'
import fs from 'fs'
import path from 'path'
import { uploadFile, findFileById } from '../../db'

function filePath (name: string): string {
  return path.join(__dirname, '../../../../', 'uploads', name)
}

export async function upload (req: Request, res: Response, next: NextFunction) {
  const chunks = []
  for await (const chunk of req) {
    chunks.push(chunk)
  }
  const data = Buffer.concat(chunks).toString('utf-8')
  const beforePayload = data.slice(data.indexOf('\r\n\r\n') + '\r\n\r\n'.length)
  const payload = beforePayload.slice(0, beforePayload.indexOf('\r\n') - ('\r\n'.length - 1))
  const fileId = uuid()
  try {
    await fs.promises.writeFile(filePath(fileId), payload)
    uploadFile(fileId)
  } catch (e) {
    console.log(e)
    return res.status(500).send({ error: 'Failed to upload file' })
  }
  res.status(200).send({ id: fileId })
  return next()
}

export async function send (req: Request, res: Response, next: NextFunction) {
  const id = req.params.id
  if (id == null) {
    return res.status(404).send({ error: 'File id required' })
  }
  const file = findFileById(id)
  if (file == null) {
    return res.status(404).send({ error: 'File not found' })
  }
  try {
    const fileData = await fs.promises.readFile(filePath(id))
    return res.status(200).send(fileData)
  } catch (e) {
    console.log(e)
    return res.status(500).send({ error: 'Failed to send file' })
  }
}
