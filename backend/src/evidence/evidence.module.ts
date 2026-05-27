import { Module } from '@nestjs/common'
import { EvidenceController } from '@/evidence/evidence.controller'
import { EvidenceService } from '@/evidence/evidence.service'
import { RealtimeModule } from '@/realtime/realtime.module'

@Module({
  imports: [RealtimeModule],
  controllers: [EvidenceController],
  providers: [EvidenceService],
  exports: [EvidenceService],
})
export class EvidenceModule {}
