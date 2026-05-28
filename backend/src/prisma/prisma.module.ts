import { Global, Module } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'

/**
 * Global Prisma module to provide a shared PrismaService throughout the app.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
