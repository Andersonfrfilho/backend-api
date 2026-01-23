import { Observable } from 'rxjs';

/**
 * Message priority levels for queue processing
 */
export enum MessagePriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3,
}

/**
 * Quality of Service levels for message delivery
 */
export enum QoSLevel {
  AT_MOST_ONCE = 0, // Fire and forget
  AT_LEAST_ONCE = 1, // Guaranteed delivery, may duplicate
  EXACTLY_ONCE = 2, // Guaranteed delivery, no duplicates
}

/**
 * Message headers for routing and metadata
 */
export interface MessageHeaders {
  [key: string]: string | number | boolean;
}

/**
 * Message metadata for tracking and observability
 */
export interface MessageMetadata {
  messageId?: string;
  correlationId?: string;
  timestamp?: Date;
  userId?: string;
  sessionId?: string;
  source?: string;
  version?: string;
}

/**
 * Base message structure
 */
export interface BaseMessage<T = any> {
  body: T;
  headers?: MessageHeaders;
  metadata?: MessageMetadata;
  priority?: MessagePriority;
  delay?: number; // Delay in milliseconds
  ttl?: number; // Time to live in milliseconds
}

/**
 * Producer configuration options
 */
export interface ProducerConfig {
  defaultQoS?: QoSLevel;
  defaultPriority?: MessagePriority;
  maxRetries?: number;
  retryDelay?: number;
  enableDeadLetterQueue?: boolean;
  deadLetterExchange?: string;
  deadLetterRoutingKey?: string;
  enableMetrics?: boolean;
  batchSize?: number;
  batchTimeout?: number;
}

/**
 * Send result for individual messages
 */
export interface SendResult {
  messageId: string;
  success: boolean;
  error?: Error;
  timestamp: Date;
  deliveryTag?: string;
  correlationId?: string;
}

/**
 * Batch send result
 */
export interface BatchSendResult {
  successful: SendResult[];
  failed: SendResult[];
  totalProcessed: number;
  duration: number;
}

/**
 * Producer health status
 */
export interface ProducerHealth {
  isHealthy: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'connecting' | 'error';
  pendingMessages: number;
  lastError?: Error;
  uptime: number;
}

/**
 * Message Producer Interface
 *
 * This interface defines the contract for message producers in enterprise-grade
 * messaging systems. It supports various QoS levels, batch operations, and
 * comprehensive error handling.
 *
 * @template T The type of message payload
 */
export interface QueueProducerMessageProviderInterface<T = any> {
  /**
   * Get the producer's unique identifier
   */
  getId(): string;

  /**
   * Get the producer's configuration
   */
  getConfig(): ProducerConfig;

  /**
   * Check if the producer is healthy and ready to send messages
   */
  isHealthy(): Promise<ProducerHealth>;

  /**
   * Send a single message to the queue
   *
   * @param queueName The target queue name
   * @param message The message to send
   * @param options Additional send options
   * @returns Promise resolving to send result
   */
  send(
    queueName: string,
    message: BaseMessage<T>,
    options?: {
      routingKey?: string;
      exchange?: string;
      mandatory?: boolean; // Message must be routed to a queue
      immediate?: boolean; // Message must be delivered immediately
      persistent?: boolean; // Message should survive broker restart
    },
  ): Promise<SendResult>;

  /**
   * Send multiple messages in a batch
   *
   * @param queueName The target queue name
   * @param messages Array of messages to send
   * @param options Batch send options
   * @returns Promise resolving to batch result
   */
  sendBatch(
    queueName: string,
    messages: BaseMessage<T>[],
    options?: {
      routingKey?: string;
      exchange?: string;
      transaction?: boolean; // Send all or none
      parallel?: boolean; // Send in parallel vs sequential
    },
  ): Promise<BatchSendResult>;

  /**
   * Send a message with guaranteed delivery confirmation
   *
   * @param queueName The target queue name
   * @param message The message to send
   * @param timeout Timeout for confirmation in milliseconds
   * @returns Observable that emits delivery confirmations
   */
  sendWithConfirmation(
    queueName: string,
    message: BaseMessage<T>,
    timeout?: number,
  ): Observable<SendResult>;

  /**
   * Send a message with custom QoS settings
   *
   * @param queueName The target queue name
   * @param message The message to send
   * @param qos Quality of Service level
   * @returns Promise resolving to send result
   */
  sendWithQoS(queueName: string, message: BaseMessage<T>, qos: QoSLevel): Promise<SendResult>;

  /**
   * Send a delayed message
   *
   * @param queueName The target queue name
   * @param message The message to send
   * @param delay Delay in milliseconds
   * @returns Promise resolving to send result
   */
  sendDelayed(
    queueName: string,
    message: BaseMessage<T>,
    delay: number,
    options?: {
      routingKey?: string;
      exchange?: string;
      mandatory?: boolean;
      immediate?: boolean;
      persistent?: boolean;
    },
  ): Promise<SendResult>;

  /**
   * Send a message with time-to-live
   *
   * @param queueName The target queue name
   * @param message The message to send
   * @param ttl Time to live in milliseconds
   * @returns Promise resolving to send result
   */
  sendWithTTL(queueName: string, message: BaseMessage<T>, ttl: number): Promise<SendResult>;

  /**
   * Get pending messages count for a queue
   *
   * @param queueName The queue name
   * @returns Promise resolving to message count
   */
  getPendingMessages(queueName: string): Promise<number>;

  /**
   * Purge all messages from a queue
   *
   * @param queueName The queue name
   * @returns Promise resolving to number of purged messages
   */
  purgeQueue(queueName: string): Promise<number>;

  /**
   * Get producer metrics and statistics
   *
   * @returns Producer metrics
   */
  getMetrics(): {
    totalSent: number;
    totalFailed: number;
    totalBatched: number;
    averageLatency: number;
    uptime: number;
    queues: string[];
  };

  /**
   * Close the producer and clean up resources
   *
   * @returns Promise that resolves when cleanup is complete
   */
  close(): Promise<void>;

  /**
   * Force reconnection to the message broker
   *
   * @returns Promise that resolves when reconnected
   */
  reconnect(): Promise<void>;

  /**
   * Add event listeners for producer events
   *
   * @param event Event name
   * @param listener Event listener function
   */
  on(
    event: 'connected' | 'disconnected' | 'error' | 'message-sent' | 'message-failed',
    listener: (...args: any[]) => void,
  ): void;

  /**
   * Remove event listeners
   *
   * @param event Event name
   * @param listener Event listener function
   */
  off(event: string, listener: (...args: any[]) => void): void;
}
