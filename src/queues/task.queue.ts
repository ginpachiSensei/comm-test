import { publish } from '../rabbitmq/producer';
import { consume } from '../rabbitmq/consumer';
import {processTask, TaskPayload} from "../taskWorker";

const QUEUE_NAME = 'task_queue';

export const enqueueTask = async (task: TaskPayload) => {
    await publish<TaskPayload>({ queue: QUEUE_NAME, payload: task });
};

export const registerTaskConsumer = async () => {
    await consume<TaskPayload>(QUEUE_NAME, processTask);
};
