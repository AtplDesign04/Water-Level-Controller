// Import required libraries
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

// Serial Port configuration
const portPath = '/dev/ttyUSB0'; // Replace with the actual port identified on your Raspberry Pi
const baudRate = 9600; // Configure the baud rate based on your device's settings

// Create a new SerialPort instance
const port = new SerialPort(portPath, { baudRate }, (err) => {
  if (err) {
    console.error(`Failed to open serial port at ${portPath}:`, err.message);
    process.exit(1); // Exit if port cannot be opened
  }
});

// Create a Readline parser to process data line by line
const parser = port.pipe(new Readline({ delimiter: '\n' }));

// Handle the 'open' event
port.on('open', () => {
  console.log(`Serial port ${portPath} is open with baud rate ${baudRate}.`);
});

// Handle incoming data
parser.on('data', (data) => {
  const trimmedData = data.trim(); // Trim to remove extra spaces or newline
  console.log('Received data:', trimmedData);

  // Example: Handle specific commands or data
  if (trimmedData === 'PING') {
    sendDataToSerial('PONG\n'); // Respond to a PING command
  }
});

// Handle serial port errors
port.on('error', (err) => {
  console.error('Serial port error:', err.message);
});

// Function to send data to the serial port
function sendDataToSerial(data) {
  port.write(data, (err) => {
    if (err) {
      console.error('Error writing data to serial port:', err.message);
    } else {
      console.log('Data successfully written to serial port:', data.trim());
    }
  });
}

// Example: Send data at regular intervals (optional)
const exampleInterval = setInterval(() => {
  sendDataToSerial('Hello, Device!\n');
}, 10000); // Send every 10 seconds

// Graceful shutdown handling (Ctrl+C or termination signal)
process.on('SIGINT', () => {
  console.log('Closing the serial port...');
  clearInterval(exampleInterval); // Clear any intervals before exiting
  port.close((err) => {
    if (err) {
      console.error('Error closing serial port:', err.message);
    } else {
      console.log('Serial port closed successfully.');
    }
    process.exit(0); // Exit the application
  });
});
