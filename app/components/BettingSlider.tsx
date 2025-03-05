"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, PanInfo } from "framer-motion";

interface BettingSliderProps {
  balance: number;
  sliderValue: number;
  setSliderValue: (value: number) => void;
}

function BettingSlider({
  balance,
  sliderValue,
  setSliderValue,
}: BettingSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliderWidth, setSliderWidth] = useState(0);

  useEffect(() => {
    if (sliderRef.current) {
      setSliderWidth(sliderRef.current.offsetWidth);
    }
  }, []);

  // Drag Handler
  const handleDrag = (_event: DragEvent, info: PanInfo) => {
    const newX =
      info.point.x - (sliderRef.current?.getBoundingClientRect().left ?? 0);
    const clampedX = Math.max(0, Math.min(newX, sliderWidth));
    const newValue = Math.round((clampedX / sliderWidth) * balance);
    setSliderValue(newValue);
  };

  // Input Change Handler
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setSliderValue(newValue);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto mt-10 p-4">
      <div className="h-12 w-full bg-slate-700 rounded-full flex items-center px-2">
        <motion.div className="h-6 w-full bg-gray-900 rounded-full flex items-center px-2">
          {/* Input Range Slider */}
          <input
            type="range"
            min="0"
            max={balance}
            value={sliderValue}
            onChange={handleInputChange}
            className="absolute w-full opacity-0 cursor-pointer"
          />
          {/* Colorful Slider Track */}
          <div
            ref={sliderRef}
            className="h-2 w-full rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
          ></div>
          {/* Draggable Knob */}
          <motion.div
            className="absolute h-8 w-6 bg-blue-400 rounded-md flex justify-center items-center cursor-pointer"
            drag="x"
            dragConstraints={{ left: 0, right: sliderWidth - 24 }}
            dragElastic={0}
            onDrag={handleDrag}
            style={{ x: (sliderValue / balance) * sliderWidth }}
          >
            {/* Value Display */}
            <motion.div className="absolute -top-10 w-16 h-10 bg-white text-green-600 font-bold flex justify-center items-center shadow-lg rounded-lg">
              {sliderValue}
            </motion.div>
            <div className="flex justify-between w-2">
              <div className="h-5 min-w-[2px] bg-blue-800 opacity-40"></div>
              <div className="h-5 min-w-[2px] bg-blue-800 opacity-40"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default BettingSlider;
