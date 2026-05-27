import { Module } from '@nestjs/common'
import { RealtimeGateway } from '@/realtime/realtime.gateway'
import { RealtimeService } from '@/realtime/realtime.service'

@Module({
  providers: [RealtimeGateway, RealtimeService],
  exports: [RealtimeService],
})
export class RealtimeModule {}
