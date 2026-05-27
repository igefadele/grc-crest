import { Module } from '@nestjs/common'
import { EvidenceController } from '@/evidence/evidence.controller'
import { EvidenceService } from '@/evidence/evidence.service'

@Module({
  controllers: [EvidenceController],
  providers: [EvidenceService],
  exports: [EvidenceService],
})
export class EvidenceModule {}
