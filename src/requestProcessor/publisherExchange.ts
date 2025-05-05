// publisher.ts
import { QueueExchangeManager as QueueManager } from "../Manager/queueExchangeManager.js";

export class PublisherExchange {
  constructor(private qm: QueueManager, private exchange: string) {}

  async publish(routingKey: string, payload: any): Promise<void> {
    const raw = Buffer.from(JSON.stringify(payload));
    await this.qm.publish(this.exchange, routingKey, raw);
    console.log(`Published to ${this.exchange}@${routingKey}`, payload);
  }
}