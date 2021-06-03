import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import '../SignIn/signin.css';

import logo from '../../assets/logo.png';

import { AuthContext } from '../../contexts/auth';

export default function SignUp(){
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const { loadingAuth, signUp } = useContext(AuthContext);

    function handleCad(e){
      if(loadingAuth == false){
        if(nome !== "" && email !== "" && pass !== ""){
          signUp(nome, email, pass);
        }else{
          alert("Preencha todos os campos corretamente!");
        }
      }
      
      e.preventDefault();
    }

  return(
    <div className="container-center">
      <div className="login">
          <div className="login-area">
            <img src={logo} alt="Help Desk Chamados" />
          </div>
          <form onSubmit={handleCad}>
              <h1>Cadastrar</h1>
              <input type="text" placeholder="Nome: " value={nome} onChange={(e)=>setNome(e.target.value)} />
              <input type="text" placeholder="E-mail: " value={email} onChange={(e)=>setEmail(e.target.value)} />
              <input type="password" placeholder="Senha: " value={pass} onChange={(e)=>setPass(e.target.value)} />
              <input type="submit" value={loadingAuth ? 'Carregando...' : 'Cadastrar'} />
          </form>
          <Link to="/">Já possui uma conta? Entrar!</Link>
      </div>
    </div>
  );
}