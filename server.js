// Import required libraries
const { SerialPort } = require('serialport');
const Readline = require('@serialport/parser-readline');

// Serial Port configuration
const portPath = '/dev/ttyUSB0'; // Replace with the actual port
const baudRate = 9600; // Baud rate for the device

// Create a new SerialPort instance
const port = new SerialPort({ path: portPath, baudRate }, (err) => {
  if (err) {
    console.error(`Failed to open serial port at ${portPath}:`, err.message);
    process.exit(1); // Exit the program if the port cannot be opened
  }
});

// Create a Readline parser to process incoming data
const parser = port.pipe(new Readline({ delimiter: '\n' }));

// Handle the 'open' event
port.on('open', () => {
  console.log(`Serial port ${portPath} is open with baud rate ${baudRate}.`);
});

// Handle incoming data
parser.on('data', (data) => {
  const trimmedData = data.trim(); // Trim to remove extra spaces or newline
  console.log('Received data:', trimmedData);

  // Example: Respond to specific data
  if (trimmedData === 'PING') {
    sendDataToSerial('PONG\n');
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

// Example: Send data periodically (optional)
const exampleInterval = setInterval(() => {
  sendDataToSerial('Hello, Device!\n');
}, 10000); // Send every 10 seconds

// Graceful shutdown handling (Ctrl+C or termination signal)
process.on('SIGINT', () => {
  console.log('Closing the serial port...');
  clearInterval(exampleInterval); // Clear any intervals
  port.close((err) => {
    if (err) {
      console.error('Error closing serial port:', err.message);
    } else {
      console.log('Serial port closed successfully.');
    }
    process.exit(0); // Exit the program
  });
});
