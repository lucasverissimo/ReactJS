import React, { useState, useEffect } from 'react';

import AndamentoPedido from '../../util/AndamentoPedido';

import './modal.css';
import { MdClose, MdRefresh } from 'react-icons/md';
export default function Modal({data, closeModal}) {

    console.log(data);

    const [ situacaoPedido, alterarSituacaoPedido] = useState(data.andamento);


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

    return (
        <div className="fundoModal">
            <div className="modalComp">
                <div className="modalHeader">
                    <h2># Pedido {data.numero}</h2>
                    <MdClose className="btnClose" onClick={(e)=>closeModal(e, true)} size={35} color="#000"/>
                </div>
                <div className="modalContent">
                    <div className="infoModalContent">
                        <h3>Informações da venda</h3>
                        <div className="Linha">
                            <div className="infoVenda">
                                Cliente: {data.nomeCliente}
                            </div>
                            <div className="infoVenda">
                                Data: {data.data} - {data.hora}
                            </div>
                        </div>
                    </div>
                    <div className="infoModalContent">
                    <h3>Informações da entrega</h3>
                        <div className="Linha">
                            <div className="infoVenda">
                                Logradouro: {data.endereco.rua}
                            </div>
                            <div className="infoVenda">
                                Número: {data.endereco.numero}
                            </div>                            
                            <div className="infoVenda">
                                Bairro: {data.endereco.bairro}
                            </div>                                                        
                            <div className="infoVenda">
                                Cidade: {data.endereco.cidade}
                            </div>                                                                                    
                            <div className="infoVenda">
                                CEP: {data.endereco.cep}
                            </div>
                                                                                                                
                            <div className="infoVenda">
                                Complemento: {data.endereco.complemento}
                            </div>
                        </div>
                    </div>
                    <div className="infoModalContent">
                        <div className="Linha">
                            <select name="situacao" value={situacaoPedido} className="inputSelect" onChange={(e)=>alterarSituacaoPedido(e.target.value)}>
                                <option value={AndamentoPedido.Aguardando}>{AndamentoPedido.Aguardando}</option>
                                <option value={AndamentoPedido.EmPreparo}>{AndamentoPedido.EmPreparo}</option>
                                <option value={AndamentoPedido.Viagem}>{AndamentoPedido.Viagem}</option>
                                <option value={AndamentoPedido.Entregue}>{AndamentoPedido.Entregue}</option>
                                <option value={AndamentoPedido.Cancelado}>{AndamentoPedido.Cancelado}</option>
                            </select>

                            <button type="submit" className={
                                situacaoPedido === AndamentoPedido.Cancelado ||  situacaoPedido === AndamentoPedido.Entregue
                                ? `btnCommon btnBlock` 
                                : `btnCommon btnAtualizar`}>
                                <MdRefresh size={25} color="#fff" />
                                Atualizar pedido
                            </button>
                        </div>
                    </div>
                    <div className="infoModalPedido">
                        <h3>Informações do pedido</h3>
                        <div className="titulo infoPedido">
                            <div className="b b1">
                                Produto
                            </div>
                            <div className="b b2">
                                Prod. Complementar
                            </div>
                            <div className="b b3">
                                Quantidade
                            </div>
                            <div className="b b4">
                                Preço
                            </div>
                        </div>
                        {data.produtos.map((produto, index)=>{

                            let precoFinal = 0.0;

                            if(typeof produto.produtosComplementares === 'object'){
                                if(produto.produtosComplementares.length > 0){
                                    let i = 0;
                                    for(i = 0; i < produto.produtosComplementares.length; i++){
                                        precoFinal = precoFinal + parseFloat(produto.produtosComplementares[i].preco);
                                    }
                                }
                            }

                            precoFinal = parseFloat(produto.preco) + precoFinal;
                            

                            return(
                                <div className="conteudo infoPedido" key={index}>
                                    <div className="b b1">
                                        {produto.nome}<br/>
                                        <small>R$ {produto.preco}</small>
                                    </div>
                                    <div className="b b2">
                                        {produto.produtosComplementares.map((comp, ind)=>{
                                            return(
                                                <small key={ind}>
                                                    {comp.nome}
                                                    {comp.preco !== '0.00' && ` - R$ ${comp.preco}`}
                                                </small>
                                            );
                                        })}
                                    </div>
                                    <div className="b b3">
                                        {produto.quantidade}
                                    </div>
                                    <div className="b b4">
                                        R$ {precoFinal}
                                    </div>
                                </div>
                            );
                        })}

                    </div>
                    <div className="infoTotalPedido">
                        <div className="blocoinftotalped">
                            <div className="linhaInfo">Frete: R$ { data.frete }</div>
                            <div className="linhaInfo">Pedido: R$ { calcPrecoTotal(data.produtos) }</div>
                            <div className="totalFinal">
                                Total: R$ {
                                    (parseFloat(data.frete) + parseFloat(calcPrecoTotal(data.produtos))).toFixed(2)
                                }
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>                
        </div>        
    );
}