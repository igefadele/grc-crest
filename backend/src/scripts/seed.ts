import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.grcEvent.create({
    data: {
      time: '00:03s',
      layer: 'cicd',
      msg: 'TruffleHog blocked live AWS key in PR #4471',
      severity: 'blocked',
      auto: true,
    },
  })
}

void main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
