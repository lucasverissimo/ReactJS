import { all } from 'redux-saga/effects';
import usuario from './usuario/sagas';

export default function* rootSaga(){
    return yield all([
        usuario,
    ]);
}