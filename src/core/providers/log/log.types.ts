import { LogsParams } from '@core/providers/log/implementations/winston/winton.log.types';

export interface LogsInfoParams extends LogsParams {}
export interface LogsErrorParams extends LogsParams {}
export interface LogsWarnParams extends LogsParams {}
export interface LogsDebugParams extends LogsParams {}
