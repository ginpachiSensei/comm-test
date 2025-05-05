import { QueueManager } from "../Manager/queueManager";
import { ConsumeMessage } from "amqplib";

type MessageHandler = (payload: any) => void;

export class Subscriber {
  constructor(private qm: QueueManager) {}

  async subscribe(queue: string, handler: MessageHandler): Promise<void> {
    await this.qm.consume(queue, (message: ConsumeMessage | null) => {
      if (message) {
        const raw = message.content.toString();
        console.log(`Received message from ${queue}: ${raw}`);

        try {
          const parsed = JSON.parse(raw);
          handler(parsed);
        } catch (err) {
          console.error("Failed to parse message JSON:", err);
        }

        this.qm.ack(message);
      }
    });

    console.log(`Subscribed to ${queue}`);
  }
}
