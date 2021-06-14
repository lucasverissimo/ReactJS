import { useState, useEffect } from 'react';

import firebase from '../../services/firebaseConnection';
import { format } from 'date-fns';

import './modal.css';

import { FiX } from 'react-icons/fi';

export default function Modal({idItem, close}){

    const [ item, setItem ] = useState({});
    const [ loadingItem, setLoadingItem ] = useState(true);

    useEffect(()=>{

        async function carregarItem(id){
            await firebase.firestore()
            .collection('chamados')
            .doc(id)
            .get()
            .then((snapshot)=>{
                console.log(snapshot.data());
                setItem(snapshot.data());
                setLoadingItem(false);
            }).catch((error)=>{
                console.log(error);
            });
        }

        carregarItem(idItem);

    }, []);

    if(loadingItem){
        return(
            <div className="modal">
                <div className="loadingItemModal">
                    Carregando...
                </div>
            </div>
        );
    }

    console.log(item);

    return(
        <div className="modal">
            <div className="modalBody">
                <button className="close" onClick={close}>
                    <FiX size={23} color="#fff" /> Fechar
                </button>
                <div>
                    <h2>Detalhes do chamado</h2>
                    <div className="row">
                        <span>
                            Cliente: <label>{item.cliente}</label>
                        </span>
                    </div>
                    <div className="row">
                        <span>
                            Assunto: <label>{item.assunto}</label>
                        </span>
                        <span>
                            Cadastrado em: <label>{format(item.created.toDate(), 'dd/MM/yyyy')}</label>
                        </span>
                    </div>
                    <div className="row">
                        <span>
                            Status: <label style={{color: '#fff', backgroundColor: item.status ==='Aberto' ?'#5cb85c' : '#ccc' }}>{item.status}</label>
                        </span>
                    </div>
                    <div className="row">
                        <span>
                            Complemento: <p>{item.complemento}</p>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

}