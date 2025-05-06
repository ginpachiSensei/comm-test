import {enqueueTask, registerTaskConsumer} from "./queues/task.queue";

export const startConsumers = async () => {
    await registerTaskConsumer();
};

const bootstrap = async () => {
    await startConsumers();

    // Simulate publishing
    await enqueueTask({ taskId: 1, name: 'Convert image' });
    await enqueueTask({ taskId: 2, name: 'Resize video' });
};

bootstrap();