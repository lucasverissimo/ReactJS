import React, { useState } from 'react';
import './App.css';


export default function App() {

  const [ relogio, setRelogio ] = useState(0);
  const [ timer, setTimer ] = useState(null);

  function iniciar(){

    if(timer !==  null){
      clearInterval(timer);
      setTimer(null);
      return;
    }

    let n = relogio;
    let cron = setInterval(()=>{
      n = n + 0.01;
      setRelogio(n);
    }, 10);
    setTimer(cron);
  }

  function pausar(){
    clearInterval(timer);
    setTimer(null);
    setRelogio(0);
  }

 return (
   <div className="container">
     <img src={require('./assets/cronometro.png').default} className="img" />
     <h2>{relogio.toFixed(2)}</h2>
     <div className="areaBtn">
      <button className="botao" onClick={()=>iniciar()}>
        { timer !== null ? ("Pausar") : ("Iniciar")}
      </button>
      <button className="botao" onClick={()=>pausar()}>
        Limpar
      </button>
     </div>
   </div>
  );
}