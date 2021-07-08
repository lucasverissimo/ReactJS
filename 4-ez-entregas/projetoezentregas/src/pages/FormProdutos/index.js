import React, { useState, useEffect } from 'react';

import DatabaseConnection from '../../database/DatabaseConnection';

import CurrencyInput from 'react-currency-input-field'

import TipoCategoria from '../../util/TipoCategoria';

import { Link } from 'react-router-dom';

import Header from '../../components/Header';
import Title from '../../components/Title';

import { MdKeyboardBackspace } from 'react-icons/md';

import './formProdutos.css'
import FilesManager from '../../database/FilesManager';

export default function FormProdutos() {

    const dbCategory = new DatabaseConnection('categorias');
    const dbProd = new DatabaseConnection('produtos');    

    const [ editando, setEditando ] = useState(false);
    const [ loadingCad, setLoadingCad ] = useState(false);
    const [ nome, setNome ] = useState('');
    const [ descricao, setDescricao ] = useState('');
    const [ categoriaSelecionada, setCategoriaSelecionada ] = useState('0');
    const [ listaCategorias, setListaCategorias ] = useState([]);
    const [ preco, setPreco ] = useState('');
    const [ desconto, setDesconto ] = useState('0');
    const [ possuiEstoque, setPossuiEstoque ] = useState(false);
    const [ qtdEstoque, setQtdEstoque ] = useState(0);
    const [ produtosComp, setProdutosComp ] = useState([]);
    const [ exibirProduto, setExibirProduto ] = useState(true);
    const [ imagemUrl, setImagemUrl ] = useState(null);
    const [ imagemFile, setImagemFile ] = useState(null);
    const [ inputImagem, setInputImagem ] = useState('');

    useEffect( async ()=>{
        await loadCategorias();
    }, []);

    useEffect(() => {
        return () => {
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
        }else
        if(preco.length === 0){
            alert("Preencha o campo preço!");
            return;
        }else
        if(imagemFile === null){
            alert("Selecione uma foto para seu produto!");
            return;
        }else{

            let data = {
                nome: nome,
                descricao: descricao,
                categoria: categoriaSelecionada,
                preco: parseFloat(preco).toFixed(2),
                desconto: parseInt(desconto),
                possuiEstoque: possuiEstoque,
                qtdEstoque:qtdEstoque,
                exibirProduto: exibirProduto,
            };

            await dbProd.newDocument(data).then( async (value)=>{
                
                if(value !== false){
                    const fmProd = new FilesManager('produtos', value.id, imagemFile.name, value.id, 'Cadastrado com sucesso!');
                    await fmProd.uploadImage(imagemFile, clearFields, 'produtos');
                }else{
                    alert("Erro ao cadastrar, consulte o log de erros!");
                }
            });

        }
        
    }

    function clearFields(r){
        if(r === true){
            alert("Cadastrado com scuesso!");
            setNome('');
            setPossuiEstoque(false);
            setPreco('');
            setCategoriaSelecionada('0');
            setDesconto(0);
            setImagemUrl(null);
            setImagemFile(null);
            setQtdEstoque(0);
            setDescricao('');
            setExibirProduto(true);
            setInputImagem('');
        }
    }

    function selectImage(e){
        
        if(e.target.files[0]){
            const img = e.target.files[0];
            if(img.type === 'image/jpeg' || img.type === 'image/png'){
                setImagemFile(img);
                setImagemUrl(URL.createObjectURL(img));
            }else{
                alert("Selecione imagems em JPGE/PNG!");
                setImagemFile(null);
                setImagemUrl(null);
                return null;
            }
        }
    }

    function calcDesconto(){
        if(preco !== ''){
            let d = (parseFloat(preco) / 100) * parseInt(desconto);
            let valorProd = parseFloat(preco) - d;
            return 'R$ '+valorProd.toFixed(2);
        }else{
            return 'R$ 0.00';
        }
    }

 return (
     
    <div className="container-principal">
        <Header />
        <div className="container-conteudo container-dashboard">
            <Title>
                <Link to="/usuarios">
                    <MdKeyboardBackspace size={28} color="#fff" />
                </Link>
                <h1>Produtos - {editando ? `Editar produto` : `Cadastrar produto`}</h1>             
            </Title>
    
        <div className="ContainerConteudo">
            <p>Preencha abaixo com os dados do produto:</p>
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

                    <div className="form-input">
                        <label>Desconto:</label>
                        <input type="number" name="desconto" min="0" max="99" maxLength="2" placeholder="Apenas números..." className="inputText" value={desconto} onChange={e=>setDesconto(e.target.value)} />
                        
                        {desconto !== '0' && preco !== '' ? (
                            <div>
                                <br/><small>O preço a ser exibito no app será de {calcDesconto()}.</small><br/><br/>
                            </div>
                        ) : ``}
                    </div>

                    <div>
                        <label>
                            <input type="checkbox" name="possuiEstoque" checked={possuiEstoque} onChange={e => setPossuiEstoque(e.target.checked)} /> Este produto possui estoque.
                        </label>
                    </div>
                    <div className={possuiEstoque === true ? `form-input` : `hide`}>
                        <label>Quantidade em estoque:</label>
                        <input type="number" name="nome" placeholder="Preencha com apenas números" className="inputText" value={qtdEstoque} onChange={e=>setQtdEstoque(e.target.value)} />
                    </div>

                    <div>
                        <label>
                            <input type="checkbox" name="exibirProduto" checked={exibirProduto} onChange={e => setExibirProduto(e.target.checked)} /> Este produto esta ativo para vendas.
                        </label>
                    </div>

                    <div className="form-input">
                        <label>Imagem:</label>
                        <input type="file" accept="image/*" value={inputImagem}  onChange={selectImage} />
                        { imagemUrl !== null ? (
                            <img src={imagemUrl} alt="Foto do produto" className="imagemProduto" />
                        ) : (<div></div>)}
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