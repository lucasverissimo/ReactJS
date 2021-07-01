import React, { useEffect, useState } from 'react';

import './usuarios.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { Link } from 'react-router-dom';

import { MdAdd, MdDelete, MdEdit } from 'react-icons/md';

export default function Usuarios() {

    const [ listaUsuarios, setListaUsuarios ] = useState([/*
        {id: 1, nome: 'Lucas Garcez', email:'lucas_verissimo@outlook.com', ativo:true},
        {id: 2, nome: 'Lucas Garcez', email:'lucas_verissimo@outlook.com', ativo:false},
        {id: 3, nome: 'Lucas Garcez', email:'lucas_verissimo@outlook.com', ativo:true},
        {id: 4, nome: 'Lucas Garcez', email:'lucas_verissimo@outlook.com', ativo:true},
        {id: 5, nome: 'Lucas Garcez', email:'lucas_verissimo@outlook.com', ativo:false},*/
    ]);

 return (
    <div className="container-principal">
        <Header />
        <div className="container-conteudo container-usuarios">
            <Title>
                <h1>Usuários - Lista de cadastrados</h1>
                <div className="group-btn-title">
                    <Link to='/form-usuarios'>
                        <MdAdd size={32} color="#FFF" />
                    </Link>
                </div>
            </Title>

            <div className="ListaUsuarios">
                <div className={`tituloLista ${listaUsuarios.length === 0 ? `hide`: ``}`}>
                    <div className="blocoTituloLista t1">
                        Nome
                    </div>
                    <div className="blocoTituloLista t2">
                        E-mail
                    </div>
                    <div className="blocoTituloLista t3">
                        Conta ativa?
                    </div>
                    <div className="blocoTituloLista t4">
                        Ações
                    </div>
                </div>
                {listaUsuarios.length === 0 ? (
                    <div>Nenehum item encontrado!</div>
                ) 
                : 
                listaUsuarios.map((usuario, index) => {
                    return(
                        <div className="itemLista" key={index}>
                            <div className="t1">{usuario.nome}</div>
                            <div className="t2">{usuario.email}</div>
                            <div className="t3">{usuario.ativo === true ? 'Sim' : 'Não'}</div>
                            <div className="t4">                                
                                <button className="btnExcluir">
                                    <MdDelete size={18} color="#fff" />
                                </button>

                                <button className="btnEditar">
                                    <MdEdit size={18} color="#fff" />
                                </button>
                            </div>
                        </div>
                    )
                })}
                
            </div>
        </div>
    </div>
 );
}