import React, { useEffect, useState } from 'react';

import './usuarios.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { Link } from 'react-router-dom';
import DatabaseConnection from '../../database/DatabaseConnection';
import { MdAdd, MdDelete, MdEdit } from 'react-icons/md';

export default function Usuarios() {

    const db = new DatabaseConnection('usuarios');
    const [ listaUsuarios, setListaUsuarios ] = useState([]);
    const [ loadingLista, setLoadingLista ] = useState(true);

    useEffect(()=>{
        db.getListDocuments().then((result)=>{
            setListaUsuarios(result);             
            setLoadingLista(false);           
        }).catch((error)=>{
            alert("Erro ao realizar consulta!");
            console.log(error);
        });        
    }, []);

    useEffect(() => {
        return () => {
          setListaUsuarios([]);
          console.log("cleaned up");
        };
      }, []);

    

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
                { loadingLista && (<div>Carregando Lista...</div>)}

                <div className={loadingLista === true ? `hide` : ``}>
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
                                <Link className="btnEditar" to={`/form-usuarios/${usuario.id}`}>
                                    <MdEdit size={18} color="#fff" />
                                </Link>
                            </div>
                        </div>
                    )
                })}

                </div>
            </div>
        </div>
    </div>
 );
}