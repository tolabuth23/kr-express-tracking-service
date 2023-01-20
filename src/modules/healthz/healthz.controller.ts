import { Controller, Get } from '@nestjs/common'
import { SkipThrottle } from '@nestjs/throttler'

@SkipThrottle()
@Controller('healthz')
export class HealthzController {
  @Get('check')
  healthz(): { ok: number } {
    return {
      ok: 1,
    }
  }
}
