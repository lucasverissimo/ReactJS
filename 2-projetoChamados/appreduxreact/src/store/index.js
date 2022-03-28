import  { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './modules/rootReducer';
import rootSaga from './modules/rootSaga';

const sagaMiddleware = createSagaMiddleware();
const enhancer = applyMiddleware(sagaMiddleware);

const store = createStore(rootReducer, enhancer);

sagaMiddleware.run(rootSaga);

export default store;


/*

AQUI TEMOS O REDUX E O REDUX SAGA.
O REDUX SERVE PARA ARMAZENAR ESTADOS E CONTROLAR OS MESMOS, PODENDO MANTER ELES DURANTE A NAVEGAÇÃO E TAMBÉM PODENDO ALTERAR QUALQUER UM DELES.
O REDUX SAGA SERVE COMO UM MIDDLEWARE, ELE FICA ENTRE A REQUISIÇÃO DO USUÁRIO E A ACTION DO REDUX, PODENDO SER USADO PARA CONSULTAR APIS,
E APOS A CONSULTA DISPARAR UMA AÇÃO (ACTION).

O FLUXO DE INFORMAÇÃO NESTE CASO SEGUE:
INTERFACE -> DISPARAR UMA AÇÃO (COMO O BOTÃO DE SOLICITAR RESERVA) -> ENVIAR PARA O SAGA O ID -> FAZER O REQUEST NA API ATRAVÉS DO ID
-> PEGAR O RESPONSE DO REQUEST E EXECUTAR UMA AÇÃO (ENVIANDO PARA O REDUX) -> REDUX ADICIONA A RESERVA NA LISTA DE ITENS ADICIONADOS.


*/