import 'reflect-metadata'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/app.module'

/**
 * Application bootstrap function.
 * Initializes the Nest app, configures CORS and validation, then starts the server.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  // Allow frontend app to connect to this API
  const frontendOrigin = configService.get<string>('FRONTEND_ORIGIN', 'http://localhost:3000')

  // Port used by the Nest server
  const port = configService.get<number>('PORT', 4000)

  app.enableCors({
    origin: frontendOrigin,
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )

  await app.listen(port)
}

void bootstrap()
