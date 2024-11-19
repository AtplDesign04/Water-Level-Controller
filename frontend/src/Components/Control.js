import React, { useEffect, useState } from 'react';
import WaveAnimation from './WaveAnimation';

export default function Controls() {
  const [tank1Level, setTank1Level] = useState(0); // State for tank 1 level
  const [tank2Level, setTank2Level] = useState(0); // State for tank 2 level
  const [isFlowing, setIsFlowing] = useState(false);
  const [inputValue, setInputValue] = useState(''); // State for input box

  // WebSocket connection
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      const rawData = event.data;
      // Parse tank levels from the incoming message
      setIsFlowing(rawData.includes('(T1:') && rawData.includes('T2:'));
      const match = rawData.match(/\(T1:(\d+)\sT2:(\d+)\)/);
      if (match) {
        setTank1Level(parseInt(match[1], 10));
        setTank2Level(parseInt(match[2], 10));
      }
    };

    ws.onclose = () => {
      setIsFlowing(false);
      console.log('Disconnected from WebSocket server');
    };

    return () => ws.close(); // Clean up WebSocket connection on component unmount
  }, []);

  // Handle input change
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Handle form submission (send data to the WebSocket server)
  const handleSubmit = (event) => {
    event.preventDefault();

    const ws = new WebSocket('ws://localhost:8080');
    ws.onopen = () => {
      ws.send(inputValue); // Send the input value to the server
      console.log(`Sent: ${inputValue}`);
    };
    ws.onclose = () => {
      console.log('WebSocket closed');
    };
  };

  return (
    <section className="flex px-5">
      <div className="container p-5">
        <div className="row m-2">
          <div className="col bg-primary h-[150px] text-center flex items-center justify-center text-white">
            <WaveAnimation isFlowing={isFlowing} />
          </div>
        </div>
        <div className="row m-2">
          {/* Tank 1 Level */}
          <div className="col bg-primary m-2 h-[150px] p-3 flex flex-col items-center justify-center">
            <h2 className="text-white text-center">TANK 1 LEVEL</h2>
            <div className="w-full bg-gray-300 rounded-full mt-2">
              <div
                className="bg-gradient-to-r from-white to-blue-400 rounded-full h-6 transition-all duration-1000"
                style={{ width: `${tank1Level}%` }}
              ></div>
            </div>
            <p className="text-white mt-2">{tank1Level}%</p>
          </div>

          {/* Tank 2 Level */}
          <div className="col bg-primary m-2 h-[150px] p-3 flex flex-col items-center justify-center">
            <h2 className="text-white text-center">TANK 2 LEVEL</h2>
            <div className="w-full bg-gray-300 rounded-full mt-2">
              <div
                className="bg-gradient-to-r from-white to-blue-400 rounded-full h-6 transition-all duration-1000"
                style={{ width: `${tank2Level}%` }}
              ></div>
            </div>
            <p className="text-white mt-2">{tank2Level}%</p>
          </div>
        </div>
      </div>

      {/* Input form to send data to the server */}
      <div className="container p-5">
        <div className="row m-2">
          <div className="col bg-primary m-2 h-[150px] flex items-center justify-center text-white">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="p-2 rounded"
                placeholder="Enter data"
              />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded ml-2">
                Send Data
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
