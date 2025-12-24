import { Controller, Get, Ip } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(@Ip() ip: string): string {
    return this.appService.getHello(ip);
  }

  @Public()
  @Get('health')
  healthCheck(): string {
    return 'ok';
  }

  @Public()
  @Get('/_ah/warmup')
  warmup(): string {
    return 'ok';
  }
}
