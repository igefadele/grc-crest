import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { RealtimeService } from '@/realtime/realtime.service'
import { UpsertIncidentDto } from '@/incidents/dto/upsert-incident.dto'


@Injectable()
export class IncidentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtimeService: RealtimeService,
  ) {}

  async upsert(payload: UpsertIncidentDto) {
    const record = await this.prisma.grcIncident.upsert({
      where: { id: payload.id },
      update: {
        title: payload.title,
        severity: payload.severity,
        status: payload.status,
        blastRadius: payload.blastRadius,
        timelineJson: payload.timeline as any,
        aiSummary: payload.aiSummary,
        recommendation: payload.recommendation,
      },
      create: {
        id: payload.id,
        title: payload.title,
        severity: payload.severity,
        status: payload.status,
        blastRadius: payload.blastRadius,
        timelineJson: payload.timeline as any,
        aiSummary: payload.aiSummary,
        recommendation: payload.recommendation,
      },
    })

    this.realtimeService.emitIncidentUpdated(record)
    return record
  }

  async findMany(status?: string) {
    return this.prisma.grcIncident.findMany({
      where: status ? { status } : undefined,
      orderBy: { updatedAt: 'desc' },
    })
  }
}
