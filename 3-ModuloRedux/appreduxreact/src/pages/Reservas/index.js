import React from 'react';
// useSelector: captura um determinado reducer
// useDispatch: executa uma ação no reducer
import { useSelector, useDispatch } from 'react-redux'; 

import { MdDelete, MdAddCircle, MdRemoveCircle } from 'react-icons/md';

import './reservas.css';

import { removeReserve, updateAmountRequest } from '../../store/modules/reserve/actions';

export default function Reservas() {

  const dispatch = useDispatch();
  const reserves = useSelector(state => state.reserve);

  function handleRemove(id){
    dispatch(removeReserve(id));
  }

  function decrementAmount(trip){
    if(trip.amount > 1){
      dispatch(updateAmountRequest(trip.id, trip.amount - 1));
    }
  }

  function incrementAmount(trip){    
    dispatch(updateAmountRequest(trip.id, trip.amount + 1));
  }

  return (
    <div>
        <h1 className="title">Você solicitou {reserves.length} reservas</h1>

        {reserves.map(reserve => (
           <div className="reservas" key={reserve.id}>
              <img 
                src={reserve.image}
                alt={reserve.title}
              />
              <strong>{reserve.title}</strong>
              <div className="ammountDiv">
                <button type="button" onClick={() => decrementAmount(reserve)}>
                  <MdRemoveCircle size={25} color="#000" />
                </button>
                <span>
                  <input type="text" readOnly value={reserve.amount} />
                </span>
                <button type="button" onClick={() => incrementAmount(reserve)}>
                  <MdAddCircle size={25} color="#000" />
                </button>
              </div>
              <button type="button" onClick={()=>handleRemove(reserve.id)}>
                <MdDelete size={20} color="#191919" />
              </button>
          </div>
        ))}
       



        <div className="rodapeReservas">
          <button type="button">Solicitar Reservas</button>
        </div>
    </div>
  );
}