import { v4 as uuid } from 'uuid'
import { SHA256 } from '../api/controllers/auth/crypto/sha256'
import fs from 'fs'
import path from 'path'

export type User = {
  id: string
  username: string
  passwordHash: string
  role: 'USER' | 'ADMIN'
}

export type File = {
  id: string
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
  files: fs.readdirSync(path.join(__dirname, '../../', 'uploads')).map(entry => ({ id: entry }))
}

export function findUserByUsername (username: string): User | null {
  for (let user of db.users) {
    if (user.username === username) {
      return user
    }
  }
  return null
}

export function uploadFile (id: string): void {
  db.files.push({ id })
}

export function findFileById (id: string): File | null {
  for (let file of db.files) {
    if (file.id === id) {
      return file
    }
  }
  return null
}
