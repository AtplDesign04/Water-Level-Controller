// Import required libraries
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const serialPortPath = '/dev/ttyACM0'; // Replace with your device path
const baudRate = 9600;

const port = new SerialPort({ path: serialPortPath, baudRate }, (err) => {
  if (err) {
    return console.error('Failed to open serial port:', err.message);
  }
  console.log('Serial port opened successfully');
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

parser.on('data', (data) => {
  console.log(`Received: ${data.trim()}`);
});

port.on('error', (err) => {
  console.error('Serial port error:', err.message);
});


