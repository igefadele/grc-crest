import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { ConfigService } from '@nestjs/config'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
  namespace: '/grc',
  cors: {
    origin: '*',
  },
})
export class RealtimeGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server!: Server

  constructor(private readonly configService: ConfigService) {}

  afterInit() {
    // no-op hook to satisfy lifecycle and allow future instrumentation
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    const expectedToken = this.configService.get<string>('INGESTION_JWT_TOKEN')
    const token = this.extractToken(client)

    if (!expectedToken || token !== expectedToken) {
      client.emit('auth.error', { message: 'Unauthorized socket client' })
      client.disconnect(true)
    }
  }

  broadcast(eventName: string, payload: unknown) {
    this.server.emit(eventName, payload)
  }

  private extractToken(client: Socket): string | null {
    const authToken = client.handshake.auth?.token
    if (typeof authToken === 'string' && authToken.length > 0) {
      return authToken
    }

    const header = client.handshake.headers.authorization
    if (typeof header === 'string' && header.startsWith('Bearer ')) {
      return header.slice('Bearer '.length)
    }

    return null
  }
}
