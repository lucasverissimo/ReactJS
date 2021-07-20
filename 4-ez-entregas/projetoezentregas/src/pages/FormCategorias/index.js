import React, { useState, useEffect } from 'react';

import DatabaseConnection from '../../database/DatabaseConnection';

import TipoCategoria from '../../util/TipoCategoria';

import Header from '../../components/Header';
import Title from '../../components/Title';

import { MdKeyboardBackspace } from 'react-icons/md';
import { Link, useParams, useHistory } from 'react-router-dom';
import './formCategorias.css';

export default function FormCategorias() {

    const db = new DatabaseConnection('categorias');
    const { id } = useParams();
    const history = useHistory();

    const [ nome, setNome ] = useState('');
    const [ tipo, setTipo ] = useState('0');
    const [ ordem, setOrdem ] = useState(0);
    const [ exibirHome, setExibirHome ] = useState(false);
    const [ exibirMenu, setExibirMenu ] = useState(false);
    const [ loadingCad, setLoadingCad ] = useState(false);
    const [ editando, setEditando ] = useState(false);
    const [ tipoSelecaoProduto, setTipoSelecaoProduto ] = useState(null);

    useEffect(async ()=>{
        if(id){            
            setEditando(true);
            await db.getDocument(id).then((value)=>{                
                if(value === 'undefined'){
                    alert('Erro ao localizar dado na base de dados, retornando para listagem...');
                    history.push('/categorias');
                    return;
                }

                setNome(value.nome);
                setTipo(value.tipo);
                setOrdem(value.ordem);
                setExibirHome(value.exibirHome);
                setExibirMenu(value.exibirMenu);
                setTipoSelecaoProduto(value.tipoSelecaoProduto);

            });
        }
    },[]);

    async function submitForm(e){
        e.preventDefault();

        if(nome.length < 3){
            alert("Preencha o campo nome corretamente!");
            return;
        }else
        if(tipo === '0'){
            alert("Selecione um tipo de categoria!");
            return;
        }else
        if(typeof parseInt(ordem) !== 'number'){
            alert("O campo ordem deve ser apenas numérico");
            return;
        }else{

            setLoadingCad(true);

            if(tipo === TipoCategoria.CategoriaComplementar){
                setExibirHome(false);
                setExibirMenu(false);

                if(tipoSelecaoProduto === null){
                    alert('Selecione um tipo de seleção de produtos!');
                    return;
                }
            }else{
                setTipoSelecaoProduto(null);
            }

            let data = {
                nome: nome,
                tipo: tipo,
                ordem: parseInt(ordem),
                exibirHome: exibirHome,
                exibirMenu: exibirMenu,
                tipoSelecaoProduto: tipoSelecaoProduto
            }
            
            if(editando === true){
                data = {
                    ...data,
                    id: id,
                }
                await db.updateDocument(data).then((value)=>{
                    if(value === true){
                        alert("Editado com sucesso!");
                    }else{
                        alert("Erro ao editar, verifique o log de erros!");
                        console.log(value);
                    }
                    setLoadingCad(false);
                });
            }else{
                await db.newDocument(data).then((value) => {
                    if(value !== false){
                        alert("Cadastrado com sucesso!");
                        setNome('');
                        setTipo('');
                        setOrdem('0');
                        setExibirMenu(false);
                        setExibirHome(false);
                    }else{
                        alert("Erro ao cadastrar, consulte o log de erros!");
                        console.log(value);
                    }
                    setLoadingCad(false);
                });
            }
            
           

            setLoadingCad(false);

        }
    }

    function mudarTipo(e){
        setTipo(e.target.value);
        setExibirMenu(false);
        setExibirHome(false);
        if(e.target.value === TipoCategoria.CategoriaPrincipal){
            setTipoSelecaoProduto(null);
        }
    }

    return (
        <div className="container-principal">
            <Header />
            <div className="container-conteudo container-dashboard">
                <Title>
                <h1>
                    <Link to="/categorias">
                        <MdKeyboardBackspace size={28} color="#fff" />
                    </Link>
                    Categorias - {editando ? `Editar categoria` : `Cadastrar categoria`}
                </h1>             
                </Title>
            
            <div className="ContainerConteudo">
                <p>Preencha abaixo com os dados do usuário:</p>
                <form name="formCadUsuario" onSubmit={submitForm}>
                    <div className="form-group">
                        <div className="form-input">
                            <label>Nome:</label>
                            <input type="text" name="nome" placeholder="Preencha o campo nome..." className="inputText" value={nome} onChange={e=>setNome(e.target.value)} />
                        </div>

                        <div className="form-input">
                            <label>Tipo de categoria</label>
                            <select name="ativo" className="inputSelect" value={tipo} onChange={e=>mudarTipo(e)} >
                                <option value="0">-- Selecione uma opção</option>
                                <option value={TipoCategoria.CategoriaPrincipal}>{TipoCategoria.CategoriaPrincipal}</option>
                                <option value={TipoCategoria.CategoriaComplementar}>{TipoCategoria.CategoriaComplementar}</option>
                            </select><br/>
                            <small className={tipo !== TipoCategoria.CategoriaComplementar ? `hide` : ``}>
                                Categorias complementares exibem apenas dentro do produto, para separar os produtos complementares.
                            </small>
                        </div> 

                        <div className="form-input">
                            <label>Ordem de exibição:</label>
                            <input type="number" name="ordem" placeholder="Número da ordenação de exibição..." className="inputText" value={ordem} onChange={e=>setOrdem(e.target.value)} />
                        </div>  

                        {tipo !== TipoCategoria.CategoriaPrincipal ? (
                            <div className={tipo !== TipoCategoria.CategoriaComplementar ? `hide` : ``}>
                                <p>A categoria será exibida dentro do produto.</p>
                                <div className="form-input">
                                    <label>Selecione o tipo de seleção de produtos:</label>
                                    <label>
                                        <input type="radio" checked={tipoSelecaoProduto === 'radio'} name="tipoSelecaoProd" value="radio" onChange={(e)=>setTipoSelecaoProduto(e.target.value)}/> Só poderá selecionar uma unica opção no grupo.<br/>
                                    </label>
                                    <label>
                                        <input type="radio" checked={tipoSelecaoProduto === 'checkbox'} name="tipoSelecaoProd" value="checkbox" onChange={(e)=>setTipoSelecaoProduto(e.target.value)} /> Poderá selecionar multiplos produtos no grupo.<br/>
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p>Selecione onde a categoria deve ser exibida:</p>
                                <label>
                                    <input type="checkbox" name="exibirHome" checked={exibirHome} onChange={e => {setExibirHome(e.target.checked)}} /> Exibir na Home.
                                </label><br/>
                                <label>
                                    <input type="checkbox" name="exibirMenu" checked={exibirMenu} onChange={e => setExibirMenu(e.target.checked)} /> Exibir no Menu.
                                </label>
                            </div>  
                        )}
                          

                        <div className="form-input">
                            {loadingCad === true ? (
                                <p>Realizando operação, aguarde...</p>
                            ) : (
                                <input type="submit" className="btn btnSuccess" value= {editando === false ? `Cadastrar` : `Salvar alterações`} />
                            )}                            
                        </div>
                    </div>
                </form>
            </div>
            </div>
        </div>
    );
}