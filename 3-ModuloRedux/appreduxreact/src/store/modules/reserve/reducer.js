import produce from 'immer';

export default function reserve(state = [], action){        
    switch(action.type){
        case 'ADD_RESERVER':
            return produce(state, draft => { // produce passa por todos os indices do array e retorna eles com alguma modificação (se houver)
                const tripIndex = draft.findIndex(trip => trip.id === action.trip.id); // verifico se existe alguma viagem já adicionada com o id igual ao novo adicionado
                
                /*
                    o tripIndex ira retornar > 0 se houver algum id
                    desta forma, ao inves de adicionar duplicado, sera 
                    adicionado apenas um +1 na quantidade (amout).
                    Se não houver nada, ira adicionar um novo indice
                    de viagem com uma quantidade = 1
                */
                if(tripIndex >= 0){
                    draft[tripIndex].amount +=1;
                }else{
                    draft.push({
                        ...action.trip,
                        amount: 1,
                    });
                }

            });
            break;
        case 'REMOVE_RESERVE':

            return produce(state, draft => {
                const tripIndex = draft.findIndex(trip => trip.id === action.id);
                if(tripIndex >= 0){
                    draft.splice(tripIndex, 1); // exclui um indice
                }
            });

            break;    
        default:
            return state;
    }    
}