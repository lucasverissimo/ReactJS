import { select, call, put, all, takeLatest } from 'redux-saga/effects';
import { addReserveSuccess, updateAmountSuccess } from './actions';


/*
    select: pega um state do reducer.
    call: faz um request em uma API
    put: executa uma ação na action.
    all: um ouvinte para alterações da api (no nosso caso, fica ouvindo o addToReserve), e baseado nisto, determina quando executar uma ação
    (no nosso caso o takeLast é executado, mas poderia ser outro)
*/

import api from '../../../services/api';
import history from '../../../services/history';

function* addToReserve({ id }){ // o asteristo e um metodo coringa mais poderoso que o await, ao inves de usar await, usar yield


    yield select(
        state => {
            console.log(state);
        }
    );

    const tripExist = yield select(
        state => state.reserve.find(trip => trip.id === id)
    ); // verifico se existe alguma viagem já adicionada com o id igual ao novo adicionado, o select captura a state

    const myStock = yield call(api.get, `/stock/${id}`);
    const stockAmount = myStock.data.amount;
    const currentStock = tripExist ? tripExist.amount : 0;
    const amount = currentStock + 1;

    if(amount > stockAmount){
        alert('Quantidade máxima atingida!');
        return;
    }

    if(tripExist){

        const amount = tripExist.amount + 1;
        yield put(updateAmountSuccess(id, amount));
        history.push('/reservas');

    }else{
        const response = yield call(api.get, `trips/${id}`); // funciona como um request de API, obtendo um response
        
        const data = {
            ...response.data,
            amount: 1,
        }
        
        yield put(addReserveSuccess(data));
        history.push('/reservas');
    }

}

function* updateAmount({id, amount}){
    
    if(amount <= 0) return;

    const myStock = yield call(api.get, `/stock/${id}`);
    const stockAmount = myStock.data.amount;

    if(amount > stockAmount){
        alert("Quantidade máxima atingida!");
        return;
    }

    yield put(updateAmountSuccess(id, amount));

}

// takeLatest serve para fazer uma requisição baseado na ultima solicitação. O takeEvery faz o request sempre que solicitado
export default all([
    takeLatest('ADD_RESERVER_REQUEST', addToReserve),
    takeLatest('UPDATE_RESERVE_REQUEST', updateAmount),
]); // o metodo all serve como um ouvinte para alterações.