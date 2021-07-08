import React, { useState, useEffect } from 'react';

import DatabaseConnection from '../../database/DatabaseConnection';
import TipoCategoria from '../../util/TipoCategoria';

import './produtos.css';
import Header from '../../components/Header';
import Title from '../../components/Title';

import { Link } from 'react-router-dom';

import { MdSearch, MdAdd, MdDelete, MdEdit } from 'react-icons/md';

export default function Produtos() {

    const dbProduct = new DatabaseConnection('produtos');
    const dbCategory = new DatabaseConnection('categorias');

    const [ listaProdutos, setListaProdutos ] = useState([
        {id: 1, nome: 'Produto teste 1', imagem: 'https://i.ytimg.com/vi/FrdumyhYaZY/maxresdefault.jpg', possuiEstoque: true, estoque: 10, preco: 24.99},
        {id: 2, nome: 'Produto teste 2', imagem: 'https://i.ytimg.com/vi/FrdumyhYaZY/maxresdefault.jpg', possuiEstoque: false, estoque: 10, preco: 14.99},
        {id: 3, nome: 'Produto teste 3', imagem: 'https://i.ytimg.com/vi/FrdumyhYaZY/maxresdefault.jpg', possuiEstoque: false, estoque: 10, preco: 22.99},
        {id: 4, nome: 'Produto teste 4', imagem: 'https://i.ytimg.com/vi/FrdumyhYaZY/maxresdefault.jpg', possuiEstoque: false, estoque: 10, preco: 29.99},
        {id: 5, nome: 'Produto teste 5', imagem: 'https://i.ytimg.com/vi/FrdumyhYaZY/maxresdefault.jpg', possuiEstoque: true, estoque: 10, preco: 34.99},
        {id: 6, nome: 'Produto teste 6', imagem: 'https://i.ytimg.com/vi/FrdumyhYaZY/maxresdefault.jpg', possuiEstoque: true, estoque: 10, preco: 4.99},
        {id: 7, nome: 'Produto teste 7', imagem: 'https://i.ytimg.com/vi/FrdumyhYaZY/maxresdefault.jpg', possuiEstoque: false, estoque: 10, preco: 54.99},
        {id: 8, nome: 'Produto teste 8', imagem: 'https://i.ytimg.com/vi/FrdumyhYaZY/maxresdefault.jpg', possuiEstoque: true, estoque: 10, preco: 14.99},
        {id: 9, nome: 'Produto teste 9', imagem: 'https://i.ytimg.com/vi/FrdumyhYaZY/maxresdefault.jpg', possuiEstoque: false, estoque: 10, preco: 24.99},
        {id: 10, nome: 'Produto teste 10', imagem: 'https://i.ytimg.com/vi/FrdumyhYaZY/maxresdefault.jpg', possuiEstoque: false, estoque: 10, preco: 14.99},
    ]);

    const [ nomeProduto, setNomeProduto ] = useState('');
    const [ listaCategorias, setListaCategorias ] = useState([]);
    const [ categoriaSelecionada, setCategoriaSelecionada ] = useState('');
    const [ loadingLista, setLoadingLista] = useState(false);

    useEffect( async ()=>{
        await loadCategorias();
    }, []);

    useEffect(() => {
        return () => {
            setListaProdutos([]);
            setListaCategorias([]);
            console.log("cleaned up");
        };
    }, []);

    async function loadCategorias(){
        setListaCategorias([]);
        let r = await dbCategory.getListDocuments(100, 'nome', 'asc', 'tipo', TipoCategoria.CategoriaPrincipal).then((value)=>{
            
            if(value.length > 0){
                return value;
            }else{
                return [];
            }
        });

        setListaCategorias(r);
    }

    function buscarProduto(e){
        e.preventDefault();
        
    }

    function deletarProduto(id){

    }
 return (     
    <div className="container-principal">
        <Header />
        <div className="container-conteudo container-usuarios">
            <Title>
                <h1>Produtos - Lista de cadastrados</h1>
                <div className="group-btn-title">
                    <Link to='/form-produtos'>
                        <MdAdd size={32} color="#FFF" />
                    </Link>
                </div>
            </Title>            
            <div className="ListaUsuarios ListaProdutos">

                <div className={`filtroProduto ${listaProdutos.length === 0 ? `hide`: ``}`}>
                    <form name="filtroProd" method="post" onSubmit={(e)=>buscarProduto(e)}>
                        <input type="text" className="inputText" name="nome" value={nomeProduto} onChange={(e)=>setNomeProduto(e.target.value)} placeholder="Nome do produto..."/>
                        <select name="categoria" className="inputSelect" value={categoriaSelecionada} onChange={(e)=>setCategoriaSelecionada(e.target.value)}>
                            <option value="0">-- Selecione uma categoria</option>
                            {listaCategorias.map((categoria, index)=>{
                                return(
                                    <option key={categoria.id}>{categoria.nome}</option>
                                )
                            })}
                        </select>
                        <button type="submit" className="btnBuscar">
                            <MdSearch size={25} coolr="#fff"/> Buscar
                        </button>
                    </form>
                </div>

                <div className={`tituloLista ${listaProdutos.length === 0 ? `hide`: ``}`}>
                    <div className="blocoTituloLista t0">
                        Imagem
                    </div>
                    <div className="blocoTituloLista t1">
                        Nome
                    </div>
                    <div className="blocoTituloLista t2">
                        Categoria
                    </div>
                    <div className="blocoTituloLista t3">
                        Preço
                    </div>
                    <div className="blocoTituloLista t4">
                        Estoque
                    </div>
                    <div className="blocoTituloLista t5">
                        Ações
                    </div>
                </div>
                { loadingLista && (<div>Carregando Lista...</div>)}

                <div className={loadingLista === true ? `hide` : ``}>
                {listaProdutos.length === 0 ? (
                    <div>Nenehum item encontrado!</div>
                ) 
                : 
                listaProdutos.map((produto, index) => {         
                    return(
                        <div className={index%2 === 0 ? `bgListaItem itemLista` : `itemLista`} key={index}>
                            <div className="t0">
                                <img src={produto.imagem} alt={produto.nome} className="produtoImagem" />
                            </div>
                            <div className="t1">{produto.nome}</div>
                            <div className="t2">{produto.categoria} Categoria teste</div>
                            <div className="t3">
                                {produto.preco}
                            </div>
                            <div className="t4">
                                {produto.estoque}
                            </div>
                            <div className="t5">  
                            
                                <Link className="btnExcluir" to={`#`} onClick={e=>deletarProduto(e, produto.id)}>
                                    <MdDelete size={18} color="#fff" />
                                </Link>
                                <Link className="btnEditar" to={`/form-produto/${produto.id}`}>
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