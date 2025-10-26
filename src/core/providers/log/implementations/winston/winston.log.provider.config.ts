import * as winston from 'winston';

const { combine, timestamp, printf, colorize, align, ms, json } =
  winston.format;
const requestIdFormat = printf(
  ({ timestamp, level, message, context, requestId, ms, ...meta }) => {
    const idPart = requestId ? `[${requestId}] ` : '';
    const contextPart = context ? `[${context}] ` : '';
    const msg =
      typeof message === 'object' ? JSON.stringify(message) : message || '';
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    const msPart = ms ? ` ${ms}` : ''; // Adiciona o +13s se presente
    return `${idPart}${timestamp} ${level.toUpperCase()} ${contextPart}${msg}${metaStr}${msPart}`;
  },
);

export const WinstonLogProviderConfig = {
  transports: [
    new winston.transports.Console({
      level: process.env.LOG_LEVEL || 'debug',
      format:
        process.env.NODE_ENV === 'production'
          ? combine(timestamp(), json())
          : combine(
              `${process.env.API_APP_CONTAINER_NAME || 'app'} - ` as unknown as winston.Logform.Format,
              colorize(),
              timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
              ms(),
              align(),
              requestIdFormat,
            ),
    }),
  ],
};
