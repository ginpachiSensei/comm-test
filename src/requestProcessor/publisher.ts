// publisher.ts
import { QueueManager } from "../Manager/queueManager";

export type MessagePayload = Record<string, any> | string;

export class Publisher {
  constructor(private qm: QueueManager) {}

  /** ensure queue exists, transform payload, and publish */
  async publish(queue: string, payload: MessagePayload): Promise<void> {
    // 1) make sure the queue is there
    await this.qm.assertQueue(queue);

    // 2) any preprocessing step:
    //    - if it's an object, JSON-stringify; leave strings untouched
    const raw =
      typeof payload === "string"
        ? Buffer.from(payload)
        : Buffer.from(JSON.stringify(payload));

    // 3) send
    // await this.qm.send(exchange, routingKey, message);
    await this.qm.send(queue, raw);
    console.log(`Published to ${queue}:`, payload);
  }
}
