import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'; // responsavel por disparar uma ação no redux 
import api from '../../services/api';
import { MdFlightTakeoff } from 'react-icons/md';
import './home.css';

import { addReserveRequest } from '../../store/modules/reserve/actions';

export default function Home({history}) {

    const dispatch = useDispatch();
    const [trips, setTrips] = useState([]);

    useEffect(()=>{
        async function loadApi(){
            const response = await api.get('/trips');
            setTrips(response.data);
            
        }

        loadApi();
        
    }, []);


    function handleAdd(id){
        dispatch(addReserveRequest(id));        
    }

 return (
   <div>
       <div className="box">           
           {trips.map(trip => (               
               <li key={trip.id}>
                   <img src={trip.image} alt={trip.title} />
                   <strong>{trip.title}</strong>
                   <span>Status: {trip.status ? 'Disponível' : 'Indisponível'}</span>
                   <button type="button" onClick={()=> handleAdd(trip.id)}>
                       <MdFlightTakeoff size={18} color="#fff" />
                        <span>
                            Solicitar Reserva   
                        </span>
                   </button>
               </li>
           ))}
       </div>
   </div>
 );
}