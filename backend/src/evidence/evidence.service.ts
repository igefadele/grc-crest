import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { RealtimeService } from '../realtime/realtime.service'
import { UpsertEvidenceDto } from './dto/upsert-evidence.dto'

@Injectable()
export class EvidenceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtimeService: RealtimeService,
  ) {}

  async upsert(payload: UpsertEvidenceDto) {
    const record = await this.prisma.grcEvidenceRecord.upsert({
      where: { id: payload.id },
      update: {
        framework: payload.framework,
        control: payload.control,
        status: payload.status,
        evidence: payload.evidence,
        lastChecked: new Date(payload.lastChecked),
        nextDue: payload.nextDue,
        owner: payload.owner,
      },
      create: {
        id: payload.id,
        framework: payload.framework,
        control: payload.control,
        status: payload.status,
        evidence: payload.evidence,
        lastChecked: new Date(payload.lastChecked),
        nextDue: payload.nextDue,
        owner: payload.owner,
      },
    })

    this.realtimeService.emitEvidenceUpdated(record)
    return record
  }

  async findMany(framework?: string) {
    return this.prisma.grcEvidenceRecord.findMany({
      where: framework ? { framework } : undefined,
      orderBy: { updatedAt: 'desc' },
    })
  }
}
