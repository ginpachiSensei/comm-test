import {Job} from "./types";
import {getChannel} from "./connection";

export const publish = async <T>(job: Job<T>) => {
    const channel = await getChannel();
    await channel.assertQueue(job.queue, {durable: true});

    channel.sendToQueue(job.queue, Buffer.from(JSON.stringify(job.payload)), {persistent: true})
}