import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { RealtimeService } from '@/realtime/realtime.service'
import { CreateEventDto } from '@/events/dto/create-event.dto'

/**
 * Service responsible for persisting and retrieving events.
 * Delegates real-time broadcasting to RealtimeService.
 */
@Injectable()
export class EventsService {
  /**
   * @param prisma - Prisma client wrapper for DB access
   * @param realtimeService - service used to broadcast events
   */
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtimeService: RealtimeService,
  ) {}

  /**
   * Create a new event record and broadcast it to socket clients.
   */
  async create(payload: CreateEventDto) {
    const created = await this.prisma.grcEvent.create({
      data: payload,
    })

    this.realtimeService.emitEventCreated(created)
    return created
  }

  /**
   * Retrieve recent events, defaulting to 30 entries.
   */
  async findMany(limit = 30) {
    return this.prisma.grcEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  }
}
