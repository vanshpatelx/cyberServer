"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
class RedisClient {
    constructor() { }
    // Initialize the Redis instance with optional dynamic parameters
    static initialize(options) {
        if (!RedisClient.instance) {
            const { host = "127.0.0.1", port = 6379, password, db = 0 } = options;
            RedisClient.instance = new ioredis_1.default({
                host,
                port,
                password,
                db,
            });
            RedisClient.instance.on("connect", () => {
                console.log(`Connected to Redis at ${host}:${port}`);
            });
            RedisClient.instance.on("error", (err) => {
                console.error("Redis error:", err);
            });
        }
        else {
            console.warn("RedisClient instance already exists. Ignoring initialize call.");
        }
        return RedisClient.instance;
    }
    // Get the existing Redis instance
    static getInstance() {
        if (!RedisClient.instance) {
            console.error("RedisClient instance is not initialized. Call RedisClient.initialize(options) first.");
            process.exit(1);
        }
        return RedisClient.instance;
    }
}
exports.RedisClient = RedisClient;
RedisClient.instance = null;
