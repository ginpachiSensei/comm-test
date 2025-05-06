export interface TaskPayload {
    taskId: number;
    name: string;
}

export const processTask = async (payload: TaskPayload): Promise<void> => {
    console.log(`🔧 Processing task: ${payload.taskId} - ${payload.name}`);
    // simulate work
    await new Promise((resolve) => setTimeout(resolve, 1000));
};
