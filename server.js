// Import required libraries
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

// Serial Port configuration
// Replace '/dev/ttyUSB0' with your actual port (e.g., /dev/ttyS0, /dev/ttyAMA0, or other as identified)
const port = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 });

// Readline parser to split data by newline character
const parser = port.pipe(new Readline({ delimiter: '\n' }));

// Open event - triggered when the serial port is successfully opened
port.on('open', () => {
  console.log('Serial port is open and ready for communication.');
});

// Data event - triggered when data is received
parser.on('data', (data) => {
  console.log('Received data:', data.trim()); // Trim to remove extra spaces or newline
});

// Error event - triggered when there is a problem with the serial port
port.on('error', (err) => {
  console.error('Serial port error:', err.message);
});

// Function to send data to the serial port
function sendDataToSerial(data) {
  port.write(data, (err) => {
    if (err) {
      console.error('Error writing data to serial port:', err.message);
    } else {
      console.log('Data written to serial port:', data);
    }
  });
}

// Example of sending data after a delay (optional)
setTimeout(() => {
  sendDataToSerial('Hello, Device!\n');
}, 5000); // Send after 5 seconds

// Graceful shutdown handling (Ctrl+C)
process.on('SIGINT', () => {
  console.log('Closing the serial port...');
  port.close((err) => {
    if (err) {
      console.error('Error closing serial port:', err.message);
    } else {
      console.log('Serial port closed.');
    }
    process.exit(0);
  });
});
