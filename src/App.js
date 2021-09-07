import React from 'react';
import './App.css';
import { useEffect, useState } from 'react';
import { interval, startWith, Subject, switchMap, timeout } from 'rxjs';


const observable$ = interval(1000);
const actionReset$ = new Subject ();
actionReset$.subscribe(console.log)


function App() {

  const [ time, setTime] = useState (0);
  const [ timerOn, setTimerOn ] = useState (false); 

  useEffect(() => {                   // для отладки
    console.log('useEffect:', time);  
  }, [time])

  useEffect(() => {
          
    let subscription = actionReset$.pipe(
      startWith(null),
      switchMap(() => observable$),
    ).subscribe(result =>{
      timerOn && setTime(result);
      } 
    );
    return () => subscription.unsubscribe();
  }, [timerOn]);

  const onStopClick = () => {
    setTimerOn(false)
    setTime(0)
  }

  return (
    <div className="mainBlock">
        <div>
            <div className="numbersBlock">
              <span>{("0" + Math.floor(( time / 3600) % 60 )).slice(-2)} :</span>&nbsp;
              <span>{("0" + Math.floor(( time / 60) % 60 )).slice(-2)} :</span>&nbsp;
              <span>{("0" + Math.floor(( time) % 60 )).slice(-2)}</span>    
            </div>     
            <div className="buttonsBlock">
              {!timerOn && (
              <button onClick={() => setTimerOn(true)}>Start</button>
              )}
              { timerOn && (
              <button onClick={onStopClick}>Stop</button>
              )}
              { timerOn && (
              <button onClick={() => actionReset$.next(true)}>Wait</button>
              )}   
              { time > 0 && (
              <button onClick={() => actionReset$.next('clickedreset')}>Reset</button>
              )}   
            </div>    
        </div>
    </div>        
  );
}

export default App;
