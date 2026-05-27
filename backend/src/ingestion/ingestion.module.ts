import { Module } from '@nestjs/common'
import { EvidenceModule } from '../evidence/evidence.module'
import { EventsModule } from '../events/events.module'
import { IncidentsModule } from '../incidents/incidents.module'
import { IngestionController } from './ingestion.controller'

@Module({
  imports: [EventsModule, EvidenceModule, IncidentsModule],
  controllers: [IngestionController],
})
export class IngestionModule {}
