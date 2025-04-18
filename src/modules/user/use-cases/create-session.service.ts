import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateSessionService {
  getHello(): string {
    return 'Hello World!';
  }
}
