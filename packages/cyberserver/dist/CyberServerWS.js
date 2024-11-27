"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CyberServerWS = void 0;
const https_1 = __importDefault(require("https"));
const ws_1 = require("ws");
const CyberServer_1 = require("./CyberServer"); // Adjust import based on your structure
class CyberServerWS extends CyberServer_1.CyberServer {
    constructor(config) {
        super(config);
        const server = this.createServer();
        this.wss = new ws_1.Server({ server });
    }
    createServer() {
        const serverPort = this.config.port || 3000;
        if (this.config.httpsOptions) {
            return https_1.default.createServer(this.config.httpsOptions, this.app).listen(serverPort, () => {
                console.log(`CyberServerWS running securely on port ${serverPort}`);
            });
        }
        else {
            return this.app.listen(serverPort, () => {
                console.log(`CyberServerWS running on port ${serverPort}`);
            });
        }
    }
    start() {
        this.wss.on('connection', (client, req) => {
            console.log('New WebSocket connection established');
            client.on('message', (message) => {
                console.log(`Received message: ${message}`);
            });
            client.on('close', () => {
                console.log('WebSocket connection closed');
            });
        });
    }
    broadcast(data) {
        this.wss.clients.forEach((client) => {
            if (client.readyState === ws_1.WebSocket.OPEN) {
                client.send(data);
            }
        });
    }
    closeConnections() {
        this.wss.clients.forEach((client) => {
            client.close();
        });
    }
    addWebSocketHandler(path, handler) {
        this.wss.on('connection', (client, req) => {
            if (req.url === path) {
                handler(client, req);
            }
        });
    }
}
exports.CyberServerWS = CyberServerWS;
