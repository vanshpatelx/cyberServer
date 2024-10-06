import { CyberServer } from 'cyberserver';

// Create a new instance of CyberServer
const server = new CyberServer({
    port: 3000,
    enableCors: true,
    enableHelmet: true,
    enableClustering: true,
    restartOnFail: true
});

// Add a simple route
server.addRoute('/hello', (req, res) => {
    res.send(`Hello from CyberServer!`);
});

// Start the server
server.start();
