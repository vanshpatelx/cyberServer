import { Application, Request, Response, NextFunction } from 'express';
import https from 'https';
import { Server as WebSocketServer, WebSocket } from 'ws';
import { CyberServer, CyberServerConfig } from './CyberServer'; // Adjust import based on your structure
import { IncomingMessage } from 'http'; // Import IncomingMessage for type casting

interface CyberServerWSConfig extends CyberServerConfig {
    // Config
}

export class CyberServerWS extends CyberServer {
    private wss: WebSocketServer;

    constructor(config: CyberServerWSConfig) {
        super(config);

        const server = this.createServer();
        this.wss = new WebSocketServer({ server });
    }

    private createServer(): https.Server {
        const serverPort = this.config.port || 3000;

        if (this.config.httpsOptions) {
            return https.createServer(this.config.httpsOptions, this.app).listen(serverPort, () => {
                console.log(`CyberServerWS running securely on port ${serverPort}`);
            });
        } else {
            return this.app.listen(serverPort, () => {
                console.log(`CyberServerWS running on port ${serverPort}`);
            }) as unknown as https.Server;
        }
    }

    public start(): void {
        this.wss.on('connection', (client: WebSocket, req: IncomingMessage) => {
            console.log('New WebSocket connection established');

            client.on('message', (message: string) => {
                console.log(`Received message: ${message}`);
            });

            client.on('close', () => {
                console.log('WebSocket connection closed');
            });
        });
    }

    public broadcast(data: string): void {
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    }

    public closeConnections(): void {
        this.wss.clients.forEach((client) => {
            client.close();
        });
    }

    public addWebSocketHandler(path: string, handler: (client: WebSocket, req: IncomingMessage) => void): void {
        this.wss.on('connection', (client, req) => {
            if (req.url === path) {
                handler(client, req);
            }
        });
    }
}
