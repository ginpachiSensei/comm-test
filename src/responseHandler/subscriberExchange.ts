// subscriber.ts
import { QueueExchangeManager as QueueManager } from "../Manager/queueExchangeManager.js";
import { ConsumeMessage } from 'amqplib';

export class Subscriber {
  constructor(private qm: QueueManager) {}

  async subscribe(queue: string, handler: (msg: any) => void): Promise<void> {
    await this.qm.consume(queue, (message: ConsumeMessage | null) => {
      if (!message) return;
      const raw = message.content.toString();
      try {
        handler(JSON.parse(raw));
      } catch (err) {
        console.error('Invalid JSON', err);
      }
      this.qm.ack(message);
    });
    console.log(`Now subscribing to ${queue}`);
  }
}
