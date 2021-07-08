import React, { useEffect, useState } from 'react';

import DatabaseConnection from '../../database/DatabaseConnection';

import { Link } from 'react-router-dom';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import Header from '../../components/Header';
import Title from '../../components/Title';

import './categorias.css';

export default function Categorias() {

    const db = new DatabaseConnection('categorias');

    const [ listaCategorias, setListaCategorias ] = useState([]);
    const [ loadingLista, setLoadingLista ] = useState(true);

    useEffect(async ()=>{
        await loadList();
    }, []);

    useEffect(() => {
        return () => {
            setListaCategorias([]);
            console.log("cleaned up");
        };
    }, []);

    
    async function loadList(){
        setListaCategorias([]);
        let r = await db.getListDocuments(5, 'nome', 'asc').then((value)=>{
            // console.log(value);
            if(value.length > 0){
                return value;
            }else{
                return [];
            }
        });

        setListaCategorias(r);
        setLoadingLista(false);
    }

    async function deletarCategoria(e, id){
        e.preventDefault();
        setLoadingLista(true);
        if(window.confirm('Deseja mesmo fazer isto?')){           

            await db.deleteDocument(id).then( async (value)=>{
                
                if(value === true){
                    
                    alert('Deletado!');
                    await loadList();
                }
                
            });
        }
    }

    return (
        <div className="container-principal">
            <Header />
            <div className="container-conteudo container-usuarios">
                <Title>
                    <h1>Categorias - Lista de cadastrados</h1>
                    <div className="group-btn-title">
                        <Link to='/form-categorias'>
                            <MdAdd size={32} color="#FFF" />
                        </Link>
                    </div>
                </Title>
    
                <div className="ListaUsuarios">
                    <div className={`tituloLista ${listaCategorias.length === 0 ? `hide`: ``}`}>
                        <div className="blocoTituloLista t1">
                            Nome
                        </div>
                        <div className="blocoTituloLista t2">
                            Tipo
                        </div>
                        <div className="blocoTituloLista t3">
                            Onde exibe?
                        </div>
                        <div className="blocoTituloLista t4">
                            Ações
                        </div>
                    </div>
                    { loadingLista && (<div>Carregando Lista...</div>)}
    
                    <div className={loadingLista === true ? `hide` : ``}>
                    {listaCategorias.length === 0 ? (
                        <div>Nenehum item encontrado!</div>
                    ) 
                    : 
                    listaCategorias.map((categoria, index) => {         
                        return(
                            <div className={index%2 === 0 ? `bgListaItem itemLista` : `itemLista`} key={index}>
                                <div className="t1">{categoria.nome}</div>
                                <div className="t2">{categoria.tipo}</div>
                                <div className="t3">
                                    <p className={categoria.exibirHome === true ? ``: `hide`}>
                                        Home
                                    </p>
                                    <p className={categoria.exibirMenu === true ? ``: `hide`}>
                                        Menu
                                    </p>
                                    <div className={categoria.tipo === 'Complementar' ? 'hide' : ''}>
                                    <p className={categoria.exibirMenu === false && categoria.exibirHome === false ? '' : 'hide'}>
                                        Oculto
                                    </p>
                                    </div>
                                    <p className={categoria.tipo === 'Complementar' ? '' : 'hide'}>
                                        Dentro do produto
                                    </p>
                                </div>
                                <div className="t4">  
                                  
                                    <Link className="btnExcluir" to={`#`} onClick={e=>deletarCategoria(e, categoria.id)}>
                                        <MdDelete size={18} color="#fff" />
                                    </Link>
                                    <Link className="btnEditar" to={`/form-categorias/${categoria.id}`}>
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