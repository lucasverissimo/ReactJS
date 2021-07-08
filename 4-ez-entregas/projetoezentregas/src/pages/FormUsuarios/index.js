import React, { useEffect, useState } from 'react';
import './formUsuarios.css';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Title from '../../components/Title';

import DatabaseConnection from '../../database/DatabaseConnection';

import { Link } from 'react-router-dom';
import { MdKeyboardBackspace } from 'react-icons/md';


export default function FormUsuarios(props) {

    
    const { id } = useParams();
    const db = new DatabaseConnection('usuarios');
    const [ nome, setNome ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ ativo, setAtivo ] = useState('0');
    const [ senha, setSenha ] = useState('');
    const [ senhaAtual, setSenhaAtual ] = useState('');
    const [ confsenha, setConfsenha ] = useState('');
    const [ loadingCad, setLoadingCad ] = useState(false);
    const [ editando, setEditando ] = useState(false);
    const [ infoUser, setInfoUser ] = useState({});

    useEffect( async ()=>{

        let infoUser = JSON.parse(localStorage.getItem("AUTH_USER"));
        setInfoUser(infoUser);

        if(id){
            await db.getDocument(id).then((data)=>{                
                setEditando(true);
                setNome(data.nome);
                setEmail(data.email);
                setAtivo(data.ativo);
            });
        }
    }, []);

    function validEmail(e) {
        var filter = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
        return String(e).search (filter) != -1;
    }

    async function submitForm(e){
        e.preventDefault();

        if(nome.length < 3){
            alert("Preencha o campo nome!");
        }else
        if(validEmail(email) === false){
            alert("Preencha com um e-mail válido!");
        }else
        if(ativo === '0'){
            alert("Informe se a conta será cadastrada como ativa ou inativa!");
        }else{
            setLoadingCad(true);

            let data = {};
            

            if(editando === false){
                
                if(senha.length < 8){
                    alert("A senha deve possuir no mínimo 8 caracteres!");
                    setLoadingCad(false);
                    return;
                }else
                if(senha !== confsenha){
                    alert("As senhas digitadas não conferem!");
                    setLoadingCad(false);
                    return;
                }else{
                    data = {
                        nome: nome,
                        email: email,
                        ativo: ativo,
                        senha: senha,
                    };
                }
                
            }else{

                if(senha.length > 0){
                    if(senha.length < 8){
                        alert("A senha deve possuir no mínimo 8 caracteres!");
                        setLoadingCad(false);
                        return;
                    }else
                    if(senha !== confsenha){
                        alert("As senhas digitadas não conferem!");
                        setLoadingCad(false);
                        return;
                    }else{
                        data = {
                            id: id,
                            nome: nome,
                            ativo: ativo.toString() === 'true' ? true : false,
                            senhaAtual: senhaAtual,
                            senha: senha,
                        };
                    }
                }else{
                    data = {
                        id: id,
                        nome: nome,
                        ativo: ativo.toString() === 'true' ? true : false,
                    };
                }                
            }

            if(editando === false){
                await db.newUser(data)
                .then((value)=>{
                    
                    if(value === true){
                        alert("Cadastrado com sucesso!");
                        setNome('');
                        setEmail('');
                        setSenha('');
                        setConfsenha('');
                        setAtivo('0');
                    }else{
                        alert("Erro ao cadastrar - consulte o log de erros!\n"+value.message);
                        console.log(value);
                    }
                    
                }).catch((error)=>{
                    alert("Erro ao cadastrar!");
                    console.log(error);
                });
            }else{
                await db.updateUser(data)
                .then((value)=>{
                    if(value === true){
                        alert("Alteração realizada com sucesso!");
                    }else{
                        alert("Erro ao atualizar, verifique o log de erros!");
                        console.log(value);
                    }
                });
            }

            setLoadingCad(false);
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
                    <h1>Usuários - {editando ? `Editar usuário` : `Cadastrar usuário`}</h1>             
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
                            <label>E-mail:</label>
                            {editando === true ? (
                                <input disabled type="text" name="email" placeholder="Preencha o campo e-mail..." className="inputText" value={email} onChange={e=>setEmail(e.target.value)}   />
                            ) : (
                                <input type="text" name="email" placeholder="Preencha o campo e-mail..." className="inputText" value={email} onChange={e=>setEmail(e.target.value)}   />
                            )}
                            
                        </div>
                        <div className="form-input">
                            <label>Conta ativa?</label>
                            <select name="ativo" className="inputSelect" value={ativo} onChange={e=>setAtivo(e.target.value)} >
                                <option value="0">-- Selecione uma opção</option>
                                <option value="true">Sim</option>
                                <option value="false">Não</option>
                            </select>
                        </div>

                        
                        {editando === true && infoUser.id === id ? (
                            <div>
                                <div className="form-input">
                                    <label>Senha atual (Deixe em branco se não deseja alterar para uma nova senha): </label>
                                    <input type="password" name="senhaatual" placeholder="No mínimo 8 caracteres..." className="inputText" onChange={e=>setSenhaAtual(e.target.value)}  />
                                </div>
                                <div className="form-input">
                                    <label>Senha {editando && `(Deixe em branco se não deseja alterar)`}: </label>
                                    <input type="password" name="senha" placeholder="No mínimo 8 caracteres..." className="inputText" onChange={e=>setSenha(e.target.value)}  />
                                </div>
                                <div className="form-input">
                                    <label>Confirmar Senha {editando && `(Deixe em branco se não deseja alterar)`}:</label>
                                    <input type="password" name="confsenha" placeholder="Preencha sua senha novamente..." className="inputText" onChange={e=>setConfsenha(e.target.value)}  />
                                </div>
                            </div>
                        ) : (
                            <div></div>
                        )}

                        {editando === false &&(
                            <div>
                                <div className="form-input">
                                    <label>Senha {editando && `(Deixe em branco se não deseja alterar)`}: </label>
                                    <input type="password" name="senha" placeholder="No mínimo 8 caracteres..." className="inputText" onChange={e=>setSenha(e.target.value)}  />
                                </div>
                                <div className="form-input">
                                    <label>Confirmar Senha {editando && `(Deixe em branco se não deseja alterar)`}:</label>
                                    <input type="password" name="confsenha" placeholder="Preencha sua senha novamente..." className="inputText" onChange={e=>setConfsenha(e.target.value)}  />
                                </div>
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