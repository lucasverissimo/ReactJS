export function addReserveRequest(id){
    return {
        type: 'ADD_RESERVER_REQUEST',
        id,
    };
}

export function addReserveSuccess(trip){
    return {
        type: 'ADD_RESERVER_SUCESS',
        trip,
    };
}

export function removeReserve(id){
    return {
        type: 'REMOVE_RESERVE',
        id
    };
}

export function updateAmountRequest(id, amount){
    return {
        type: 'UPDATE_RESERVE_REQUEST',
        id,
        amount
    };
}


export function updateAmountSuccess(id, amount){
    return {
        type: 'UPDATE_RESERVE_SUCCESS',
        id,
        amount
    };
}