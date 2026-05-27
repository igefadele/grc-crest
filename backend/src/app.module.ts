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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
