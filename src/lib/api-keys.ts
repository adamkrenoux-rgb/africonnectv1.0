import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

export function generateApiKey(): { raw: string; prefix: string; hash: string } {
  const raw = 'ak_' + crypto.randomBytes(24).toString('hex')
  const prefix = raw.slice(0, 10)
  const hash = crypto.createHash('sha256').update(raw).digest('hex')
  return { raw, prefix, hash }
}

export async function verifyApiKey(rawKey: string) {
  const prefix = rawKey.slice(0, 10)
  const record = await prisma.apiKey.findUnique({ where: { keyPrefix: prefix } })
  if (!record || record.status !== 'ACTIVE') return null
  const hash = crypto.createHash('sha256').update(rawKey).digest('hex')
  if (hash !== record.keyHash) return null
  return record
}

export async function checkAndIncrementRateLimit(apiKeyId: string, limitPerMinute: number) {
  const now = new Date()
  const windowStart = new Date(now)
  windowStart.setSeconds(0, 0)
  const usage = await prisma.apiKeyUsage.upsert({
    where: { apiKeyId_windowStart: { apiKeyId, windowStart } },
    update: { count: { increment: 1 } },
    create: { apiKeyId, windowStart, count: 1 }
  })
  if (usage.count > limitPerMinute) {
    return false
  }
  return true
}


