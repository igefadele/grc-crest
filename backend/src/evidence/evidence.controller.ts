import { Controller, Get, Query } from '@nestjs/common'
import { EvidenceService } from '@/evidence/evidence.service'

@Controller('evidence')
export class EvidenceController {
  constructor(private readonly evidenceService: EvidenceService) {}

  @Get()
  getEvidence(@Query('framework') framework?: string) {
    return this.evidenceService.findMany(framework)
  }
}
