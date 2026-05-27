import { Injectable } from '@nestjs/common'
import { RealtimeGateway } from '@/realtime/realtime.gateway'

@Injectable()
export class RealtimeService {
  constructor(private readonly gateway: RealtimeGateway) {}

  emitEventCreated(payload: unknown) {
    this.gateway.broadcast('event.created', payload)
  }

  emitEvidenceUpdated(payload: unknown) {
    this.gateway.broadcast('evidence.updated', payload)
  }

  emitIncidentUpdated(payload: unknown) {
    this.gateway.broadcast('incident.updated', payload)
  }
}
