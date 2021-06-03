import React, { Component, useState } from 'react';

/*export default class App extends Component{

    constructor(props){
        super(props);
        this.state = {
            nome: "Garcez!",
        };
    }

    render(){
        return(
            <div>
                {this.state.nome}
            </div>
        );
    }
}*/


export default function App(){
    const [ nome, setNome ] = useState('Garcez');
    const [ contador, setContador ] = useState(0);

    
    function diminuir(){
        let c = contador - 1;
        setContador(c);
    }


    function aumentar(){
        let c = contador + 1;
        setContador(c);
    }

    return(
        <div>
            Olá {nome}!<br/>
            Contador: <br/>
            <button onClick={() => diminuir()}>-</button> { contador } <button onClick={() => aumentar()}>+</button>
        </div>
    );
}