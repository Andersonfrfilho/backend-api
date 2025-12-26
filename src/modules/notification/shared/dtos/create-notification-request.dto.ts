import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateNotificationRequestDto {
  @ApiProperty({
    description: 'The notification message',
    example: 'Your order has been shipped',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'The notification type',
    example: 'order_update',
    enum: ['info', 'warning', 'error', 'success', 'order_update', 'system'],
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'The user ID to receive the notification (optional for system notifications)',
    example: faker.string.uuid(),
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string;
}

export class UpdateNotificationRequestDto {
  @ApiProperty({
    description: 'The notification message',
    example: 'Your order has been delivered',
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({
    description: 'The notification type',
    example: 'order_update',
    enum: ['info', 'warning', 'error', 'success', 'order_update', 'system'],
    required: false,
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    description: 'Whether the notification has been read',
    example: true,
    required: false,
  })
  @IsOptional()
  read?: boolean;
}
