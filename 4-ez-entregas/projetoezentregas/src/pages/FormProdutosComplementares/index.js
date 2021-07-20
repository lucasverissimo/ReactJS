import React, { useState, useEffect } from 'react';

import DatabaseConnection from '../../database/DatabaseConnection';

import CurrencyInput from 'react-currency-input-field'

import TipoCategoria from '../../util/TipoCategoria';

import { Link, useParams, useHistory } from 'react-router-dom';

import Header from '../../components/Header';
import Title from '../../components/Title';

import { MdKeyboardBackspace } from 'react-icons/md';

import FilesManager from '../../database/FilesManager';

export default function FormProdutosComplementares() {

    const dbCategory = new DatabaseConnection('categorias');
    const dbProd = new DatabaseConnection('produtosComplementares');    

    const { id } = useParams();
    const history = useHistory();

    const [ editando, setEditando ] = useState(false);
    const [ loadingCad, setLoadingCad ] = useState(false);
    const [ nome, setNome ] = useState('');
    const [ descricao, setDescricao ] = useState('');
    const [ categoriaSelecionada, setCategoriaSelecionada ] = useState('0');
    const [ listaCategorias, setListaCategorias ] = useState([]);
    const [ preco, setPreco ] = useState('');
    const [ exibirProduto, setExibirProduto ] = useState(true);

    useEffect( async ()=>{        
        async function loadProduto(){
            setEditando(true);
            await dbProd.getDocument(id).then((value)=>{
                console.log(value);
                if(typeof value === 'undefined'){
                    alert('Erro ao localizar dado na base de dados, retornando para listagem...');
                    history.push('/produtos');
                    return;
                }
                setNome(value.nome);
                setDescricao(value.descricao);
                setExibirProduto(value.exibirProduto);
                setPreco(value.preco);
                setCategoriaSelecionada(value.categoria);

            });
        }

        await loadCategorias(TipoCategoria.CategoriaComplementar).then( async ()=>{            
            if(id){
                loadProduto();
            }
        }); 

    }, []);

    useEffect(() => {
        return () => {
            setListaCategorias([]);            
            console.log("cleaned up");
        };
    }, []);

    async function loadCategorias(tipoCategoria){
        
        let r = await dbCategory.getListDocuments(100, 'nome', 'asc', 'tipo', tipoCategoria).then((value)=>{
            
            if(value.length > 0){
                return value;
            }else{
                return [];
            }
        });
        setListaCategorias([]);
        setListaCategorias(r);
        
    }


    async function submitForm(e){
        e.preventDefault();
        // console.log(parseFloat(preco).toFixed(2));

        if(nome.length < 3){
            alert("Preencha o campo nome!");
            return;
        }else
        if(categoriaSelecionada === '0'){
            alert("Selecione uma categoria para o produto!");
            return;
        }else{

            setLoadingCad(true);

            let p;
            if(preco.length === 0){
                p = '0.00';
            }else{
                p = parseFloat(preco).toFixed(2);
            }
            
            let data = {
                nome: nome,
                descricao: descricao,
                categoria: categoriaSelecionada,
                preco: p,
                exibirProduto: exibirProduto,
            };
            
            if(editando === false){

                await dbProd.newDocument(data).then( async (value)=>{
                    
                    if(value !== false){
                        alert("Cadastrado com sucesso!");
                        setNome('');
                        setPreco('');
                        setCategoriaSelecionada('0');
                        setDescricao('');
                        setExibirProduto(true);
                    }else{
                        alert("Erro ao cadastrar, consulte o log de erros!");                        
                    }
                    setLoadingCad(false);
                });
            }else{
                data = {
                    ...data,
                    id: id,
                }
                await dbProd.updateDocument(data).then((value)=>{
                    
                    if(value === true){
                        alert("Atualizado com sucesso!");
                    }else{
                        alert("Erro ao atualizar, verifique o log de erros!");
                        console.log(value);
                    }
                });
                setLoadingCad(false);
            }

        }
        
    }


 return (
     
    <div className="container-principal">
        <Header />
        <div className="container-conteudo container-dashboard">
            <Title>
                <Link to="/produtos-complementares">
                    <MdKeyboardBackspace size={28} color="#fff" />
                </Link>
                <h1>Produtos Complementares - {editando ? `Editar produto` : `Cadastrar produto`}</h1>             
            </Title>
    
        <div className="ContainerConteudo">
            <p>Preencha abaixo com os dados do produto complementar:</p>
            <form name="formCadProduto" onSubmit={submitForm}>
                <div className="form-group">
                    <div className="form-input">
                        <label>Nome:</label>
                        <input type="text" name="nome" placeholder="Preencha o campo nome..." className="inputText" value={nome} onChange={e=>setNome(e.target.value)} />
                    </div>
                    <div className="form-input">
                        <label>Categoria</label>
                        <select name="ativo" className="inputSelect" value={categoriaSelecionada} onChange={e=>setCategoriaSelecionada(e.target.value)} >
                            <option value="0">-- Selecione uma opção</option>
                            {listaCategorias.map((categoria, index)=>{
                                return(
                                    <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
                                )
                            })}
                        </select>
                    </div>

                    <div className="form-input">
                        <label>Descrição:</label>
                        <textarea type="text" name="descricao" placeholder="Preencha o campo descrição..." className="textAreaInput" value={descricao} onChange={e=>setDescricao(e.target.value)}></textarea>
                    </div>

                    <div className="form-input">
                        <label>Preço:</label>
                        <CurrencyInput                            
                            name="preco"
                            placeholder="Digite o preço, ex: 25.00"
                            defaultValue={1000}
                            decimalsLimit={2}
                            value={preco}
                            prefix="R$ "
                            decimalSeparator="."
                            groupSeparator=","
                            maxLength={6}
                            className="inputText"
                            onValueChange={(value, name) => setPreco(value)}
                        />
                    </div>

                    <div>
                        <label>
                            <input type="checkbox" name="exibirProduto" checked={exibirProduto} onChange={e => setExibirProduto(e.target.checked)} /> Este produto complementar esta ativo para ser exibido.
                        </label>
                    </div>

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