import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownProps {
  targetDate: number;
  onComplete?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Don't set up the interval if the target date is in the past
    if (targetDate < Date.now()) {
      if (onComplete) onComplete();
      return;
    }

    const calculateTimeLeft = () => {
      const difference = targetDate - Date.now();
      
      if (difference <= 0) {
        if (onComplete) onComplete();
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft.days === 0 && 
          newTimeLeft.hours === 0 && 
          newTimeLeft.minutes === 0 && 
          newTimeLeft.seconds === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  return (
    <div className="bg-green-100 rounded-lg p-3 shadow-sm">
      <div className="flex items-center gap-2 text-green-800 mb-2">
        <Clock className="h-5 w-5" />
        <span className="font-semibold">Time Remaining:</span>
      </div>
      
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-white rounded-md p-2">
          <div className="text-xl font-bold text-red-600">{timeLeft.days}</div>
          <div className="text-xs text-gray-600">Days</div>
        </div>
        
        <div className="bg-white rounded-md p-2">
          <div className="text-xl font-bold text-red-600">{timeLeft.hours}</div>
          <div className="text-xs text-gray-600">Hours</div>
        </div>
        
        <div className="bg-white rounded-md p-2">
          <div className="text-xl font-bold text-red-600">{timeLeft.minutes}</div>
          <div className="text-xs text-gray-600">Mins</div>
        </div>
        
        <div className="bg-white rounded-md p-2">
          <div className="text-xl font-bold text-red-600">{timeLeft.seconds}</div>
          <div className="text-xs text-gray-600">Secs</div>
        </div>
      </div>
    </div>
  );
};

export default Countdown;