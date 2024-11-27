import amqp from 'amqplib';

interface RabbitMQClient {}


class RabbitMQClient {
    private static connection: amqp.Connection | null = null;
    private static channel: amqp.Channel | null = null;
    private static url: string;

    private constructor() { }

    // Set the RabbitMQ URL (required before usage)
    public static setURL(rabbitmqUrl: string): void {
        RabbitMQClient.url = rabbitmqUrl;
    }

    // Establish connection with RabbitMQ if not already connected
    public static async getConnection(): Promise<amqp.Connection> {
        if (!RabbitMQClient.connection) {
            if (!RabbitMQClient.url) {
                console.error('RabbitMQ URL is not set. Use RabbitMQClient.setURL(url) before making a connection.');
                process.exit(1);
            }
            try {
                RabbitMQClient.connection = await amqp.connect(RabbitMQClient.url);
                console.log('Connected to RabbitMQ');
            } catch (err) {
                console.error('Failed to connect to RabbitMQ:', err);
                process.exit(1);
            }
        }
        return RabbitMQClient.connection;
    }

    // Create a channel if not already created
    public static async getChannel(): Promise<amqp.Channel> {
        if (!RabbitMQClient.channel) {
            try {
                const connection = await RabbitMQClient.getConnection();
                RabbitMQClient.channel = await connection.createChannel();
                console.log('RabbitMQ channel created');
            } catch (err) {
                console.error('Failed to create RabbitMQ channel:', err);
                process.exit(1);
            }
        }
        return RabbitMQClient.channel;
    }

    // Dynamically send messages to a queue
    public static async sendToQueue(queueName: string, message: string | Buffer): Promise<void> {
        try {
            const channel = await RabbitMQClient.getChannel();
            await channel.assertQueue(queueName, { durable: true }); // Ensure the queue exists
            channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });
            console.log(`Message sent to queue "${queueName}":`, message.toString());
        } catch (err) {
            console.error(`Failed to send message to queue "${queueName}":`, err);
        }
    }

    // Close the connection and channel
    public static async closeConnection(): Promise<void> {
        try {
            if (RabbitMQClient.channel) {
                await RabbitMQClient.channel.close();
                RabbitMQClient.channel = null;
                console.log('RabbitMQ channel closed');
            }
            if (RabbitMQClient.connection) {
                await RabbitMQClient.connection.close();
                RabbitMQClient.connection = null;
                console.log('RabbitMQ connection closed');
            }
        } catch (err) {
            console.error('Failed to close RabbitMQ connection or channel:', err);
        }
    }
}

export { RabbitMQClient };
