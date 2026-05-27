import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common'
import { EventsService } from '@/events/events.service'

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  getEvents(@Query('limit', new ParseIntPipe({ optional: true })) limit?: number) {
    return this.eventsService.findMany(limit)
  }
}
