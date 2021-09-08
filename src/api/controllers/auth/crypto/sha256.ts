import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

const key = process.env.SECRET_KEY

export function SHA256 (payload: string): string {
  if (key == null) {
    throw new Error('JWT secret key not provided')
  }
  const hmac = crypto.createHmac('sha256', key)
  hmac.update(payload, 'base64')
  return hmac.digest().toString('base64')
}
