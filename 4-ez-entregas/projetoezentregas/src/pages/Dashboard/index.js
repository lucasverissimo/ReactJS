import React from 'react';
import './dashboard.css';
import Header from '../../components/Header';
import Title from '../../components/Title';

export default function Dashboard() {
 return (
   <div className="container-principal">
       <Header />
       <div className="container-conteudo container-dashboard">
           <Title>
             <h1>Home - Seja bem-vindo</h1>             
           </Title>
       </div>
   </div>
 );
}