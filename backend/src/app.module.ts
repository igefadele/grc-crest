import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { AuthModule } from '@/auth/auth.module'
import { EvidenceModule } from '@/evidence/evidence.module'
import { EventsModule } from '@/events/events.module'
import { HealthController } from '@/health/health.controller'
import { IncidentsModule } from '@/incidents/incidents.module'
import { IngestionModule } from '@/ingestion/ingestion.module'
import { PrismaModule } from '@/prisma/prisma.module'
import { RealtimeModule } from '@/realtime/realtime.module'

/**
 * Root module for the backend application.
 * Imports feature modules and global configuration providers.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    JwtModule.register({}),
    PrismaModule,
    AuthModule,
    EventsModule,
    EvidenceModule,
    IncidentsModule,
    IngestionModule,
    RealtimeModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}

