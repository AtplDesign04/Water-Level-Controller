const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const WebSocket = require('ws');
const express = require('express');
const path = require('path');
const app = express();
const port1 = process.env.PORT || 5000;
// Set up the serial port connection
const port = new SerialPort({ path: 'COM4', baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// Log and send data received from Arduino to WebSocket clients
let buffer = '';  // Buffer to hold incomplete data

port.on('data', (data) => {
  buffer += data;  // Append incoming data to buffer

  // Check if the buffer contains a full message (newline character indicates end of message)
  if (buffer.includes('\n')) {
    const completeData = buffer.trim();  // Get the complete message and trim whitespace
    // console.log(`Received complete data from Arduino: ${completeData}`);

    // Send the complete data to the WebSocket clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(completeData);
      }
    });

    // Clear the buffer for the next message
    buffer = '';
  }
});;

port.on('error', (err) => {
  console.error('Serial port error:', err.message);
});

// Set up WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('New client connected');
  
  ws.on('message', (message) => {
    console.log(`Message received from client: ${message}`);
    port.write(message, (err) => {
      if (err) {
        console.error('Error on write:', err.message);
      }
      console.log('Message sent to Arduino');
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

// Catch-all handler to serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

// Example API endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Start the server
app.listen(port1, () => {
  console.log(`Server is running on port ${port1}`);
});