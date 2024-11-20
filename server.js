// Import required libraries
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const WebSocket = require('ws');
const express = require('express');
const path = require('path');

const app = express();
const httpPort = 5000; // HTTP server port
const wsPort = 8080; // WebSocket server port

// Set up the serial port connection
const serialPortPath = '/dev/ttyACM0'; // Replace with your actual port on Raspberry Pi
const baudRate = 9600;

const port = new SerialPort({ path: serialPortPath, baudRate }, (err) => {
  if (err) {
    console.error(`Failed to open serial port ${serialPortPath}:`, err.message);
    process.exit(1);
  }
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

// Buffer for incomplete data
let buffer = '';

// Set up WebSocket server
const wss = new WebSocket.Server({ port: wsPort });
console.log(`WebSocket server running on ws://localhost:${wsPort}`);

wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');

  // Handle messages from WebSocket clients
  ws.on('message', (message) => {
    console.log(`Message received from client: ${message}`);
    port.write(`${message}\n`, (err) => {
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

// Handle data from the serial port
parser.on('data', (data) => {
  buffer += data; // Append incoming data to buffer

  if (buffer.includes('\n')) {
    const completeData = buffer.trim(); // Get complete message and trim whitespace
    console.log(`Received data from Arduino: ${completeData}`);

    // Broadcast data to all connected WebSocket clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(completeData);
      }
    });

    buffer = ''; // Clear buffer for the next message
  }
});

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
