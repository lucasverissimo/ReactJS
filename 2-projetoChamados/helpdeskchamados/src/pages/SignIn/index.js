import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import './signin.css';
import { AuthContext } from '../../contexts/auth';

import logo from '../../assets/logo.png';

export default function SignIn(){

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const { signIn, loadingAuth } = useContext(AuthContext);

    function handleLogin(e){
      if(loadingAuth === false){
        if(email !== '' && pass !== ''){
          signIn(email, pass);
        }else{
          alert("Preencha com e-mail e senha!");
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
          <form onSubmit={handleLogin}>
              <h1>Entrar</h1>
              <input type="text" placeholder="E-mail: " value={email} onChange={(e)=>setEmail(e.target.value)} />
              <input type="password" placeholder="Senha: " value={pass} onChange={(e)=>setPass(e.target.value)} />
              <input type="submit" value={loadingAuth ? 'Carregando...' : 'Entrar'} />
          </form>
          <Link to="/register">Criar uma conta</Link>
      </div>
    </div>
  );
}