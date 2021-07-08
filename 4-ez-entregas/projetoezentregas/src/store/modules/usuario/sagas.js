import { all, takeLatest, put } from 'redux-saga/effects';
import firebase from '../../../services/firebaseConfig';
import { autenticarSuccess, logoutSuccess } from './actions';

function* autenticarUsuario({ dados }){

    console.log('autenticando!');
    /*yield select(
        state => {
            console.log(state);
        }
    );*/

    yield firebase.auth().signInWithEmailAndPassword(dados.email, dados.senha)
    .then(async function(firebaseUser){
        let id = firebaseUser.user.uid;
        
        const user = await firebase.firestore().collection('usuarios').doc(id).get();
        
        const data = {
            id: id,
            nome: user.data().nome,
            senha: dados.senha,
            email: user.data().email,
            ativo: user.data().ativo,
        }

        localStorage.setItem("AUTH_USER", JSON.stringify(data));
        await put(autenticarSuccess(data));    
        window.location.href = '/dashboard';

    }).catch((error)=>{
        console.log(error);
        alert("Usuário ou senha estão incorretos!");
        return;
    });    

}

function* logoutUsuario(){
    yield firebase.auth().signOut();
    localStorage.removeItem('AUTH_USER');
    yield put(logoutSuccess());
}

export default all([
    takeLatest('AUTENTICAR_REQUEST', autenticarUsuario),
    takeLatest('LOGOUT_REQUEST', logoutUsuario)
]);