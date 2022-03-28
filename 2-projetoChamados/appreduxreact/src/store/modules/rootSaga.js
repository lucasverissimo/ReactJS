import { all } from 'redux-saga/effects'

import reserve from './reserve/sagas';

// serve para centralizar todos os sagas que houver na aplicação, podendo ser adicionado de usuarios, produtos, etc.
export default function* rootSaga(){
    return yield all([
        reserve,
    ]);
}