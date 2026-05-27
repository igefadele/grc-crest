import { Controller, Get } from '@nestjs/common'

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return {
      ok: true,
      service: 'crest-backend',
      ts: new Date().toISOString(),
    }
  }
}
