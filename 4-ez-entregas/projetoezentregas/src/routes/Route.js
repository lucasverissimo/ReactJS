
import { Route, Redirect } from 'react-router-dom';

import { useSelector } from "react-redux";

export default function RouteWrapper({component:Component, isPrivate, ...rest}){
    const usuario = useSelector(state => state.usuario);

    console.log('usuario rotas: ');
    if(usuario){
        console.log('existe');
    }

    console.log(!usuario && isPrivate);
    console.log(!usuario);
    console.log(usuario.nome);
    console.log(isPrivate);

    if(typeof usuario.nome === 'undefined' && isPrivate){
        return <Redirect to="/" />
    }

    if(typeof usuario.nome === 'string' && !isPrivate){
        return <Redirect to="/dashboard" />
    }

    return(
        <Route 
            {...rest}
            render={props=>(<Component {...props} />)}
        />
    );

}