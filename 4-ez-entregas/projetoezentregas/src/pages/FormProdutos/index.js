import React, { useState, useEffect } from 'react';

import DatabaseConnection from '../../database/DatabaseConnection';

import CurrencyInput from 'react-currency-input-field'

import TipoCategoria from '../../util/TipoCategoria';

import { Link, useParams, useHistory } from 'react-router-dom';

import Header from '../../components/Header';
import Title from '../../components/Title';

import { MdKeyboardBackspace } from 'react-icons/md';

import './formProdutos.css'
import FilesManager from '../../database/FilesManager';

export default function FormProdutos() {

    const dbCategory = new DatabaseConnection('categorias');
    const dbProd = new DatabaseConnection('produtos');    

    const { id } = useParams();
    const history = useHistory();

    const [ editando, setEditando ] = useState(false);
    const [ loadingCad, setLoadingCad ] = useState(false);
    const [ nome, setNome ] = useState('');
    const [ descricao, setDescricao ] = useState('');
    const [ categoriaSelecionada, setCategoriaSelecionada ] = useState('0');
    const [ categoriasCompSelecionadas, setCategoriasCompSelecionadas] = useState([]);
    const [ listaCategorias, setListaCategorias ] = useState([]);
    const [ listaCategoriasComp, setListaCategoriasComp ] = useState([])
    const [ preco, setPreco ] = useState('');
    const [ desconto, setDesconto ] = useState('0');
    const [ possuiEstoque, setPossuiEstoque ] = useState(false);
    const [ qtdEstoque, setQtdEstoque ] = useState(0);
    const [ exibirProduto, setExibirProduto ] = useState(true);
    const [ imagemUrl, setImagemUrl ] = useState(null);
    const [ imagemFile, setImagemFile ] = useState(null);
    const [ inputImagem, setInputImagem ] = useState('');
    const [ nomeImagem, setNomeImagem ] = useState('');
    const [ loadAlterarImagem, setLoadAlterarImagme ] = useState(false);

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
                setPossuiEstoque(value.possuiEstoque);
                setPreco(value.preco);
                setQtdEstoque(value.qtdEstoque);
                setCategoriaSelecionada(value.categoria);
                setCategoriasCompSelecionadas(value.categoriasComplementar);
                setImagemUrl(value.imagem);
                setNomeImagem(value.nomeImagem);
                setDesconto(value.desconto);

                let inputs = document.querySelectorAll('.form-inputs-checkbox input[type="checkbox"]');
                let i = 0;
                for(i = 0; i < inputs.length; i++){

                    let c = 0;
                    for(c = 0; c < value.categoriasComplementar.length; c++){                        
                        if(inputs[i].value === value.categoriasComplementar[c]){
                            inputs[i].checked = true;
                        }
                    }
                   
                }

            });
        }

        await loadCategorias(TipoCategoria.CategoriaPrincipal).then( async ()=>{
            await loadCategorias(TipoCategoria.CategoriaComplementar).then( async ()=>{                
                if(id){
                    loadProduto();
                }
            });
        }); 

    }, []);

    useEffect(() => {
        return () => {
            setListaCategorias([]);
            setListaCategoriasComp([]);
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

        
        if(tipoCategoria === TipoCategoria.CategoriaPrincipal){
            setListaCategorias([]);
            setListaCategorias(r);
        }else{
            setListaCategoriasComp([]);
            setListaCategoriasComp(r);
        }
    }

    function selectCheckboxCategoria(e){
        let checkList = categoriasCompSelecionadas;

        const value = e.target.value;
        const index = checkList.indexOf(value);

        if(e.target.checked === true){
            checkList.push(value);
        }else{
            checkList.splice(index, 1);            
        }

        setCategoriasCompSelecionadas(checkList);
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
        }else{

            setLoadingCad(true);

            if(editando === false){                
                if(imagemFile === null){
                    alert("Selecione uma foto para seu produto!");
                    return;
                }
            }

            
            let data = {
                nome: nome,
                descricao: descricao,
                categoria: categoriaSelecionada,
                preco: parseFloat(preco).toFixed(2),
                desconto: (desconto === '' || desconto === NaN) ? 0 : parseInt(desconto),
                possuiEstoque: possuiEstoque,
                qtdEstoque:qtdEstoque,
                exibirProduto: exibirProduto,
                categoriasComplementar: categoriasCompSelecionadas,
            };
            
            if(editando === false){

                await dbProd.newDocument(data).then( async (value)=>{
                    
                    if(value !== false){

                        let nomeImagem;
                        if(imagemFile.type === "image/jpeg"){
                            nomeImagem = value.id+'.jpg';
                        }else{
                            nomeImagem = value.id+'.png';
                        }

                        const fmProd = new FilesManager('produtos', value.id, nomeImagem, value.id, 'Cadastrado com sucesso!');
                        await fmProd.uploadImage(imagemFile, clearFields, 'produtos');
                    }else{
                        alert("Erro ao cadastrar, consulte o log de erros!");
                        setLoadingCad(false);
                    }
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

    function clearFields(r, urlImagem){
        setLoadingCad(false);
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
            setListaCategoriasComp([]);

            let inputs = document.querySelectorAll('.form-inputs-checkbox input[type="checkbox"]');
            let i = 0;
            for(i = 0; i < inputs.length; i++){
                inputs[i].checked = false;
            }

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

    async function alterarImagem(e){
        e.preventDefault();
        if(imagemFile === null){
            alert("Selecione imagems em JPGE/PNG!");
            return;
        }else
        if(imagemFile.type === "image/jpeg" || imagemFile.type === "image/png"){
            let nImagem;
            if(imagemFile.type === "image/jpeg"){
                nImagem = id+'.jpg';
            }else{
                nImagem = id+'.png';
            }
            setLoadAlterarImagme(true);
            const fmProd = new FilesManager('produtos', id, nomeImagem, id);            
            await fmProd.deleteDirectory(async (value)=>{});
            fmProd.nameFile = nImagem;            
            await fmProd.uploadImage(imagemFile, (updateReturn, urlImagem)=>{
                if(updateReturn){
                    alert("Imagem alterada!");
                }else{
                    alert("Erro ao alterar imagem, consulte o log de erros!");
                }
                setLoadAlterarImagme(false);
            }, 'produtos');


        }else{
            alert("Selecione imagems em JPGE/PNG!");
            setImagemFile(null);
            return;
        }

        setLoadAlterarImagme(false);
    }

 return (
     
    <div className="container-principal">
        <Header />
        <div className="container-conteudo container-dashboard">
            <Title>
                <Link to="/produtos">
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
                    <br/>
                    <div className="form-input form-inputs-checkbox">
                        <label>Lista de categorias para produtos complementares</label>
                        {listaCategoriasComp.map((categoria, index)=>{
                            return(
                                <div key={index}>
                                    <label>
                                        <input type="checkbox" name="categoriaComp[]" value={categoria.id} onClick={(e)=>selectCheckboxCategoria(e)}/> {categoria.nome}
                                    </label>
                                </div>
                            )
                        })}
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
                        <input type="number" name="desconto" min="0" max="99" maxLength="2" placeholder="Apenas números..." className="inputText" value={desconto} 
                            onChange={(e)=>{
                                if(e.target.value === '' || e.target.value.length === 0){
                                    setDesconto(0)
                                }else{
                                    setDesconto(e.target.value)
                                }
                            }} 
                        />
                        
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

                    {editando === true ? `` : (
                        <div className="form-input">
                            <label>Imagem:</label>
                            <input type="file" accept="image/*" value={inputImagem}  onChange={selectImage} />
                            { imagemUrl !== null ? (
                                <img src={imagemUrl} alt="Foto do produto" className="imagemProduto" />
                            ) : (<div></div>)}
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
            
            {editando === false ? `` : (
                <div className="form-input">
                    <br/>
                    <label>Imagem:</label>                    
                    { imagemUrl !== null ? (
                        <img src={imagemUrl} alt="Foto do produto" className="imagemProduto" />
                    ) : (<div></div>)}
                    <input type="file" accept="image/*" value={inputImagem}  onChange={selectImage} /><br/><br/>
                    {loadAlterarImagem === true ? `Realizando operação, aguarde...` : (
                        <button className="btn btnSuccess" onClick={(e)=>alterarImagem(e)}>Alterar imagem</button>
                    )}                    
                </div>
            )}
        </div>
        </div>
    </div>
 );
}