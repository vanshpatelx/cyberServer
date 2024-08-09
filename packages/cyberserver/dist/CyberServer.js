"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CyberServer = void 0;
// src/CyberServer.ts
const express_1 = __importDefault(require("express"));
const https_1 = __importDefault(require("https"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
class CyberServer {
    constructor(config = {}) {
        // Default configurations for middleware
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
        this.setupMiddlewares();
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
            // Example rate limiting logic or use express-rate-limit here
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
    start() {
        const serverPort = this.config.port || 3000;
        if (this.config.httpsOptions) {
            https_1.default.createServer(this.config.httpsOptions, this.app).listen(serverPort, () => {
                console.log(`CyberServer running securely on port ${serverPort}`);
            });
        }
        else {
            this.app.listen(serverPort, () => {
                console.log(`CyberServer running on port ${serverPort}`);
            });
        }
    }
    addRoute(path, handler) {
        this.app.get(path, handler);
    }
}
exports.CyberServer = CyberServer;
