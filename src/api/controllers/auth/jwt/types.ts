export type Alg = 'HS256'

export type JWTHeader = {
  typ: 'JWT',
  alg: Alg
}

export type JWTPayload = {
  id: string
  username: string
  iat?: number
  role: string
}

export type JWT = {
  header: JWTHeader
  payload: JWTPayload
  signature: string
}
