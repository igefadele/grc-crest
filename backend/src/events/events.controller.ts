import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common'
import { EventsService } from '@/events/events.service'

/**
 * Controller exposing simple read endpoints for events.
 */
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /**
   * GET /events?limit=:number
   * Return the most recent events with an optional limit.
   */
  @Get()
  getEvents(@Query('limit', new ParseIntPipe({ optional: true })) limit?: number) {
    return this.eventsService.findMany(limit)
  }
}
