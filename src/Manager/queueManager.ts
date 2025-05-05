import amqp from "amqplib";
import type { ChannelModel, Channel, Options, ConsumeMessage } from "amqplib";

export interface QueueOptions {
  durable: boolean;
}

export class QueueManager {
  private connection?: ChannelModel;
  private channel?: Channel;

  constructor(private url: string) {}

  /** initialize connection and channel */
  async init(): Promise<void> {
    this.connection = await amqp.connect(this.url);
    if (!this.connection) {
      throw new Error("Connection not initialized");
    }
    this.channel = await this.connection.createChannel();
  }

  /** assert (create) a queue if it doesn't exist */
  async assertQueue(
    name: string,
    opts: QueueOptions = { durable: true }
  ): Promise<void> {
    if (!this.channel) throw new Error("Channel not initialized");
    await this.channel
      .assertQueue(name, opts as Options.AssertQueue)
      .catch((err) => {
        console.error("Failed to assert queue:", err);
        throw err;
      });
  }

  async assertExchange(
    name: string,
    type: string,
    options: Options.AssertExchange = { durable: true }
  ): Promise<void> {
    if (!this.channel) throw new Error("Channel not initialized");
    await this.channel.assertExchange(name, type, options);
  }

  async bindQueue(
    queue: string,
    exchange: string,
    routingKey: string
  ): Promise<void> {
    if (!this.channel) throw new Error("Channel not initialized");
    await this.channel.bindQueue(queue, exchange, routingKey);
  }

  /** send a raw buffer message */
  // async send(exchange: string, routingKey: string, data: Buffer): Promise<void> {
  //   if (!this.channel) throw new Error("Channel not initialized");
  //   this.channel.publish(exchange, routingKey, data);
  // }
  async send(name: string, data: Buffer): Promise<void> {
    if (!this.channel) throw new Error("Channel not initialized");
    this.channel.sendToQueue(name, data);
  }

  async consume(
    queue: string,
    onMessage: (msg: ConsumeMessage | null) => void
  ): Promise<void> {
    if (!this.channel) throw new Error("Channel not initialized");
    await this.channel.assertQueue(queue, { durable: true });
    await this.channel.consume(queue, onMessage);
  }

  ack(message: ConsumeMessage): void {
    if (!this.channel) throw new Error("Channel not initialized");
    this.channel.ack(message);
  }

  /** cleanly close channel & connection */
  async close(): Promise<void> {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }
}
