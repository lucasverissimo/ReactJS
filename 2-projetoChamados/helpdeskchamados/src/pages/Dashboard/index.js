import { useContext, useState } from 'react';
import './dashboard.css';

import { AuthContext } from '../../contexts/auth';

import Header from '../../components/Header';
import Title from '../../components/Title';

import { FiMessageSquare, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Dashboard(){

    const [ chamados, setChamados ] = useState([]);

    const { signOut } = useContext(AuthContext);

    function logout(){
        signOut();
    }

    return(
        <div>
           <Header />
           <div className="content">
               <Title name="Dashboard">
                    <FiMessageSquare size={25} />
               </Title>
                {chamados.length === 0 ? (
                    <div className="container dashboard">
                        <span>Nenhum chamado registrado....</span>
                        <Link to="/new" className="btnNovoChamado">
                            <FiPlus size={25} color="#fff" />
                            Novo chamado
                        </Link>
                    </div> 
                ) : (
                    <>
                        <Link to="/new" className="btnNovoChamado">
                            <FiPlus size={25} color="#fff" />
                            Novo chamado
                        </Link>
                    </>
                )}
               

           </div>
           
        </div>
    );
}