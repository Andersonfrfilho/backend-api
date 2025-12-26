import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class NotificationResponseDto {
  @ApiProperty({
    description: 'The notification ID',
    example: '507f1f77bcf86cd799439011',
  })
  @Expose()
  _id: string;

  @ApiProperty({
    description: 'The notification message',
    example: 'Your order has been shipped',
  })
  @Expose()
  message: string;

  @ApiProperty({
    description: 'The notification type',
    example: 'order_update',
  })
  @Expose()
  type: string;

  @ApiProperty({
    description: 'The user ID associated with the notification',
    example: 'user123',
    nullable: true,
  })
  @Expose()
  userId?: string;

  @ApiProperty({
    description: 'Whether the notification has been read',
    example: false,
  })
  @Expose()
  read: boolean;

  @ApiProperty({
    description: 'The creation date',
    example: '2023-12-01T10:00:00Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'The last update date',
    example: '2023-12-01T10:00:00Z',
  })
  @Expose()
  updatedAt: Date;
}

export class DeleteNotificationResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  @Expose()
  success: boolean;
}

export class MarkAllAsReadResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  @Expose()
  success: boolean;
}
