import { ConsumeMessage } from 'amqplib';

/**
 * Consumer message interface
 */
export interface ConsumerMessage<T = any> {
  body: T;
  headers?: Record<string, any>;
  metadata?: {
    messageId?: string;
    correlationId?: string;
    timestamp?: Date;
    userId?: string;
    source?: string;
  };
  rawMessage: ConsumeMessage;
}

/**
 * Consumer result interface
 */
export interface ConsumerResult {
  success: boolean;
  error?: Error;
  retry?: boolean;
  retryDelay?: number;
  deadLetter?: boolean;
}

/**
 * Message Consumer Interface
 *
 * This interface defines the contract for message consumers in enterprise-grade
 * messaging systems. It supports various processing patterns and error handling.
 */
export interface MessageConsumerInterface<T = any> {
  /**
   * Get the consumer's unique identifier
   */
  getId(): string;

  /**
   * Get the queue name this consumer listens to
   */
  getQueueName(): string;

  /**
   * Process a single message
   *
   * @param message The message to process
   * @returns Promise resolving to processing result
   */
  process(message: ConsumerMessage<T>): Promise<ConsumerResult>;

  /**
   * Handle processing errors
   *
   * @param message The message that failed
   * @param error The error that occurred
   * @returns Consumer result with error handling instructions
   */
  handleError(message: ConsumerMessage<T>, error: Error): Promise<ConsumerResult>;

  /**
   * Check if the consumer is healthy
   */
  isHealthy(): Promise<boolean>;

  /**
   * Get consumer metrics
   */
  getMetrics(): {
    totalProcessed: number;
    totalFailed: number;
    totalRetried: number;
    averageProcessingTime: number;
    uptime: number;
  };
}
