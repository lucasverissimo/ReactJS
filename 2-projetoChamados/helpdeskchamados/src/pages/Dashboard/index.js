import { useContext, useState, useEffect } from 'react';
import './dashboard.css';

import firebase from '../../services/firebaseConnection';
import { AuthContext } from '../../contexts/auth';
import { format } from 'date-fns';

import Header from '../../components/Header';
import Title from '../../components/Title';
import Modal from '../../components/Modal';

import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';


const listRef = firebase.firestore().collection('chamados').orderBy('created', 'desc');

export default function Dashboard(){

    const [ chamados, setChamados ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ loadingMore, setLoadingMore ] = useState(false);
    const [ istEmpty, setIsEmpty ] = useState(false);
    const [ lastDocList, setLastDocList ] = useState();
    // modal
    const [ showPostModal, setShowPostModal ] = useState(false);
    const [ itemIdModal, setItemIdModal ] = useState('');

    const { signOut } = useContext(AuthContext);

    useEffect(()=>{

        async function loadingChamados(){
            await listRef.limit(5).get()
            .then((snapshot)=>{
    
                updateState(snapshot);
    
            })
            .catch((error)=>{
                toast.error("Erro ao carregar lista!");
                console.log(error);
                setLoadingMore(false);
            });
    
            setLoading(false);
        }

        loadingChamados();

        return () => {};
    }, []);

    
    

    async function updateState(snapshot){
        const isCollectionEmpty = snapshot.size === 0;

        if(!isCollectionEmpty){
            let lista = [];
            snapshot.forEach((doc)=>{
                lista.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    cliente: doc.data().cliente,
                    clienteId: doc.data().clienteId,
                    created: doc.data().created,
                    createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    complemento: doc.data().complemento,
                });
            });
            const lastDoc = snapshot.docs[snapshot.docs.length - 1]; // ultimo documento, para paginacao
            setChamados(chamados => [...chamados, ...lista]);
            setLastDocList(lastDoc);  
            
            if(snapshot.size < 5){
                setIsEmpty(true);
            }
            
        }else{
            setIsEmpty(true);
        }

        setLoadingMore(false);
    }

    async function handleMore(){        
        setLoadingMore(true);
        await listRef.startAfter(lastDocList)
        .limit(5)
        .get()
        .then((snapshot)=>{
            updateState(snapshot);
        }).catch((error)=>{
            alert("Erro ao carregar lista!");
            console.log("Erro ao carregar lista, código do erro: "+error);
        });
    }

    function togglePostModal(id){        
        setItemIdModal(id);
        setShowPostModal(!showPostModal);
    }


    if(loading){
        return(<div>
            <Header />
            <div className="content">
               <Title name="Dashboard">
                    <FiMessageSquare size={25} />
               </Title>
               <div className="container dashboard">
                   <span>Buscando chamados...</span>
               </div>
            </div>
        </div>)
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
                        <table>
                            <thead>
                                <tr>
                                    <th scope="col">Cliente</th>
                                    <th scope="col">Assunto</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Cadastrado em</th>
                                    <th scope="col">#</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chamados.map((item, index)=>{
                                    return(
                                        <tr key={index}>
                                            <td data-label="Cliente">{item.cliente}</td>
                                            <td data-label="Assunto">{item.assunto}</td>
                                            <td data-label="Status">
                                                <span className="badge" style={{backgroundColor: item.status === 'Aberto' ? '#5cb85c':'#ccc', color: '#fff'}}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td data-label="Cadastrado">{item.createdFormated}</td>
                                            <td data-label="#">
                                                <button className="action" style={{backgroundColor: '#b85c5c'}} onClick={()=>{ togglePostModal(item.id) }}>
                                                    <FiSearch color="#fff" size={17} />
                                                </button>
                                                
                                                <Link className="action" style={{backgroundColor: '#5cb85c'}} to={`/new/${item.id}`}>
                                                    <FiEdit2 color="#fff" size={17} />
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                       { loadingMore && <h3>Buscando dados....</h3>}
                       { !loadingMore && !istEmpty && <button className="btn-more" onClick={()=>{ handleMore();}}>Buscar mais</button>} 
                       {istEmpty && <h3>Nenhum item a mais para exibir!</h3>}
                    </>
                    
                )}
               

           </div>
           
           {showPostModal && (
               <Modal idItem={itemIdModal} close={togglePostModal} />
           )}

        </div>
    );
}