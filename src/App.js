import React from 'react';
import './App.css';
import { useEffect, useState } from 'react';
import { interval, startWith, Subject, switchMap, scan, filter, share, tap, merge, EMPTY, mapTo, takeUntil, bufferCount, map} from 'rxjs';


const observable$ = interval(1000).pipe(mapTo(1), share());

const action$ = new Subject ();
action$.subscribe(console.log)


//const wait$ = action$.pipe(filter( action => action === false));

const wait$ = action$.pipe(filter( action => action === "wait"), map(action=>action === false));

//const wait$ = action$.pipe(filter( action => action === "wait"), bufferWhen(() => action$.debounceTime(500)), map(list => list.length), filter(length => length >= 2), map(action=>action === false));

const start$ = action$.pipe(filter( action => action === true));

const stop$ = action$.pipe(filter( action => action === "clickstop"));

const reset$ = action$.pipe(filter( action => action === "clickreset"));

const timer$ = merge(wait$, start$)
  .pipe(
    startWith(false),    
    switchMap(val => (val ? observable$.pipe(takeUntil(reset$.pipe(tap(()=>console.log('reseted')), switchMap(()=>observable$.pipe(startWith(null)))))) : EMPTY)),
    scan((acc, curr) => (curr ? curr + acc : acc))
  )

function App() {

  const [ time, setTime] = useState (0);
  const [ timerOn, setTimerOn ] = useState (true); 

  useEffect(() => {                   // для отладки
    console.log('useEffect:', time);  
  }, [time])

  
  useEffect(() => {     

    let subscription = timer$.subscribe 
    (result =>{setTime(result);
      } 
    );
    return () => subscription.unsubscribe();
  }, []);  

  return (
    <div className="mainBlock">
        <div>
            <div className="numbersBlock">
              <span>{("0" + Math.floor(( time / 3600) % 60 )).slice(-2)} :</span>&nbsp;
              <span>{("0" + Math.floor(( time / 60) % 60 )).slice(-2)} :</span>&nbsp;
              <span>{("0" + Math.floor(( time) % 60 )).slice(-2)}</span>    
            </div>     
            <div className="buttonsBlock">
              { (
              <button className="start" onClick={() => action$.next(true)}>Start</button>
              )}
              { timerOn && (
              <button className="stop" onClick={() => action$.next("clickstop")}>Stop</button>
              )}
              { timerOn && (
              <button className="wait" onClick={() => action$.next("wait")}>Wait</button>
              )}   
              { time > 0 && (
              <button className="reset" onClick={() => action$.next("clickreset")}>Reset</button>
              )}   
            </div>    
        </div>
    </div>        
  );
}

export default App;
