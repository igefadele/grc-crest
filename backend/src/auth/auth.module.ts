import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'

/**
 * Authentication module for ingestion routes.
 * Configures JWT support using environment variables and exports auth guards.
 */
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          issuer: configService.get<string>('JWT_ISSUER', 'crest-backend'),
          audience: configService.get<string>('JWT_AUDIENCE', 'crest-frontend'),
          expiresIn: configService.get('JWT_EXPIRES_IN') || '12h',
        },
      }),
    }),
  ],
  providers: [JwtAuthGuard],
  exports: [JwtAuthGuard, JwtModule],
})
export class AuthModule {}
