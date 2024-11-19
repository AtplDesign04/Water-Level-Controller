import React, { useEffect, useState } from 'react';

export default function WaveAnimation({ isFlowing }) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Conditional title based on water flow status */}
      <h2 className="text-white text-lg font-semibold mb-2">
        {isFlowing ? "Water Flowing" : "Not Flowing"}
      </h2>
      
      {/* Wave effect */}
      <div className="relative w-full h-[60px] overflow-hidden bg-blue-500 rounded-b-lg">
        {/* First wave */}
        <div className={`absolute top-0 left-0 w-full h-full rounded-b-lg opacity-70 transform 
                        ${isFlowing ? "animate-wave" : ""}`} style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #1e40af, transparent 70%)',
          backgroundSize: '150% 150%',
        }}></div>
        {/* Second wave */}
        <div className={`absolute top-0 left-0 w-full h-full rounded-b-lg opacity-50 transform 
                        ${isFlowing ? "animate-wave delay-200" : ""}`} style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #60a5fa, transparent 70%)',
          backgroundSize: '150% 150%',
        }}></div>
      </div>
    </div>
  );
}
