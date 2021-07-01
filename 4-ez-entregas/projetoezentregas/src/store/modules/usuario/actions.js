export function autenticarRequest(email, senha){
    return {
        type: 'AUTENTICAR_REQUEST',
        dados:{
            email: email,
            senha: senha,
        }
    }
}

export function autenticarSuccess(dados){   
    return {
        type: 'AUTENTICAR_SUCCESS',
        dados
    }
}

export function logoutRequest(){
    return{
        type: 'LOGOUT_REQUEST',
    }
}

export function logoutSuccess(){
    return{
        type: 'LOGOUT_SUCCESS',
    }
}