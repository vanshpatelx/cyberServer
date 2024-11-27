// Import required modules
import { CyberServerWS, CyberServerWSConfig } from 'CyberServerWS';
import https from 'https';
import fs from 'fs';

const sslOptions = {
    key: fs.readFileSync('path/to/your/privatekey.pem'),
    cert: fs.readFileSync('path/to/your/certificate.pem')
};

const config: CyberServerWSConfig = {
    port: 4000,
    httpsOptions: sslOptions,
    enableCors: true,
    enableHelmet: true,
    enableCompression: true,
    enableBodyParser: true,
};

const cyberServerWS = new CyberServerWS(config);

cyberServerWS.start();

cyberServerWS.addWebSocketHandler('/chat', (client, req) => {
    console.log(`New WebSocket connection on path: ${req.url}`);

    client.send('Welcome to the WebSocket server!');

    client.on('message', (message: string) => {
        console.log(`Received message from client: ${message}`);

        cyberServerWS.broadcast(`Client says: ${message}`);
    });

    client.on('close', () => {
        console.log('Client disconnected');
    });
});

setInterval(() => {
    cyberServerWS.broadcast('Hello to all connected clients!');
}, 10000);
