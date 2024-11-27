import Redis from "ioredis";

interface RedisClient {}

class RedisClient {
    private static instance: Redis | null = null;

    private constructor() {}

    // Initialize the Redis instance with optional dynamic parameters
    public static initialize(options: {
        host?: string;
        port?: number;
        password?: string;
        db?: number;
    }): Redis {
        if (!RedisClient.instance) {
            const { host = "127.0.0.1", port = 6379, password, db = 0 } = options;

            RedisClient.instance = new Redis({
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
        } else {
            console.warn("RedisClient instance already exists. Ignoring initialize call.");
        }
        return RedisClient.instance;
    }

    // Get the existing Redis instance
    public static getInstance(): Redis {
        if (!RedisClient.instance) {
            console.error(
                "RedisClient instance is not initialized. Call RedisClient.initialize(options) first."
            );
            process.exit(1);
        }
        return RedisClient.instance;
    }
}

export { RedisClient };
