import {getChannel} from "./connection";

export type MessageHandler<T> = (data: T) => Promise<void>;

export const consume = async <T>(queue: string, handler: MessageHandler<T>) => {
    const channel = await getChannel();
    await channel.assertQueue(queue, {durable: true});
    await channel.prefetch(1)

    await channel.consume(queue, async (msg) => {
        if (msg) {
            try {
                const content = JSON.parse(msg.content.toString()) as T;
                await handler(content);
                channel.ack(msg);
            } catch (err) {
                console.error(`Error processing message on ${queue}:`, err);
                channel.nack(msg, false, false);
            }
        }
    });
}