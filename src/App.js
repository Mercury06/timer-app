import React from 'react';
import './App.css';
import { useEffect, useState } from 'react';
import { interval, Subject, filter, map, debounceTime, buffer} from 'rxjs';


const observable$ = interval(1000);

const action$ = new Subject ();
action$.subscribe(console.log)
const wait$ = action$.pipe(filter( action => action === "wait"));


function App() {

  const [ time, setTime] = useState (0);
  const [ timerOn, setTimerOn ] = useState (false); 

  useEffect(() => {                   // для отладки
    console.log('useEffect:', time);  
  }, [time])  
 
  useEffect(() => {
    let subscription = observable$
    .subscribe(() => {
          if (timerOn) {
            setTime((prev) => prev + 1)
          };
        });
    return () => subscription.unsubscribe();
  }, [timerOn]); 


  useEffect (() => {
    const counts = wait$.pipe(debounceTime(300));
    const clicked$ = wait$.pipe(buffer(counts), map( clicks => clicks.length), filter( clicksCount => clicksCount === 2));  
    const waitMode = clicked$.subscribe(() => {
      setTimerOn(false);
    });    
    return () =>  waitMode.unsubscribe();
  }, []);

  const onStopClicked = () => {
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
              { !timerOn && (
              <button className="start" onClick={() => setTimerOn(true)}>Start</button>
              )}
              { timerOn && (
              <button className="stop" onClick={onStopClicked}>Stop</button>
              )}
              { timerOn && (
              <button className="wait" onClick={() => action$.next("wait")}>Wait</button>
              )}   
              { time > 0 && (
              <button className="reset" onClick={()=>setTime(0)}>Reset</button>
              )}               
            </div>    
        </div>
    </div>        
  );
}

export default App;
