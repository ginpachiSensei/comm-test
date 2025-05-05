// queueManager.ts
import * as amqp from 'amqplib';
import { ChannelModel, Channel, Options, ConsumeMessage } from 'amqplib';

export interface Binding {
  queue: string;
  routingKey: string;
}

export interface Topology {
  exchange: { name: string; type: string; options?: Options.AssertExchange };
  bindings: Binding[];
  queueOptions?: Options.AssertQueue;
}

export class QueueExchangeManager {
  private connection?: ChannelModel;
  private channel?: Channel;
  private configured = false;

  constructor(private url: string) {}

  /** Connect + create channel */
  async init(): Promise<void> {
    this.connection = await amqp.connect(this.url);
    this.channel = await this.connection.createChannel();
  }

  /**
   * Declare exchange, queues, and bindings.
   * Must be called exactly once before publish/consume.
   */
  async configure(topology: Topology): Promise<void> {
    if (!this.channel) throw new Error('Channel not initialized');
    const { exchange, bindings, queueOptions = { durable: true } } = topology;

    // 1) Assert exchange
    await this.channel.assertExchange(exchange.name, exchange.type, exchange.options);

    // 2) Assert & bind each queue
    for (const { queue, routingKey } of bindings) {
      await this.channel.assertQueue(queue, queueOptions);
      await this.channel.bindQueue(queue, exchange.name, routingKey);
    }

    this.configured = true;
  }

  /** Publish a message; errors if you forgot to configure */
  async publish(exchange: string, routingKey: string, data: Buffer): Promise<void> {
    if (!this.channel || !this.configured) {
      throw new Error('QueueManager not configured—call configure() first');
    }
    this.channel.publish(exchange, routingKey, data);
  }

  /** Subscribe to a queue; errors if you forgot to configure */
  async consume(queue: string, onMessage: (msg: ConsumeMessage | null) => void): Promise<void> {
    if (!this.channel || !this.configured) {
      throw new Error('QueueManager not configured—call configure() first');
    }
    await this.channel.consume(queue, onMessage);
  }

  ack(message: ConsumeMessage): void {
    if (!this.channel || !this.configured) {
      throw new Error('QueueManager not configured—call configure() first');
    }
    this.channel.ack(message);
  }

  async close(): Promise<void> {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }
}
