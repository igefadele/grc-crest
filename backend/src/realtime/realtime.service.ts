import { Injectable } from '@nestjs/common'
import { RealtimeGateway } from '@/realtime/realtime.gateway'

/**
 * Service responsible for broadcasting real-time events to connected socket clients.
 */
@Injectable()
export class RealtimeService {
  constructor(private readonly gateway: RealtimeGateway) {}

  /**
   * Emit an event creation payload over the socket namespace.
   */
  emitEventCreated(payload: unknown) {
    this.gateway.broadcast('event.created', payload)
  }

  /**
   * Emit evidence update events to listeners.
   */
  emitEvidenceUpdated(payload: unknown) {
    this.gateway.broadcast('evidence.updated', payload)
  }

  /**
   * Emit incident update events over the socket gateway.
   */
  emitIncidentUpdated(payload: unknown) {
    this.gateway.broadcast('incident.updated', payload)
  }
}
