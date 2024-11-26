import React, { useEffect, useState } from 'react';
import WaveAnimation from './WaveAnimation';

export default function Controls() {
  const [tank1Level, setTank1Level] = useState(0); // State for tank 1 level
  const [tank2Level, setTank2Level] = useState(0); // State for tank 2 level
  const [isFlowing, setIsFlowing] = useState(false);
  const [statusMessage, setStatusMessage] = useState(''); // Status message for tanks

  // WebSocket connection
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      const rawData = event.data;

      const match = rawData.match(/\(T1:(\d+)\sT2:(\d+)\)/);
      if (match) {
        const tank1 = parseInt(match[1], 10);
        const tank2 = parseInt(match[2], 10);

        // Update tank levels
        setTank1Level(tank1);
        setTank2Level(tank2);
        if (tank1 > 100 || tank2 > 100) {
          setStatusMessage('Device not connected. Water not flowing.');
          setIsFlowing(false);
        } else if (tank1 > 0 && tank2 > 0) {
          setStatusMessage('Water flowing');
          setIsFlowing(true);
        } else {
          setStatusMessage('Water not flowing');
          setIsFlowing(false);
        }
        // Update water flow status
        setIsFlowing(tank1 > 0 && tank2 > 0 && tank1 <= 100 && tank2 <= 100);
      }
    };

    ws.onclose = () => {
      setIsFlowing(false);
      console.log('Disconnected from WebSocket server');
    };

    return () => ws.close(); // Clean up WebSocket connection on component unmount
  }, []);

  // Handle button clicks to send data
  const handleButtonClick = (value) => {
    const ws = new WebSocket('ws://localhost:8080');
    ws.onopen = () => {
      ws.send(value.toString()); // Send the value as a string
      console.log(`Sent: ${value}`);
    };
    ws.onclose = () => {
      console.log('WebSocket closed');
    };
  };

  return (
    <section className="flex px-5">
      <div className="container p-5">
        <div className="row m-2">
        <div className="row m-2">
          <div className="col bg-primary h-[150px] text-center flex flex-col items-center justify-center text-white">
            <WaveAnimation isFlowing={isFlowing} />
            <p className="mt-2">{statusMessage}</p>
          </div>
        </div>
          {/* Tank 1 Level */}
          <div className="col bg-primary m-2 h-[150px] p-3 flex flex-col items-center justify-center">
            <h2 className="text-white text-center">TANK 2 LEVEL</h2>
            <div className="w-full bg-gray-300 rounded-full mt-2">
              {tank1Level > 100 || tank1Level === 255 ? (
                <p className="text-red-500 mt-2">Device not connected</p>
              ) : (
                <div
                  className="bg-gradient-to-r from-white to-blue-400 rounded-full h-6 transition-all duration-1000"
                  style={{ width: `${Math.min(tank1Level, 100)}%` }}
                ></div>
              )}
            </div>
            {tank1Level <= 100 && tank1Level !== 255 && (
              <p className="text-white mt-2">{tank1Level}%</p>
            )}
          </div>

          {/* Tank 2 Level */}
          <div className="col bg-primary m-2 h-[150px] p-3 flex flex-col items-center justify-center">
            <h2 className="text-white text-center">TANK 2 LEVEL</h2>
            <div className="w-full bg-gray-300 rounded-full mt-2">
              {tank2Level > 100 || tank2Level === 255 ? (
                <p className="text-red-500 mt-2">Device not connected</p>
              ) : (
                <div
                  className="bg-gradient-to-r from-white to-blue-400 rounded-full h-6 transition-all duration-1000"
                  style={{ width: `${Math.min(tank2Level, 100)}%` }}
                ></div>
              )}
            </div>
            {tank2Level <= 100 && tank2Level !== 255 && (
              <p className="text-white mt-2">{tank2Level}%</p>
            )}
          </div>
        </div>
      </div>

      {/* On/Off Buttons */}
      <div className="container p-5">
        <div className="row m-2">
          <div className="col bg-primary m-2 h-[150px] flex flex-col items-center justify-center text-white">
            <button
              className="bg-green-500 text-white p-2 rounded m-2"
              onClick={() => handleButtonClick('1')}
            >
              On
            </button>
            <button
              className="bg-red-500 text-white p-2 rounded m-2"
              onClick={() => handleButtonClick('2')}
            >
              Off
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
