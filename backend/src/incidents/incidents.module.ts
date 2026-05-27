import { Module } from '@nestjs/common'
import { IncidentsController } from '@/incidents/incidents.controller'
import { IncidentsService } from '@/incidents/incidents.service'

@Module({
  controllers: [IncidentsController],
  providers: [IncidentsService],
  exports: [IncidentsService],
})
export class IncidentsModule {}
