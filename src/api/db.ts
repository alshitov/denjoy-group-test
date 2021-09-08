import { v4 as uuid } from 'uuid'
import { SHA256 } from '../api/controllers/auth/crypto/sha256'

export type User = {
  id: string
  username: string
  passwordHash: string
  role: 'USER' | 'ADMIN'
}

export type File = {
  id: string
  name: string
  size: number
}

type DB = {
  users: User[]
  files: File[]
}

const db: DB = {
  users: [
    {
      id: uuid(),
      username: 'John Doe',
      passwordHash: SHA256('j0hnD03atd3nj0y'),
      role: 'ADMIN'
    },
    {
      id: uuid(),
      username: 'Vanessa Kate',
      passwordHash: SHA256('v4n3554k4t3atd3nj0y'),
      role: 'USER'
    }
  ],
  files: []
}

export function findUserByUsername (username: string): User | null {
  for (let user of db.users) {
    if (user.username === username) {
      return user
    }
  }
  return null
}
