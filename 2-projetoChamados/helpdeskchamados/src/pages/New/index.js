import { useState, useEffect, useContext } from 'react';

import { useHistory, useParams} from 'react-router-dom';

import './new.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { toast } from 'react-toastify';

import { FiPlus } from 'react-icons/fi';

import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebaseConnection';

export default function New(){

    const { id } = useParams();
    const history = useHistory();

    const [ assunto, setAssunto ] = useState('');
    const [ status, setStatus ] = useState('');
    const [ complemento, setComplemento ] = useState('');

    const [ customers, setCustomers ] = useState([]);
    const [ loadingCustomers, setLoadingCustomers ] = useState(true);
    const [ customerSelected, setCustomerSelected] = useState(0);
    const [ idCustomer, setIdCustomer ] = useState(false);

    const { user } = useContext(AuthContext);
    
    useEffect(()=>{
        async function loadCustomers(){
            await firebase.firestore().collection('customers')
            .get().then((snapshot)=>{

                let lista = [];

                lista.push({
                    id: '0',
                    nomeFantasia: '-- Selecione uma opção'
                });

                snapshot.forEach((doc)=>{
                    lista.push({
                        id: doc.id,
                        nomeFantasia: doc.data().nomeFantasia
                    });
                });

                if(lista.length === 0){
                    toast.warning("Nenhuma empresa cadastrada!");
                    setCustomers([
                        { id: '1', nomeFantasia: ''}
                    ]);
                    setLoadingCustomers(false);
                    return;
                }

                setCustomers(lista);
                setLoadingCustomers(false);

                if(id){
                    loadId(lista);
                }

            }).catch((error)=>{
                console.log(error);
                toast.error("Erro ao carregar a lista de clientes!");
                // setLoadingCustomers(false);
                setCustomers([
                    { id: '1', nomeFantasia: ''}
                ]);
            });
        }

        loadCustomers();

    }, [id]);

    async function loadId(lista){
        await firebase.firestore()
        .collection('chamados')
        .doc(id)
        .get()
        .then((snapshot)=>{
            
            let data = snapshot.data();
            setAssunto(data.assunto);
            setStatus(data.status);
            setComplemento(data.complemento);

            let index = lista.findIndex(item => item.id === data.clienteId);
            setCustomerSelected(index);
            setIdCustomer(true);

        }).catch((error)=>{
            console.log(error);
            setIdCustomer(false);
        });
    }

    async function handleRegister(e){
        e.preventDefault();

        if(assunto !== '' && status !== '' && customerSelected !== '0' && complemento !== ''){
            
           await firebase.firestore().collection('chamados')
            .add({
                created: new Date(),
                cliente: customers[customerSelected].nomeFantasia,
                clienteId: customers[customerSelected].id,
                assunto: assunto,
                status: status,
                complemento: complemento,
                userId: user.uid,
            }).then((success)=>{

                toast.success("Cadastrado com sucesso!");
                console.log(success);

                setAssunto('');
                setStatus('');
                setComplemento('');
                setCustomerSelected(0);

            }).catch((error)=>{
                toast.error("Erro ao cadastrar! consulte o log.");
                console.log(error);
            });
        }else{
            toast.error("Preencha todos os campos!");
            return;
        }
    }

    async function handleUpdate(e){
        e.preventDefault();
        await firebase.firestore().collection('chamados')
        .doc(id)
        .update({
            assunto: assunto,
            status: status,
            complemento: complemento,
            userId: user.uid,
        }).then((success)=>{
            toast.success('Chamado editado com sucesso!');
            history.push('/dashboard');
        }).catch((err)=>{
            toast.error('Erro ao editar, verifique o log de erros!');
            console.log(err);
        });
    }

   

    return(
        <div>
            <Header />
                <div className="content">
                    <Title name="Novo chamado">
                        <FiPlus size={25} />
                    </Title>
                    <div className="container">
                        <form className="form-profile" type="post" onSubmit={idCustomer === false ? handleRegister : handleUpdate }>

                            <label>Cliente</label>
                            
                            { loadingCustomers === true ? (
                                <div>Carregando lista de clientes...</div>
                            ) : (
                                <select value={customerSelected} onChange={(e)=>setCustomerSelected(e.target.value)} disabled={ id !== 'undefined' }>
                                    {customers.map((item, index)=>{
                                        return(
                                            <option key={item.id} value={index}>
                                                {item.nomeFantasia}
                                            </option>
                                        )
                                    })}
                                </select>
                            )}
                            

                            <label>Assunto</label>

                            <select value={assunto} onChange={(e)=>setAssunto(e.target.value)}>
                                <option value="">
                                    -- Selecione as opções
                                </option> 

                                <option value="Suporte">
                                    Suporte
                                </option>                                
                                <option value="Visita Técnica">
                                    Visita Técnica
                                </option>                                
                                <option value="Financeiro">
                                    Financeiro
                                </option>                                
                                <option value="Rechamado">
                                    Rechamado
                                </option>
                            </select>

                            <label>Status</label>
                            <div className="status">
                                <input type="radio" name="radio" value="Aberto" 
                                onChange={(e)=>setStatus(e.target.value)} checked={ status === 'Aberto'}/>
                                <span>Em aberto</span>
                                
                                <input type="radio" name="radio" value="Progresso" 
                                onChange={(e)=>setStatus(e.target.value)} checked={ status === 'Progresso'}/>
                                <span>Em progresso</span>
                                
                                <input type="radio" name="radio" value="Atendido" 
                                onChange={(e)=>setStatus(e.target.value)} checked={ status === 'Atendido'}/>
                                <span>Atendido</span>
                            </div>

                            <label>Complemento</label>
                            <textarea 
                                type="text"
                                placeholder="Informe mais sobre seu problema..."
                                value={complemento}
                                onChange={(e)=>setComplemento(e.target.value)}
                            />

                            { !loadingCustomers && (
                                <button type="submit" className="btnSalvar">
                                {idCustomer === false ? 'Cadastrar' : 'Salvar Alterações' }
                               </button>
                            )}
                        </form>
                    </div>
                </div>

        </div>
    )
}