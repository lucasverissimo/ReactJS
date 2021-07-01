import React from 'react';
import './formUsuarios.css';

import Header from '../../components/Header';
import Title from '../../components/Title';


export default function FormUsuarios() {
 return (
    <div className="container-principal">
        <Header />
        <div className="container-conteudo container-dashboard">
            <Title>
             <h1>Usuários - Cadastrar usuário</h1>             
            </Title>
        </div>
    </div>
 );
}