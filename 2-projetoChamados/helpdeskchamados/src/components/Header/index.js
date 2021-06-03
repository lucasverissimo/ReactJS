import { useContext } from 'react';
import './headerStyle.css';

import { AuthContext } from '../../contexts/auth';
import avatar from '../../assets/avatar.png';

import { Link } from 'react-router-dom';

import { FiHome, FiUser, FiSettings } from "react-icons/fi";

export default function Header(){

    const { user } = useContext(AuthContext);

    return(
        <div className="sidebar">
            <div>
                <img src={user.avatarUrl === null ? avatar : user.avatarUrl } alt="Foto avatar" />
            </div>

            <ul>
                <li>
                    <Link to="/dashboard">
                        <FiHome color="#fff" size={24} />
                        Chamados
                    </Link>
                </li>
                
                <li>
                    <Link to="/customers">
                        <FiUser color="#fff" size={24} />
                        Clientes
                    </Link>
                </li>
                
                <li>
                    <Link to="/profile">
                        <FiSettings color="#fff" size={24} />
                        Configurações
                    </Link>
                </li>
            </ul>
        </div>
    )
}