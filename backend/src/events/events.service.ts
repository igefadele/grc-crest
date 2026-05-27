import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { RealtimeService } from '@/realtime/realtime.service'
import { CreateEventDto } from '@/events/dto/create-event.dto'

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtimeService: RealtimeService,
  ) {}

  async create(payload: CreateEventDto) {
    const created = await this.prisma.grcEvent.create({
      data: payload,
    })

    this.realtimeService.emitEventCreated(created)
    return created
  }

  async findMany(limit = 30) {
    return this.prisma.grcEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  }
}
