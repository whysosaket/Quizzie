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
      {timeLeft.hours === '00' && timeLeft.minutes === '00' && timeLeft.seconds === '00' ? (
        <div className="text-2xl mb-4 font-semibold flex flex-col items-center">
            {/* <h1 className=''>Please Refresh</h1> */}
            {/* <button 
        onClick={handleRefresh} 
        className="px-4 py-2 bg-black text-white hover:bg-gray-800 rounded text-sm mx-auto mt-4"
      >
        Refresh
      </button> */}
        </div>
      ) : (
        <div className="flex space-x-4 mb-4">
          <div className="flip-clock">
            <div className={`flip-card-inner ${flipState.hours ? 'flip' : ''}`}>
              <div className="flip-card-front">{timeLeft.hours}</div>
              <div className="flip-card-back">{timeLeft.hours}</div>
            </div>
            <span>Hours</span>
          </div>
          <div className="flip-clock">
            <div className={`flip-card-inner ${flipState.minutes ? 'flip' : ''}`}>
              <div className="flip-card-front">{timeLeft.minutes}</div>
              <div className="flip-card-back">{timeLeft.minutes}</div>
            </div>
            <span>Minutes</span>
          </div>
          <div className="flip-clock">
            <div className={`flip-card-inner ${flipState.seconds ? 'flip' : ''}`}>
              <div className="flip-card-front">{timeLeft.seconds}</div>
              <div className="flip-card-back">{timeLeft.seconds}</div>
            </div>
            <span>Seconds</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizWillStartSoon;