import { Module } from '@nestjs/common';

export const SHARED_SERVICE_PROVIDE = 'SHARED_SERVICE_PROVIDE';

export interface SharedServiceInterface {
  getPrefix(): string;
}

@Module({})
export class SharedModule {}
