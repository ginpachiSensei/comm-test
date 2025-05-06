import amqp, {Channel, ChannelModel} from 'amqplib';

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

export const getChannel = async (): Promise<Channel> => {
    if (!connection) {
        connection = await amqp.connect('amqp://localhost');
        channel = await connection.createChannel();
    }
    return channel!;
};