import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

/**
 * Guard used to protect ingestion endpoints with a static JWT-like token.
 * The token is expected to be configured via `INGESTION_JWT_TOKEN`.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  /**
   * @param configService - used to read the expected ingestion token from env
   */
  constructor(private readonly configService: ConfigService) {}

  /**
   * Validate incoming requests contain a bearer token that matches
   * the configured ingestion token. Throws `UnauthorizedException`
   * for any failure case.
   */
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ headers: { authorization?: string } }>()
    const authHeader = request.headers.authorization
    const expectedToken = this.configService.get<string>('INGESTION_JWT_TOKEN')

    // missing or malformed authorization header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token')
    }

    // server not configured with a token
    if (!expectedToken) {
      throw new UnauthorizedException('Ingestion token not configured')
    }

    // compare the provided token with the expected value
    const token = authHeader.slice('Bearer '.length)
    if (token !== expectedToken) {
      throw new UnauthorizedException('Invalid bearer token')
    }

    return true
  }
}
