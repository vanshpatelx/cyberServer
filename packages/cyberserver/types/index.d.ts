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
}
