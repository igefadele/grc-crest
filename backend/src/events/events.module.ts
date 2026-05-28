import { Module } from '@nestjs/common'
import { EventsController } from '@/events/events.controller'
import { EventsService } from '@/events/events.service'
import { RealtimeModule } from '@/realtime/realtime.module'

/**
 * Module for event-related APIs and services.
 */
@Module({
  imports: [RealtimeModule],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
