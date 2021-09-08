import { Request, Response, NextFunction } from 'express'
import { LoginSchema, Login } from './schema'
import { findUserByUsername } from '../../db'
import { checkPassword } from './crypto/password-manager'
import { sign, validate } from './jwt'
import redisClient, { getRedisValue } from '../../redis'

export function login (req: Request, res: Response, next: NextFunction) {
  let request: Login
  try {
    request = LoginSchema.check(req.body)
  } catch (e) {
    return res.status(400).send({ error: 'Username and password required' })
  }
  const user = findUserByUsername(request.username)
  if (user == null) {
    return res.status(401).send({ error: 'Unknown user' })
  }
  if (!checkPassword(request.password, user.passwordHash)) {
    return res.status(401).send({ error: 'Invalid password' })
  }
  const jwt = sign(user.id, user.username, user.role)
  redisClient.set(user.id, jwt, () => {
    redisClient.expire(user.id, 2*60*60) // ttl = 2h
  })
  res.status(200).send({ accessToken: jwt })
  return next()
}

export async function loginStatus (req: Request, res: Response, next: NextFunction) {
  const authorizationHeader = req.header('Authorization')
  if (authorizationHeader == null) {
    return res.status(401).send({ error: 'JWT not provided' })
  }
  const authorizationHeaderPieces = authorizationHeader.split(' ')
  if (authorizationHeaderPieces[0] !== 'Bearer') {
    return res.status(401).send({ error: 'Invalid authorization method' })
  }
  const jwt = authorizationHeaderPieces[1]
  const validated = validate(jwt)
  if (!validated.valid) {
    return res.status(401).send({ error: 'Invalid token' })
  }
  const session = await getRedisValue(validated.id)
  if (session == null || session !== jwt) {
    return res.status(401).send({ error: 'Unknown session' })
  }
  res.status(200).send({ loggedIn: true })
  return next()
}
