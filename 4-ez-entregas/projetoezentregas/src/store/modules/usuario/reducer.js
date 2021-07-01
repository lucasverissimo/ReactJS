
export default function usuario(state = [], action){
    console.log(action);
    switch(action.type){

        case 'AUTENTICAR_SUCCESS':
                       
            state = action.dados;            
            return state;
            break;

        case 'LOGOUT_SUCCESS':
            state = [];
            return state;
            break;
        default:
        
            if(localStorage.getItem("AUTH_USER")){
                const user = JSON.parse(localStorage.getItem("AUTH_USER"));
                console.log(user);
                state = user;
                return state;
            }else{
                return state;
            }            
            break;    

    }

    return state;
}