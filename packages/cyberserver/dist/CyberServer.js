"use strict";
// import express, { Application, Request, Response, NextFunction, RequestHandler } from 'express';
// import https from 'https';
// import cors, { CorsOptions } from 'cors';
// import morgan from 'morgan';
// import bodyParser, { OptionsJson, OptionsUrlencoded } from 'body-parser';
// import helmet, { HelmetOptions } from 'helmet';
// import compression, { CompressionOptions } from 'compression';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CyberServer = void 0;
// export interface CyberServerConfig {
//     port?: number;
//     httpsOptions?: https.ServerOptions;
//     corsOptions?: CorsOptions;
//     helmetOptions?: HelmetOptions; // Updated to helmet.HelmetOptions or just use `any`
//     compressionOptions?: CompressionOptions;
//     bodyParserJsonOptions?: OptionsJson;
//     bodyParserUrlencodedOptions?: OptionsUrlencoded;
//     enableCors?: boolean;
//     enableHelmet?: boolean;
//     enableCompression?: boolean;
//     enableBodyParser?: boolean;
//     enableRateLimiting?: boolean;
//     customMiddlewares?: Array<RequestHandler>;
//     extendCore?: (app: Application) => void;
//     customErrorHandler?: (err: Error, req: Request, res: Response, next: NextFunction) => void;
// }
// export class CyberServer {
//     private app: Application;
//     private config: CyberServerConfig;
//     // Default configurations for middleware
//     private defaultCorsOptions: CorsOptions = {
//         origin: '*',
//         methods: ['GET', 'POST', 'PUT', 'DELETE'],
//         allowedHeaders: ['Content-Type', 'Authorization'],
//     };
//     private defaultHelmetOptions: HelmetOptions = {
//         contentSecurityPolicy: false, // or provide a valid object if needed
//     };
//     private defaultCompressionOptions: CompressionOptions = {
//         level: 6,
//     };
//     private defaultBodyParserJsonOptions: OptionsJson = {
//         limit: '10mb',
//     };
//     private defaultBodyParserUrlencodedOptions: OptionsUrlencoded = {
//         limit: '10mb',
//         extended: true,
//     };
//     constructor(config: CyberServerConfig = {}) {
//         this.config = config;
//         this.app = express();
//         this.setupMiddlewares();
//     }
//     private setupMiddlewares() {
//         if (this.config.enableHelmet !== false) {
//             this.app.use(helmet(this.config.helmetOptions || this.defaultHelmetOptions));
//         }
//         if (this.config.enableCors !== false) {
//             this.app.use(cors(this.config.corsOptions || this.defaultCorsOptions));
//         }
//         if (this.config.enableCompression !== false) {
//             this.app.use(compression(this.config.compressionOptions || this.defaultCompressionOptions));
//         }
//         if (this.config.enableBodyParser !== false) {
//             this.app.use(bodyParser.json(this.config.bodyParserJsonOptions || this.defaultBodyParserJsonOptions));
//             this.app.use(bodyParser.urlencoded(this.config.bodyParserUrlencodedOptions || this.defaultBodyParserUrlencodedOptions));
//         }
//         if (this.config.enableRateLimiting) {
//             const limiter = this.setupRateLimiting();
//             this.app.use(limiter);
//         }
//         if (this.config.customMiddlewares) {
//             this.config.customMiddlewares.forEach((middleware) => {
//                 this.app.use(middleware);
//             });
//         }
//         if (this.config.extendCore) {
//             this.config.extendCore(this.app);
//         }
//         this.setupLogging();
//         this.setupErrorHandling();
//     }
//     private setupLogging() {
//         const loggingMode = process.env.NODE_ENV === 'development' ? 'dev' : 'combined';
//         this.app.use(morgan(loggingMode));
//     }
//     private setupRateLimiting(): RequestHandler {
//         return (req, res, next) => {
//             // Example rate limiting logic or use express-rate-limit here
//             next();
//         };
//     }
//     private setupErrorHandling() {
//         const defaultErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
//             console.error(err.stack);
//             const responseMessage = process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!';
//             res.status(500).send(responseMessage);
//         };
//         this.app.use(this.config.customErrorHandler || defaultErrorHandler);
//     }
//     public start() {
//         const serverPort = this.config.port || 3000;
//         if (this.config.httpsOptions) {
//             https.createServer(this.config.httpsOptions, this.app).listen(serverPort, () => {
//                 console.log(`🚀 CyberServer running securely on port ${serverPort}`);
//             });
//         } else {
//             this.app.listen(serverPort, () => {
//                 console.log(`CyberServer running on port ${serverPort}`);
//             });
//         }
//     }
//     public addRoute(path: string, handler: (req: Request, res: Response) => void) {
//         this.app.get(path, handler);
//     }
// }
const express_1 = __importDefault(require("express"));
const https_1 = __importDefault(require("https"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
class CyberServer {
    constructor(config = {}) {
        this.defaultCorsOptions = {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        };
        this.defaultHelmetOptions = {
            contentSecurityPolicy: false,
        };
        this.defaultCompressionOptions = {
            level: 6,
        };
        this.defaultBodyParserJsonOptions = {
            limit: '10mb',
        };
        this.defaultBodyParserUrlencodedOptions = {
            limit: '10mb',
            extended: true,
        };
        this.config = config;
        this.app = (0, express_1.default)();
        if (this.config.enableClustering && cluster_1.default.isPrimary) {
            this.setupClustering();
        }
        else {
            this.setupMiddlewares();
        }
    }
    setupMiddlewares() {
        if (this.config.enableHelmet !== false) {
            this.app.use((0, helmet_1.default)(this.config.helmetOptions || this.defaultHelmetOptions));
        }
        if (this.config.enableCors !== false) {
            this.app.use((0, cors_1.default)(this.config.corsOptions || this.defaultCorsOptions));
        }
        if (this.config.enableCompression !== false) {
            this.app.use((0, compression_1.default)(this.config.compressionOptions || this.defaultCompressionOptions));
        }
        if (this.config.enableBodyParser !== false) {
            this.app.use(body_parser_1.default.json(this.config.bodyParserJsonOptions || this.defaultBodyParserJsonOptions));
            this.app.use(body_parser_1.default.urlencoded(this.config.bodyParserUrlencodedOptions || this.defaultBodyParserUrlencodedOptions));
        }
        if (this.config.enableRateLimiting) {
            const limiter = this.setupRateLimiting();
            this.app.use(limiter);
        }
        if (this.config.customMiddlewares) {
            this.config.customMiddlewares.forEach((middleware) => {
                this.app.use(middleware);
            });
        }
        if (this.config.extendCore) {
            this.config.extendCore(this.app);
        }
        this.setupLogging();
        this.setupErrorHandling();
    }
    setupLogging() {
        const loggingMode = process.env.NODE_ENV === 'development' ? 'dev' : 'combined';
        this.app.use((0, morgan_1.default)(loggingMode));
    }
    setupRateLimiting() {
        return (req, res, next) => {
            next();
        };
    }
    setupErrorHandling() {
        const defaultErrorHandler = (err, req, res, next) => {
            console.error(err.stack);
            const responseMessage = process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!';
            res.status(500).send(responseMessage);
        };
        this.app.use(this.config.customErrorHandler || defaultErrorHandler);
    }
    setupClustering() {
        const numCPUs = os_1.default.cpus().length;
        console.log(`Primary process ${process.pid} is running with ${numCPUs} CPUs available`);
        for (let i = 0; i < numCPUs; i++) {
            cluster_1.default.fork();
        }
        cluster_1.default.on('exit', (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
            if (this.config.restartOnFail !== false) {
                console.log(`Starting a new worker`);
                cluster_1.default.fork();
            }
        });
    }
    start() {
        const serverPort = this.config.port || 3000;
        if (this.config.enableClustering && cluster_1.default.isWorker) {
            if (this.config.httpsOptions) {
                https_1.default.createServer(this.config.httpsOptions, this.app).listen(serverPort, () => {
                    console.log(`🚀 Worker ${process.pid} CyberServer running securely on port ${serverPort}`);
                });
            }
            else {
                this.app.listen(serverPort, () => {
                    console.log(`Worker ${process.pid} CyberServer running on port ${serverPort}`);
                });
            }
        }
        else if (!this.config.enableClustering) {
            // Fallback for single-instance mode
            if (this.config.httpsOptions) {
                https_1.default.createServer(this.config.httpsOptions, this.app).listen(serverPort, () => {
                    console.log(`🚀 CyberServer running securely on port ${serverPort}`);
                });
            }
            else {
                this.app.listen(serverPort, () => {
                    console.log(`CyberServer running on port ${serverPort}`);
                });
            }
        }
    }
    addRoute(path, handler) {
        this.app.get(path, handler);
    }
}
exports.CyberServer = CyberServer;
