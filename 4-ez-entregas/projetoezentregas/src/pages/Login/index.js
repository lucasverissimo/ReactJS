import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { autenticarRequest } from '../../store/modules/usuario/actions';
import './login.css';
import Logo from '../../assets/logo-white.png';

export default function Login() {

  const dispatch = useDispatch();
  const [ email, setEmail ] = useState('');
  const [ senha, setSenha ] = useState('');
  const [ loadingLogin, setLoadingLogin ] = useState(false);

  useEffect(()=>{

  }, []);

  function validEmail(e) {
      var filter = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
      return String(e).search (filter) != -1;
  }

  function login(e){
    e.preventDefault();   
    
    if(validEmail(email) === false){
      alert("Preencha o e-mail corretamente!");
      return;
    }else
    if(senha.length < 8){
      alert("Preencha a senha corretamente!");
    }else{
      setLoadingLogin(true);
      dispatch(autenticarRequest(email, senha));
      setTimeout(function(){
        setLoadingLogin(false);
      }, 2000);
    }
  }

 return (
   <div className="container-fluid d-flex flex-column justify-content-center align-items-center">
      <div className="container-login">
        <img src={Logo} alt="Ez Entregas - Seu Delivery Online" />
        <form className="formLogin" type="submit" onSubmit={login}>
          <div className="form-group">            
            <input type="email" className="form-control" id="emailUsuario" placeholder="E-mail: " onChange={(e)=>setEmail(e.target.value)} />
            <small id="emailHelp" className="form-text">Nunca compartilhe seu e-mail e senha com ninguém.</small>
          </div>
          <div className="form-group">            
            <input type="password" className="form-control" id="senhaUsuario" placeholder="Senha: " onChange={(e)=>setSenha(e.target.value)}  />
          </div>
          {loadingLogin === false ?(
            <button type="submit" className="btn-login">Entrar</button>
          ):(
            <small id="emailHelp" className="form-text">Realizando autenticação, aguarde...</small>
          )}
          
        </form>
       </div>
   </div>
 );
}