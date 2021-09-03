import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [ time, setTime] = useState (0);
  const [ timerOn, setTimerOn ] = useState (false);

  useEffect(() => {
    let interval = null;

    if (timerOn) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 10)
      }, 10)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [timerOn])

  const onStopClick = () => {
    setTimerOn(false)
    setTime(0)
    console.log(time)
  }

  return (
    <div className="mainBlock">
      <div >
      <div className="numbersBlock">
        <span>{("0" + Math.floor(( time / 60000) % 60 )).slice(-2)} :</span>&nbsp;
        <span>{("0" + Math.floor(( time / 1000) % 60 )).slice(-2)} :</span>&nbsp;
        <span>{("0" + (( time / 10) % 100)).slice(-2)}</span>
      </div>     
      <div className="buttonsBlock">
        {!timerOn && (
        <button onClick={() => setTimerOn(true)}>Start</button>
        )}
        { timerOn && (
        <button onClick={onStopClick}>Stop</button>
        )}
        { timerOn && (
        <button onClick={() => setTimerOn(false)}>Wait</button>
        )}   
        { time > 0 && (
        <button onClick={() => setTime(0)}>Reset</button>
        )}
      </div>
      </div>    
    </div>
  );
}

export default App;

