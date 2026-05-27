import { Controller, Get, Query } from '@nestjs/common'
import { IncidentsService } from '@/incidents/incidents.service'

@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Get()
  getIncidents(@Query('status') status?: string) {
    return this.incidentsService.findMany(status)
  }
}
