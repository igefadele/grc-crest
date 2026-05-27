import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { UpsertEvidenceDto } from '@/evidence/dto/upsert-evidence.dto'
import { EvidenceService } from '@/evidence/evidence.service'
import { CreateEventDto } from '@/events/dto/create-event.dto'
import { EventsService } from '@/events/events.service'
import { UpsertIncidentDto } from '@/incidents/dto/upsert-incident.dto'
import { IncidentsService } from '@/incidents/incidents.service'

@Controller('ingest')
@UseGuards(JwtAuthGuard)
export class IngestionController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly evidenceService: EvidenceService,
    private readonly incidentsService: IncidentsService,
  ) {}

  @Post('events')
  ingestEvent(@Body() payload: CreateEventDto) {
    return this.eventsService.create(payload)
  }

  @Post('evidence')
  ingestEvidence(@Body() payload: UpsertEvidenceDto) {
    return this.evidenceService.upsert(payload)
  }

  @Post('incidents')
  ingestIncident(@Body() payload: UpsertIncidentDto) {
    return this.incidentsService.upsert(payload)
  }
}
