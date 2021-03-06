import React, { useState, useEffect } from 'react';

import DatabaseConnection from '../../database/DatabaseConnection';
import TipoCategoria from '../../util/TipoCategoria';

import './produtos.css';
import Header from '../../components/Header';
import Title from '../../components/Title';

import { Link } from 'react-router-dom';

import { MdSearch, MdAdd, MdDelete, MdEdit } from 'react-icons/md';
import FilesManager from '../../database/FilesManager';

export default function Produtos() {

    const dbProduct = new DatabaseConnection('produtos');
    const dbCategory = new DatabaseConnection('categorias');

    const [ listaProdutos, setListaProdutos ] = useState([]);    
    const [ listaCategorias, setListaCategorias ] = useState([]);
    const [ categoriaSelecionada, setCategoriaSelecionada ] = useState('0');
    const [ loadingLista, setLoadingLista] = useState(true);

    useEffect( async ()=>{
        await loadCategorias();
        await loadProdutos(10, 'nome', 'asc');
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

    async function loadProdutos(numItems = 10, orderByField = 'nome', orderBy = 'asc', whereField = null, whereValue = null){
        setListaProdutos([]);
        let r;
        if(whereField !== null && whereValue !== null){
            console.log(whereField, whereValue);
            r = await dbProduct.getListDocuments(numItems, orderByField, orderBy, whereField, whereValue).then((value)=>{
                console.log(value);
                if(value.length > 0){
                    return value;
                }else{
                    return [];
                }
            });
        }else{
            r = await dbProduct.getListDocuments(numItems, orderByField, orderBy).then((value)=>{
                if(value.length > 0){
                    return value;
                }else{
                    return [];
                }
            });
        }        
        setLoadingLista(false);
        setListaProdutos(r);
    }

    async function buscarProduto(e){
        e.preventDefault();
        if(categoriaSelecionada === '0'){
            alert('Selecione ao menos uma categoria!');
            return;
        }else{
            setLoadingLista(true);            
            await loadProdutos(10, 'nome', 'asc', 'categoria', categoriaSelecionada);
        }
    }

    async function deletarProduto(e, id, nomeImagem){
        if(window.confirm('Deseja mesmo excluir este produto? Esta a????o ?? irrevers??vel!')){           
            await dbProduct.deleteDocument(id).then(async (_)=>{
                setLoadingLista(true);
                const fmProduct = new FilesManager('produtos', '', nomeImagem);
                await fmProduct.deleteDirectory(returnDelete);                
            });
        }
    }

    async function returnDelete(value){
        alert("Excluido!");
        console.log(value);
        if(categoriaSelecionada === '0'){
            await loadProdutos(10, 'nome', 'asc');
        }else{
            await loadProdutos(10, 'nome', 'asc', 'categoria', categoriaSelecionada);
        }

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

                <div className='filtroProduto'>
                    <form name="filtroProd" method="post" onSubmit={(e)=>buscarProduto(e)}>                        
                        <select name="categoria" className="inputSelect" value={categoriaSelecionada} onChange={(e)=>setCategoriaSelecionada(e.target.value)}>
                            <option value="0">-- Selecione uma categoria</option>
                            {listaCategorias.map((categoria, index)=>{
                                return(
                                    <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
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
                        Pre??o
                    </div>
                    <div className="blocoTituloLista t4">
                        Estoque
                    </div>
                    <div className="blocoTituloLista t5">
                        A????es
                    </div>
                </div>
                { loadingLista && (<div>Carregando Lista...</div>)}

                <div className={loadingLista === true ? `hide` : ``}>
                {listaProdutos.length === 0 ? (
                    <div>Nenehum item encontrado!</div>
                ) 
                : 
                listaProdutos.map((produto, index) => {   
                    
                    let i;
                    let categoria = '';
                    for(i = 0; i < listaCategorias.length; i++){
                        if(listaCategorias[i].id === produto.categoria){
                            categoria = listaCategorias[i].nome;
                            break;
                        }else{
                            categoria = '';
                        }
                    }

                    
                    let precoDesconto;
                    let precoFinal;
                    if(produto.desconto > 0){
                        precoDesconto = (parseFloat(produto.preco) / 100) * produto.desconto;
                        precoFinal = (parseFloat(produto.preco - precoDesconto)).toFixed(2);
                    }else{
                        precoFinal = '0.00';
                    }
                    return(
                        <div className={index%2 === 0 ? `bgListaItem itemLista` : `itemLista`} key={index}>
                            <div className="t0">
                                <img src={produto.imagem} alt={produto.nome} className="produtoImagem" />
                            </div>
                            <div className="t1">
                                {produto.nome}<br/>
                                {produto.exibirProduto === false ? (<small>(Produto inativo para vendas)</small>): ``}
                            </div>
                            <div className="t2">{categoria}</div>
                            <div className="t3">
                                {produto.desconto > 0 ? (
                                    <span>
                                        <s>R$ {produto.preco}</s><br/>
                                        R$ {precoFinal}
                                    </span>
                                ) : (
                                    <span>R$ {produto.preco}</span>                                    
                                )}
                                
                            </div>
                            <div className="t4">
                                {produto.possuiEstoque === true ? (
                                    <div>{produto.qtdEstoque}</div>
                                ) : (
                                    <div>N??o possui estoque</div>
                                )}
                            </div>
                            <div className="t5">  
                            
                                <Link className="btnExcluir" to={`#`} onClick={e=>deletarProduto(e, produto.id, produto.nomeImagem)}>
                                    <MdDelete size={18} color="#fff" />
                                </Link>
                                <Link className="btnEditar" to={`/form-produtos/${produto.id}`}>
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