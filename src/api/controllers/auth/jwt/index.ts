import { JWTHeader, JWTPayload } from './types'
import { SHA256 } from '../crypto/sha256'
import base64url from 'base64url'

function generateSignature (
  header: JWTHeader,
  payload: JWTPayload
): string {
  return SHA256(
    base64url.encode(JSON.stringify(header)) +
    '.' +
    base64url.encode(JSON.stringify(payload))
  )
}

export function sign (
  id: string,
  username: string,
  role: string
): string {
  const header: JWTHeader = {
    typ: 'JWT',
    alg: 'HS256'
  }
  const payload: JWTPayload = {
    id,
    username,
    role
  }
  const signature = generateSignature(header, payload)
  payload.iat = new Date().getTime()
  return base64url.encode(JSON.stringify(header)) +
    '.' +
    base64url.encode(JSON.stringify(payload)) +
    '.' +
    base64url.encode(signature)
}

type JWTValidationResult = {
  valid: true
  id: string
  username: string
  role: string
} | {
  valid: false
}
export function validate (jwt: string): JWTValidationResult {
  const jwtPieces = jwt.split('.')
  if (jwtPieces.length !== 3) {
    return { valid: false }
  }
  const [headerEncoded, payloadEncoded, signatureEncoded] = jwtPieces
  const header = JSON.parse(base64url.decode(headerEncoded)) as JWTHeader
  const payload = JSON.parse(base64url.decode(payloadEncoded)) as JWTPayload
  const signature = base64url.decode(signatureEncoded)
  const { id, role, username } = payload
  if (signature === generateSignature(header, { id, username, role })) {
    return {
      valid: true,
      id,
      username,
      role
    }
  } else {
    return { valid: false }
  }
}
