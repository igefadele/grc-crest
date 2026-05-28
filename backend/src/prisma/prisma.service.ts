import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

/**
 * Prisma service wrapper that exposes the Prisma client to Nest.
 * This service connects to the database when the module is initialized.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  /**
   * Connect to the database when Nest initializes the module.
   */
  async onModuleInit() {
    await this.$connect()
  }

  /**
   * Hook into application shutdown so Prisma disconnects cleanly.
   */
  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', () => {
      void app.close()
    })
  }
}
