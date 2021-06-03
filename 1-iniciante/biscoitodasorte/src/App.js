import React, { useState } from 'react';
import './App.css';

export default function App(){

  const [ frases, setFrases ] = useState([
    "Nem sempre é fácil sorrir quando na verdade esta chorando por dentro...",
    "Você é feliz ou fingi ser feliz?",
    "Pode haver uma grande história por trás de um estou bem...",
    "Uma pessoa depressiva é só um corpo morto. É uma respiração sem vida. É uma vida sem inspiração de vida.",
    "As frases eram depressivas e agressivas, mas dentro de cada letra havia apenas a verdade. Tive que me destruir para me tornar forte.",
    "A tristeza não é tão ruim ,quando ela se torna sua única companhia.",
    "O mundo mudou, não é novidade. As pessoas ficaram loucas, depressivas e assanhadas. E meus valores, meus princípios, meus sentimentos e minha alegria não estão a venda. Obrigado.",
    "Ninguém pede pra ser depressivo. Quando nos damos conta, já estamos afundando numa escuridão sem fim.",
    "Triste é olhar para trás e ver que não construiu nada, olhar para frente e não ver motivo para construir algo.",
    "No mundo atual pessoa calma, quieta e pensativa é considerada antissocial e depressiva.",
  ]);

  const [ textoFrase, setTextoFrase ] = useState('Clique no botão para gerar sua frase');
  
  function quebraBiscoito(){
    
    let randomNum = Math.floor(Math.random() * frases.length);
    setTextoFrase('" '+frases[randomNum]+' "');
    
  }

  return(
    <div className="container">
      <img src={require('./assets/biscoito.png').default} className="img" />      
      <Botao nome="Abrir biscoito!" acaoBtn={quebraBiscoito} />
      <h3 className="textoFrase">{textoFrase}</h3>
    </div>
  );
}

export function Botao(props){
  return(
    <div>
      <button onClick={props.acaoBtn}>{props.nome}</button>
    </div>
  );
}