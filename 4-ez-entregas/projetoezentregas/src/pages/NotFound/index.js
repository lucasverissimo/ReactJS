import React from 'react';

import Header from '../../components/Header';
import Title from '../../components/Title';

export default function NotFound() {
 
    return (
        <div className="container-principal">
        <Header />
        <div className="container-conteudo container-usuarios">
            <Title>
                <h1>Página não encontrada!</h1>                
            </Title>            
        </div>
        <div className="ListaUsuarios">
            A página que você esta tentandoa acessar não existe!
        </div>
    </div>
    );
 
}