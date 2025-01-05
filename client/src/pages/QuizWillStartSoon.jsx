import { useState, useEffect } from 'react';
import { setHours, setMinutes, setSeconds, differenceInSeconds } from 'date-fns';
import './Qc.css';

const QuizWillStartSoon = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: '00', minutes: '00', seconds: '00' });
  const [flipState, setFlipState] = useState({ hours: false, minutes: false, seconds: false });

  useEffect(() => {
    const targetTime = setSeconds(setMinutes(setHours(new Date(), 20), 0), 0); // 8 PM today
    const updateTimer = () => {
      const now = new Date();
      const secondsLeft = differenceInSeconds(targetTime, now);

      if (secondsLeft <= 0) {
        setTimeLeft({ hours: '00', minutes: '00', seconds: '00' });
        setFlipState({ hours: false, minutes: false, seconds: false });
        return;
      }

      const hours = String(Math.floor(secondsLeft / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0');
      const seconds = String(secondsLeft % 60).padStart(2, '0');
      
      setFlipState({
        hours: hours !== timeLeft.hours,
        minutes: minutes !== timeLeft.minutes,
        seconds: seconds !== timeLeft.seconds,
      });
      
      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-black">
      <h1 className="text-4xl mb-4">Quiz Has Ended</h1>
    </div>
  );
}

export default QuizWillStartSoon;