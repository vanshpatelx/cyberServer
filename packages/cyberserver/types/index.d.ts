// declare module 'cyberserver' {
//     import { Application, Request, Response, NextFunction, RequestHandler } from 'express';
//     import https from 'https';
//     import { CorsOptions } from 'cors';
//     import { HelmetOptions } from 'helmet';
//     import { CompressionOptions } from 'compression';
//     import { OptionsJson, OptionsUrlencoded } from 'body-parser';

//     interface CyberServerConfig {
//         port?: number;
//         httpsOptions?: https.ServerOptions;
//         corsOptions?: CorsOptions;
//         helmetOptions?: HelmetOptions;
//         compressionOptions?: CompressionOptions;
//         bodyParserJsonOptions?: OptionsJson;
//         bodyParserUrlencodedOptions?: OptionsUrlencoded;
//         enableCors?: boolean;
//         enableHelmet?: boolean;
//         enableCompression?: boolean;
//         enableBodyParser?: boolean;
//         enableRateLimiting?: boolean;
//         customMiddlewares?: Array<RequestHandler>;
//         extendCore?: (app: Application) => void;
//         customErrorHandler?: (err: Error, req: Request, res: Response, next: NextFunction) => void;
//     }

//     export class CyberServer {
//         constructor(config: CyberServerConfig);
//         public start(): void;
//         public addRoute(path: string, handler: (req: Request, res: Response) => void): void;
//     }
// }

declare module 'cyberserver' {
    import { Application, Request, Response, NextFunction, RequestHandler } from 'express';
    import https from 'https';
    import { CorsOptions } from 'cors';
    import { HelmetOptions } from 'helmet';
    import { CompressionOptions } from 'compression';
    import { OptionsJson, OptionsUrlencoded } from 'body-parser';

    interface CyberServerConfig {
        port?: number;
        httpsOptions?: https.ServerOptions;
        corsOptions?: CorsOptions;
        helmetOptions?: HelmetOptions;
        compressionOptions?: CompressionOptions;
        bodyParserJsonOptions?: OptionsJson;
        bodyParserUrlencodedOptions?: OptionsUrlencoded;
        enableCors?: boolean;
        enableHelmet?: boolean;
        enableCompression?: boolean;
        enableBodyParser?: boolean;
        enableRateLimiting?: boolean;
        customMiddlewares?: Array<RequestHandler>;
        extendCore?: (app: Application) => void;
        customErrorHandler?: (err: Error, req: Request, res: Response, next: NextFunction) => void;
        enableClustering?: boolean; // Added option for clustering support
        restartOnFail?: boolean;    // Added option to restart worker on failure
    }

    export class CyberServer {
        constructor(config: CyberServerConfig);
        public start(): void;
        public addRoute(path: string, handler: (req: Request, res: Response) => void): void;
    }

    // interface CyberServerWSConfig extends CyberServerConfig {
    //     // Additional WebSocket-specific configuration options can be added here if needed
    // }

    // export class CyberServerWS extends CyberServer {
    //     constructor(config: CyberServerWSConfig);
    //     public start(): void;
    //     public broadcast(data: string): void;
    //     public closeConnections(): void;
    //     public addWebSocketHandler(path: string, handler: (ws: WebSocket) => void): void;
    // }

}


declare module 'CyberServerWS' {
    import { Application, Request, Response, NextFunction, RequestHandler } from 'express';
    import https from 'https';
    import { CorsOptions } from 'cors';
    import { HelmetOptions } from 'helmet';
    import { CompressionOptions } from 'compression';
    import { OptionsJson, OptionsUrlencoded } from 'body-parser';

    interface CyberServerConfig {
        port?: number;
        httpsOptions?: https.ServerOptions;
        corsOptions?: CorsOptions;
        helmetOptions?: HelmetOptions;
        compressionOptions?: CompressionOptions;
        bodyParserJsonOptions?: OptionsJson;
        bodyParserUrlencodedOptions?: OptionsUrlencoded;
        enableCors?: boolean;
        enableHelmet?: boolean;
        enableCompression?: boolean;
        enableBodyParser?: boolean;
        enableRateLimiting?: boolean;
        customMiddlewares?: Array<RequestHandler>;
        extendCore?: (app: Application) => void;
        customErrorHandler?: (err: Error, req: Request, res: Response, next: NextFunction) => void;
        enableClustering?: boolean; // Added option for clustering support
        restartOnFail?: boolean;    // Added option to restart worker on failure
    }

    export class CyberServer {
        constructor(config: CyberServerConfig);
        public start(): void;
        public addRoute(path: string, handler: (req: Request, res: Response) => void): void;
    }


    interface CyberServerWSConfig extends CyberServerConfig {
        // Additional WebSocket-specific configuration options can be added here if needed
    }

    export class CyberServerWS extends CyberServer {
        constructor(config: CyberServerWSConfig);
        public start(): void;
        public broadcast(data: string): void;
        public closeConnections(): void;
        public addWebSocketHandler(path: string, handler: (ws: WebSocket) => void): void;
    }

}

declare module 'DBClient' {
    export interface DBConfig {
        dbname: string;
        user: string;
        password: string;
        host: string;
        port: number;
        minconn?: number;
        maxconn?: number;
    }

    export class DBClient {
        private constructor(config: DBConfig);
        public static getInstance(config: DBConfig): DBClient;
        public initializeConnection(): Promise<void>;
        public executeQuery(query: string, params?: any[]): Promise<object[]>;
        public closePool(): Promise<void>;
    }
}

declare module 'RabbitMQClient' {
    import { Connection, Channel } from 'amqplib';

    export class RabbitMQClient {
        private constructor();
        public static setURL(rabbitmqUrl: string): void;
        public static getConnection(): Promise<Connection>;
        public static getChannel(): Promise<Channel>;
        public static sendToQueue(queueName: string, message: string | Buffer): Promise<void>;
        public static closeConnection(): Promise<void>;
    }
}

declare module 'RedisClient' {
    import Redis from 'ioredis';

    export interface RedisOptions {
        host?: string;
        port?: number;
        password?: string;
        db?: number;
    }

    export class RedisClient {
        private constructor();
        public static initialize(options: RedisOptions): Redis;
        public static getInstance(): Redis;
    }
}
