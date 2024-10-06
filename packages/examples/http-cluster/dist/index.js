"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const cyberserver_1 = require("cyberserver");
// Create a new instance of CyberServer
const server = new cyberserver_1.CyberServer({
    port: 3000,
    enableCors: true,
    enableHelmet: true
});
// Add a simple route
server.addRoute('/hello', (req, res) => {
    res.send('Hello from CyberServer!');
});
// Start the server
server.start();
