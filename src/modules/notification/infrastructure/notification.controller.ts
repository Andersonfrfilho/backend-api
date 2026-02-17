import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Injectable,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

import type { NotificationServiceInterface } from '@modules/notification/shared/types';
import { NOTIFICATION_SERVICE_PROVIDE } from '@modules/notification/infrastructure/notification.token';
import {
  CreateNotificationRequestDto,
  UpdateNotificationRequestDto,
} from '@modules/notification/shared/dtos/create-notification-request.dto';
import {
  DeleteNotificationResponseDto,
  MarkAllAsReadResponseDto,
  NotificationResponseDto,
} from '@modules/notification/shared/dtos/notification-response.dto';

@Injectable()
@Controller('/notification')
export class NotificationController {
  constructor(
    @Inject(NOTIFICATION_SERVICE_PROVIDE)
    private readonly notificationService: NotificationServiceInterface,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Criar uma nova notificação',
    description: 'Esta rota realiza a criação de uma nova notificação no sistema.',
  })
  @ApiOkResponse({
    description: 'Notificação criada com sucesso.',
    type: NotificationResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos fornecidos.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor.',
  })
  async create(@Body() params: CreateNotificationRequestDto): Promise<NotificationResponseDto> {
    return await this.notificationService.createNotification(params);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar notificação por ID',
    description: 'Esta rota retorna uma notificação específica pelo seu ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da notificação',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiOkResponse({
    description: 'Notificação encontrada.',
    type: NotificationResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Notificação não encontrada.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor.',
  })
  async getById(@Param('id') id: string): Promise<NotificationResponseDto> {
    return await this.notificationService.getNotification({ id });
  }

  @Get()
  @ApiOperation({
    summary: 'Buscar todas as notificações',
    description: 'Esta rota retorna todas as notificações ou filtradas por usuário.',
  })
  @ApiQuery({
    name: 'userId',
    description: 'ID do usuário para filtrar notificações (opcional)',
    example: 'user123',
    required: false,
  })
  @ApiOkResponse({
    description: 'Lista de notificações.',
    type: [NotificationResponseDto],
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor.',
  })
  async getAll(@Query('userId') userId?: string): Promise<NotificationResponseDto[]> {
    return await this.notificationService.getAllNotifications(userId ? { userId } : undefined);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar notificação',
    description: 'Esta rota atualiza uma notificação existente.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da notificação',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiOkResponse({
    description: 'Notificação atualizada com sucesso.',
    type: NotificationResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Notificação não encontrada.',
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos fornecidos.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor.',
  })
  async update(
    @Param('id') id: string,
    @Body() params: UpdateNotificationRequestDto,
  ): Promise<NotificationResponseDto> {
    return await this.notificationService.updateNotification({ id, ...params });
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deletar notificação',
    description: 'Esta rota deleta uma notificação existente.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da notificação',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiOkResponse({
    description: 'Notificação deletada com sucesso.',
    type: DeleteNotificationResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Notificação não encontrada.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor.',
  })
  async delete(@Param('id') id: string): Promise<DeleteNotificationResponseDto> {
    return await this.notificationService.deleteNotification({ id });
  }

  @Patch(':id/read')
  @ApiOperation({
    summary: 'Marcar notificação como lida',
    description: 'Esta rota marca uma notificação específica como lida.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da notificação',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiOkResponse({
    description: 'Notificação marcada como lida.',
    type: NotificationResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Notificação não encontrada.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor.',
  })
  async markAsRead(@Param('id') id: string): Promise<NotificationResponseDto> {
    return await this.notificationService.markAsRead({ id });
  }

  @Patch('/user/:userId/read-all')
  @ApiOperation({
    summary: 'Marcar todas as notificações do usuário como lidas',
    description: 'Esta rota marca todas as notificações de um usuário como lidas.',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID do usuário',
    example: 'user123',
  })
  @ApiOkResponse({
    description: 'Todas as notificações marcadas como lidas.',
    type: MarkAllAsReadResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor.',
  })
  async markAllAsRead(@Param('userId') userId: string): Promise<MarkAllAsReadResponseDto> {
    return await this.notificationService.markAllAsRead({ userId });
  }
}
