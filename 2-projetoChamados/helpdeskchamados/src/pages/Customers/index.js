import { useState } from 'react';
import './customers.css';

import firebase from '../../services/firebaseConnection';

import Title from '../../components/Title';
import Header from '../../components/Header';
import { FiUser}  from 'react-icons/fi';

import { toast } from 'react-toastify';

export default function Customers() {

    const [ nomeFantasia, setNomeFantasia ] = useState('');
    const [ cnpj, setCnpj ] = useState('');
    const [ endereco, setEndereco ] = useState('');
    const [ isLoading, setIstLoading ] = useState(false);

    async function handleAdd(e){
        e.preventDefault();
        setIstLoading(true);
        if(nomeFantasia !== '' && cnpj !== '' && endereco !== ''){

            try{
                await firebase.firestore().collection('customers')
                .add({
                    nomeFantasia: nomeFantasia,
                    cnpj: cnpj,
                    endereco: endereco,
                }).then((value)=>{
                    toast.info("Cadastrado com sucesso!");
                    setNomeFantasia('');
                    setEndereco('');
                    setCnpj('');
                    setIstLoading(false);
                }).catch((error)=>{
                    toast.error("Erro ao cadastrar, por favor tente mais tarde!");
                    console.log(error);
                    setIstLoading(false);
                });

                setIstLoading(false);
            }catch(e){
                toast.error("Erro ao executar, por favor tente mais tarde!");
                console.log(e);
                setIstLoading(false);
            }
        }else{
            toast.error("Preencha todos os campos!");
            setIstLoading(false);
        }

        setIstLoading(false);
        

    }

    return (
    <div>
            <Header />
        <div className="content">
            <Title name="Clientes">
                <FiUser size={25} />
            </Title>
            <div className="container">
                <form className="form-profile form-customers" type="post" onSubmit={(e)=>handleAdd(e)}>
                    <label>Nome fantasia:</label>
                    <input type="text" placeholder="Nome de sua empresa..." value={nomeFantasia} onChange={(e)=> setNomeFantasia(e.target.value)} disabled={isLoading} />
                    
                    <label>CNPJ:</label>
                    <input type="text" placeholder="CNPJ..." value={cnpj} onChange={(e)=> setCnpj(e.target.value)}  disabled={isLoading}/>
                    
                    <label>Endereço:</label>
                    <input type="text" placeholder="Endereço da empresa..."  value={endereco} onChange={(e)=> setEndereco(e.target.value)} disabled={isLoading}/>

                    {isLoading ? (
                        <label>Cadastrando, aguarde....</label>
                    ) : (
                        <button type="submit" className="btnSalvar">Cadastrar</button>
                    )}
                    
                </form>
            </div>
        </div>
    </div>
    );
}