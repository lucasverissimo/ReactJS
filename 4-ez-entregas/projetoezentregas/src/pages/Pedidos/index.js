import React, { useState, useEffect } from 'react';

import { format, getTime } from 'date-fns';

import firebase from '../../services/firebaseConfig';

import DatabaseConnection from '../../database/DatabaseConnection';
import AndamentoPedido from '../../util/AndamentoPedido';

import './pedidos.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import Modal from '../../components/Modal';

import { Link } from 'react-router-dom';

import { MdSearch, MdAdd, MdDelete, MdEdit } from 'react-icons/md';

export default function Pedidos() {

    const pedidos = new DatabaseConnection('pedidos');

    const [ listaPedidos, setListaPedidos ] = useState([]);
    const [ dataPedidos, setDataPedidos ]  = useState('');
    const [ andamentoPedido, setAndamentoPedido ] = useState('0');
    const [ loadingLista, setLoadingLista] = useState(true);
    const [ modalAberto, setModalAberto ] = useState(false);
    const [ dadosPedidoModal, setDadosPedidoModal ] = useState([]);

    useEffect( async ()=>{
       await loadPedidos();
    }, []);

    useEffect(() => {
        return () => {

            console.log("cleaned up");
        };
    }, []);

    async function loadPedidos(num = 10, orderByField = 'data', orderByValue = 'DESC', whereFields = null, whereValue = null){
        setLoadingLista(true);
        let r = await pedidos.getListDocuments(num, orderByField, orderByValue, whereFields, whereValue).then((value)=>{            
            if(value.length > 0){
                return value;
            }else{
                return [];
            }            
        });

        setLoadingLista(false);
        setListaPedidos(r);
    }

    async function filtrarPedidos(e){
        e.preventDefault();

        
        let data =  '';
        let field = null;
        let value = null;        

        if(dataPedidos !== '' && andamentoPedido !== '0'){
            field = ['data', 'andamento'];
            value = [];
            let dataArr = dataPedidos.split('-'); // aqui a data vem algo como 2021-07/20   
            data = dataArr[2]+'/'+dataArr[1]+'/'+dataArr[0];
            value[0] = data;
            value[1] = andamentoPedido;
        }else{
            if(dataPedidos === '' && andamentoPedido === '0'){
                console.log('nenhum dado para filtrar');
                return;
            }else{
               if(dataPedidos !== ''){
                    let dataArr = dataPedidos.split('-'); // aqui a data vem algo como 2021-07/20   
                    data = dataArr[2]+'/'+dataArr[1]+'/'+dataArr[0];
                    field = 'data';
                    value = data;
               }                
               if(andamentoPedido !== '0'){
                    field = 'andamento';
                    value = andamentoPedido;
               } 
            }           
        }

        console.log(field);
        console.log(value);
        
        await loadPedidos(10, 'numero', 'desc', field, value); // aqui chamo minha classe que faz a busca e retorna a lista

    }

    function calcPrecoTotal(produtos, produtoCom = false){
       
        let i = 0;
        let Preco = 0.0;
        for(i = 0; i < produtos.length; i++){
            
            let prod = produtos[i];
            let PrecoComplementar = 0.0;

            if(produtoCom === false){

                if(prod.produtosComplementares.length === 0){
                    PrecoComplementar = 0.0;
                }else{
                    PrecoComplementar = calcPrecoTotal(prod.produtosComplementares, true);
                } 

            }

            Preco = parseFloat(prod.preco) + Preco + PrecoComplementar;

        }
        return Preco;
    }

    function abrirModal(e, pedido){
        e.preventDefault();
        setDadosPedidoModal(pedido);
        setModalAberto(true);
    }

    function closeModal(e, close){
        if(close){
            setModalAberto(false);
            setDadosPedidoModal([]);
        }
    }
    
 return (     
    <div className="container-principal">
        <Header />
        <div className="container-conteudo container-usuarios">
            <Title>
                <h1>Pedidos - Lista de cadastrados</h1>
            </Title>            
            <div className="ListaUsuarios ListaProdutos">

                <div className='filtroProduto'>
                    <form name="filtroProd" method="post" onSubmit={(e)=>filtrarPedidos(e)}> 
                        Data do pedido: <input type="date" name="data" className="inputText" placeholder="Data do pedido" onChange={(e)=>setDataPedidos(e.target.value)} />                      
                        <select name="categoria" className="inputSelect" value={andamentoPedido} onChange={(e)=>setAndamentoPedido(e.target.value)}>
                            <option value="0">-- Andamento do pedido</option>     
                            <option value={AndamentoPedido.Aguardando}>{AndamentoPedido.Aguardando}</option>
                            <option value={AndamentoPedido.EmPreparo}>{AndamentoPedido.EmPreparo}</option>
                            <option value={AndamentoPedido.Viagem}>{AndamentoPedido.Viagem}</option>
                            <option value={AndamentoPedido.Entregue}>{AndamentoPedido.Entregue}</option>
                            <option value={AndamentoPedido.Cancelado}>{AndamentoPedido.Cancelado}</option>
                        </select>
                        <button type="submit" className="btnBuscar">
                            <MdSearch size={25} coolr="#fff"/> Buscar
                        </button>
                    </form>
                </div>

                <div className={`tituloLista ${listaPedidos.length === 0 ? `hide`: ``}`}>
                    <div className="blocoTituloLista t0">
                        Data
                    </div>
                    <div className="blocoTituloLista t1">
                        Cliente
                    </div>
                    <div className="blocoTituloLista t2">
                        Andamento
                    </div>
                    <div className="blocoTituloLista t3">
                        Total
                    </div>
                    <div className="blocoTituloLista t4">
                        Endereço
                    </div>
                    <div className="blocoTituloLista t5">
                        Ações
                    </div>
                </div>
                { loadingLista && (<div>Carregando Lista...</div>)}

                <div className={loadingLista === true ? `hide` : ``}>
                {listaPedidos.length === 0 ? (
                    <div>Nenehum item encontrado!</div>
                ) 
                : 
                listaPedidos.map((pedido, index) => {    

                    let precoTotalPedido = calcPrecoTotal(pedido.produtos);
                   
                    return(
                        <div className={index%2 === 0 ? `bgListaItem itemLista` : `itemLista`} key={index}>
                            <div className="t0">
                            {pedido.data}<br/><small>{pedido.hora}</small>
                            </div>
                            <div className="t1">
                                {pedido.nomeCliente}<br/>                                
                            </div>
                            <div className="t2">{pedido.andamento}</div>
                            <div className="t3">
                               R$ {precoTotalPedido.toFixed(2)}
                            </div>
                            <div className="t4">
                                {pedido.endereco.rua}, {pedido.endereco.numero}<br/>
                                {pedido.endereco.bairro} - {pedido.endereco.cep}
                            </div>
                            <div className="t5">                            
                                <Link className="btnEditar" to={`#`} onClick={(e)=>abrirModal(e, pedido)}>
                                    <MdEdit size={18} color="#fff" />
                                </Link>
                            </div>
                        </div>
                    )
                })}

                </div>
            </div>
        </div>
        { modalAberto === true && (
            <Modal data={dadosPedidoModal} closeModal={closeModal} />           
        )}
    </div>
 );
}