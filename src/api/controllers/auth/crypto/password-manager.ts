import { SHA256 } from './sha256'

export function checkPassword (
  password: string,
  hash: string
): boolean {
  return SHA256(password) === hash
}
