"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQClient = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
class RabbitMQClient {
    constructor() { }
    // Set the RabbitMQ URL (required before usage)
    static setURL(rabbitmqUrl) {
        RabbitMQClient.url = rabbitmqUrl;
    }
    // Establish connection with RabbitMQ if not already connected
    static getConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!RabbitMQClient.connection) {
                if (!RabbitMQClient.url) {
                    console.error('RabbitMQ URL is not set. Use RabbitMQClient.setURL(url) before making a connection.');
                    process.exit(1);
                }
                try {
                    RabbitMQClient.connection = yield amqplib_1.default.connect(RabbitMQClient.url);
                    console.log('Connected to RabbitMQ');
                }
                catch (err) {
                    console.error('Failed to connect to RabbitMQ:', err);
                    process.exit(1);
                }
            }
            return RabbitMQClient.connection;
        });
    }
    // Create a channel if not already created
    static getChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!RabbitMQClient.channel) {
                try {
                    const connection = yield RabbitMQClient.getConnection();
                    RabbitMQClient.channel = yield connection.createChannel();
                    console.log('RabbitMQ channel created');
                }
                catch (err) {
                    console.error('Failed to create RabbitMQ channel:', err);
                    process.exit(1);
                }
            }
            return RabbitMQClient.channel;
        });
    }
    // Dynamically send messages to a queue
    static sendToQueue(queueName, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const channel = yield RabbitMQClient.getChannel();
                yield channel.assertQueue(queueName, { durable: true }); // Ensure the queue exists
                channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });
                console.log(`Message sent to queue "${queueName}":`, message.toString());
            }
            catch (err) {
                console.error(`Failed to send message to queue "${queueName}":`, err);
            }
        });
    }
    // Close the connection and channel
    static closeConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (RabbitMQClient.channel) {
                    yield RabbitMQClient.channel.close();
                    RabbitMQClient.channel = null;
                    console.log('RabbitMQ channel closed');
                }
                if (RabbitMQClient.connection) {
                    yield RabbitMQClient.connection.close();
                    RabbitMQClient.connection = null;
                    console.log('RabbitMQ connection closed');
                }
            }
            catch (err) {
                console.error('Failed to close RabbitMQ connection or channel:', err);
            }
        });
    }
}
exports.RabbitMQClient = RabbitMQClient;
RabbitMQClient.connection = null;
RabbitMQClient.channel = null;
