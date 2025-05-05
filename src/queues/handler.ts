import * as amqp from 'amqplib';
import { QueueExchangeManager as QueueManager, Topology } from '../Manager/queueExchangeManager';
import {PublisherExchange as Publisher} from '../requestProcessor/publisherExchange';

const {
  AMQP_URL,
  EXCHANGE_NAME,
  EXCHANGE_TYPE,
  EMAIL_QUEUE,
  EMAIL_ROUTING_KEY,
  SMS_QUEUE,
  SMS_ROUTING_KEY,
} = process.env;

if (!AMQP_URL || !EXCHANGE_NAME || !EXCHANGE_TYPE) {
  throw new Error('Missing RabbitMQ connection or exchange settings in environment');
}

// Build topology from env
const topology: Topology = {
  exchange: { name: EXCHANGE_NAME, type: EXCHANGE_TYPE },
  bindings: [],
};

if (EMAIL_QUEUE && EMAIL_ROUTING_KEY) {
  topology.bindings.push({ queue: EMAIL_QUEUE, routingKey: EMAIL_ROUTING_KEY });
}

if (SMS_QUEUE && SMS_ROUTING_KEY) {
  topology.bindings.push({ queue: SMS_QUEUE, routingKey: SMS_ROUTING_KEY });
}

// Initialize QueueManager and Publisher
const qm = new QueueManager(AMQP_URL);
const publisher: Publisher = new Publisher(qm, EXCHANGE_NAME);

/**
 * Initializes RabbitMQ connection and topology.
 * Call this once at application startup.
 */
export async function initializeRabbit(): Promise<void> {
  await qm.init();
  await qm.configure(topology);
  console.log('RabbitMQ connected & topology asserted');
}

/**
 * Retrieves the shared Publisher instance. Assumes initializeRabbit has been called.
 */
export function getPublisher(): Publisher {
  if (!qm) {
    throw new Error('RabbitMQ not initialized');
  }
  return publisher;
}

/**
 * Gracefully closes RabbitMQ connection.
 */
export async function closeRabbit(): Promise<void> {
  await qm.close();
}
