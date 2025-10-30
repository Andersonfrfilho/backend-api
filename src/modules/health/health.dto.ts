import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class HealthCheckResponseDto {
  @ApiProperty({
    description: 'Message indicating health status',
    example: 'OK',
  })
  message: string;

  @ApiProperty({
    description: 'The status of the health check',
    example: 'healthy',
  })
  @IsBoolean()
  status: boolean;
}
