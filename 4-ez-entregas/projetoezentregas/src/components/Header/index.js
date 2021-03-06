import React, { useEffect, useState } from 'react';
import './header.css';
import Logo from '../../assets/logo-white.png'; 
import { 
    MdMenu, MdExitToApp, MdClose, MdHome, MdExpandMore,
    MdViewList, MdAttachMoney, MdPeople, MdLightbulbOutline, MdPerson, MdSettings
 } from 'react-icons/md';
import { Link } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { logoutRequest } from '../../store/modules/usuario/actions';

export default function Header() {

    const dispatch = useDispatch();

    const [ showMenu, setShowMenu ] = useState(false);
    const [ activeMenu, setActiveMenu ] = useState(false);
    const [ nomeUsuario, setNomeUsuario ] = useState('');

    useEffect(()=>{
        let infoUser = JSON.parse(localStorage.getItem("AUTH_USER"));
        setNomeUsuario(infoUser.nome);
    },[]);
    

    function showLeftMenu(){
        if(showMenu === false){
            setShowMenu(!showMenu);
            setTimeout(function(){
                setActiveMenu(!activeMenu);
            }, 10);
        }else{
            setActiveMenu(!activeMenu);
            setTimeout(function(){                
                setShowMenu(!showMenu);
            }, 500);
        }
    }

    function handleLogout(e){
        e.preventDefault();
        dispatch(logoutRequest());
    }

    function expandMenu(idMenu){
        let el = document.getElementById(idMenu);
        el.classList.toggle('menuOpen');
    }

 return (
   <header>
       <div className="cabecalhoMobile">
            <button onClick={ ( ) => showLeftMenu() }>
                <MdMenu size={28} color="#fff" />
            </button>
            <img src={Logo} alt="Ez Entregas - Seu Delivery Online" className="LogoHeaderMobile" />
            <button onClick={()=>{}}>
                <MdExitToApp size={28} color="#fff" />
            </button>
       </div>
       <div className={`
            menuHeader 
            ${ showMenu === true ? 'showMenu' : 'hideMenu' }
            ${ activeMenu === true ? 'activeMenu' : 'inactiveMenu' }             
        `}>
        <div className="cabecalhoHeader">
            <img src={Logo} alt="Ez Entregas - Seu Delivery Online" className="LogoHeader" />
            <div className="mensagemUsuario">
                <p className="l1">Seja bem-vindo!</p>
                <p className="l2">{nomeUsuario}</p>
            </div>
        </div> 
        <div className="listaMenuHeader">
            <ul className="menuPrincipal">
                <li>
                    <Link to="/dashboard">
                        <MdHome size={25} color="#fff" /> 
                        Home
                    </Link>                  
                </li>

                <li>
                    <label onClick={() => expandMenu('menuCatalogo')}>
                        <MdViewList size={25} color="#fff" /> 
                        Cat??logo
                    </label>
                    <button onClick={() => expandMenu('menuCatalogo')}>
                        <MdExpandMore size={25} color="#fff" />
                    </button>
                    <ul className="subMenu" id="menuCatalogo">
                        <li>
                            <Link to="/produtos">
                                Produtos
                            </Link>
                        </li>
                        <li>
                            <Link to="/produtos-complementares">
                                Produtos complementares
                            </Link>
                        </li>
                        <li>
                            <Link to="/categorias">
                                Categorias
                            </Link>
                        </li>                        
                    </ul>
                </li>

                <li>
                    <label onClick={() => expandMenu('menuVendas')}>
                        <MdAttachMoney size={25} color="#fff" /> 
                        Vendas
                    </label>
                    <button onClick={() => expandMenu('menuVendas')}>
                        <MdExpandMore size={25} color="#fff" />
                    </button>
                    <ul className="subMenu" id="menuVendas">
                        <li>
                            <Link to="/pedidos">
                                Pedidos
                            </Link>
                        </li>
                        <li>
                            <Link to="/relatorio">
                                Relat??rio
                            </Link>
                        </li>
                        <li>
                            <Link to="/televenda">
                                Televendas
                            </Link>
                        </li>
                    </ul>
                </li>

                <li>
                    <Link to="/clientes">
                        <MdPeople size={25} color="#fff" /> 
                        Clientes
                    </Link>
                </li>

                <li>
                    <label onClick={() => expandMenu('menuMarketing')}>
                        <MdLightbulbOutline size={25} color="#fff" /> 
                        Marketing
                    </label>
                    <button onClick={() => expandMenu('menuMarketing')}>
                        <MdExpandMore size={25} color="#fff" />
                    </button>
                    <ul className="subMenu" id="menuMarketing">
                        <li>
                            <Link to="/banners">
                                Banners
                            </Link>
                        </li>
                        <li>
                            <Link to="/cupons">
                                Cupons
                            </Link>
                        </li>
                        
                        <li>
                            <Link to="/frete">
                                Frete
                            </Link>
                        </li>
                    </ul>
                </li>

                <li>
                    <Link to="/usuarios">
                        <MdPerson size={25} color="#fff" /> 
                        Usu??rios
                    </Link>
                </li>

                <li>
                    <label onClick={() => expandMenu('menuConfig')}>
                        <MdSettings size={25} color="#fff" /> 
                        Configura????es
                    </label>
                    <button onClick={() => expandMenu('menuConfig')}>
                        <MdExpandMore size={25} color="#fff" />
                    </button>
                    <ul className="subMenu" id="menuConfig">
                        <li>
                            <Link to="/notificacoes">
                                Notifica????es
                            </Link>
                        </li>
                        <li>
                            <Link to="/textos-informativos">
                                Textos informativos
                            </Link>
                        </li>
                    </ul>
                </li>

                <li>
                    <Link to="#" onClick={handleLogout}>
                        <MdExitToApp size={25} color="#fff" /> 
                        Sair
                    </Link>
                </li>
            </ul>
        </div>
       </div>
       <div className={`
            maskMenu 
            ${ showMenu === true ? 'activeShadow' : 'inactiveShadow' }            
        `}>
           <button onClick={()=>showLeftMenu()}>
                <MdClose size={28} color="#fff" />
           </button>
       </div>
   </header>
 );
}