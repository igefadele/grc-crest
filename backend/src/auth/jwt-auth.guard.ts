import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ headers: { authorization?: string } }>()
    const authHeader = request.headers.authorization
    const expectedToken = this.configService.get<string>('INGESTION_JWT_TOKEN')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token')
    }

    if (!expectedToken) {
      throw new UnauthorizedException('Ingestion token not configured')
    }

    const token = authHeader.slice('Bearer '.length)
    if (token !== expectedToken) {
      throw new UnauthorizedException('Invalid bearer token')
    }

    return true
  }
}
