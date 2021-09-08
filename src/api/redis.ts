import { createClient } from 'redis'
import dotenv from 'dotenv'

dotenv.config()

const port = process.env.REDIS_PORT
const host = process.env.HOST

const redisClient = createClient(`redis://${host}:${port}`)

export async function getRedisValue (key: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if (err) {
        reject(err)
        return
      }
      if (val == null) {
        resolve(null)
        return
      }
      try {
        resolve(JSON.parse(val))
      } catch (ex) {
        resolve(val)
      }
    })
  })
}

export default redisClient
