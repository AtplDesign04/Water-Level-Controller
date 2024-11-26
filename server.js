const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const WebSocket = require('ws');
const express = require('express');
const path = require('path');

// Windows-specific COM port
const serialPortPath = '/dev/ttyprintk'; // Replace with your actual port from Device Manager
const baudRate = 9600;
const httpPort = 5000; // HTTP server port
const wsPort = 8080; // WebSocket server port

const app = express();

// Set up SerialPort
const port = new SerialPort({ path: serialPortPath, baudRate }, (err) => {
  if (err) {
    console.error(`Failed to open serial port ${serialPortPath}:`, err.message);
    process.exit(1); // Exit if the serial port can't be opened
  }
  console.log(`Serial port ${serialPortPath} opened successfully`);
});

// Serial data parser
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

// WebSocket Server
const wss = new WebSocket.Server({ port: wsPort });
console.log(`WebSocket server running on ws://localhost:${wsPort}`);

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');

  // Receive messages from frontend and send to Arduino
  ws.on('message', (message) => {
    console.log(`Message received from client: ${message}`);
    port.write(`${message}`, (err) => {
      if (err) {
        console.error('Error writing to serial port:', err.message);
      } else {
        console.log('Message sent to Arduino');
      }
    });
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

// Handle data from Arduino
parser.on('data', (data) => {
  const trimmedData = data.trim();
  console.log(`Received data from Arduino: ${trimmedData}`);

  // Broadcast data to all connected WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(trimmedData);
    }
  });
});

// Handle serial port errors
port.on('error', (err) => {
  console.error('Serial port error:', err.message);
});

// Serve the frontend
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

// Start the HTTP server
app.listen(httpPort, () => {
  console.log(`HTTP server running on http://localhost:${httpPort}`);
});
