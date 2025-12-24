import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(ip: string): string {
    return `Hello from ${ip}`;
  }
}
