import { useContext } from 'react';
import {Route, Redirect} from 'react-router-dom';
import { AuthContext } from '../contexts/auth';

export default function RouteWrapper({component:Component, isPrivate, ...rest}){

    const { signed, loading } = useContext(AuthContext);    

    // tela de loading
    if(loading){
        return(
            <div>Carregando...</div>
        );
    }

    console.log(signed, isPrivate);

    // verifica se esta logado e se a tela acessada é privada
    if(!signed && isPrivate){
        return <Redirect to="/" />
    }

    // verifica se esta logado e se a tela acessada é privada
    if(signed && !isPrivate){
        return <Redirect to="/dashboard" />
    }

    

    return(
        <Route 
            {...rest} 
            render={props => (<Component {...props} />)}
        />
    );
}