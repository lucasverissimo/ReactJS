import { useState, useEffect, createContext} from 'react';
import firebase from '../services/firebaseConnection';
import { toast } from 'react-toastify';
export const AuthContext = createContext({});

export default function AuthProvider({ children }){
    
    const [ user, setUser ] = useState();
    const [ loadingAuth, setLoadingAuth ] = useState(false);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {

        function loadStorage(){
            const storageUser = localStorage.getItem("SistemaUser");
            if(storageUser){
                setUser(JSON.parse(storageUser));
                setLoading(false);
            }

           // setTimeout(function(){
                setLoading(false);
           // }, 3000);
            
        }

        loadStorage();
        
    }, []);

    async function signIn(email, pass){
        setLoadingAuth(true);
        await firebase.auth().signInWithEmailAndPassword(email, pass)
        .then( async (value)=>{
            let uid = value.user.uid;
            const userProfile = await firebase.firestore().collection("users").doc(uid).get();
            let data = {
                uid: uid,
                nome: userProfile.data().nome,
                avatarUrl: userProfile.data().avatarUrl,
                email: value.user.email,
            }
            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
            toast.success("Bem-vindo de volta!!");
            
        }).catch((error)=>{
           // alert("Erro de autenticação!");
            console.log(error);
            toast.error("Ops, erro de autenticação!");
            setLoadingAuth(false);
        });
        setLoadingAuth(false);
    }

    async function signUp(name, email, pass){
        
        setLoadingAuth(true);
        await firebase.auth().createUserWithEmailAndPassword(
            email, pass
        ).then( async function (firebaseUser){
            
            let uid = firebaseUser.user.uid;
            
            await firebase.firestore().collection("users")
            .doc(uid)
            .set({
                nome: name,
                avatarUrl: null,
            }).then( () => {
                
                let data = {
                    uid: uid,
                    nome: name,
                    email: email,
                    avatarUrl: null,
                };
                setUser(data);
                storageUser(data);
                setLoadingAuth(false);
                toast.success("Bem-vindo a plataforma!");
                alert("Cadastrado!");
            }).catch((error)=>{
                
                alert("Erro ao salvar os dados no banco de dados!");
                console.log(error);
                setLoadingAuth(false);
            });
            
        }).catch((error)=>{
            
            alert("Erro ao cadastrar!");
            console.log(error);
            toast.error("Ops, algo deu errado!");
            setLoadingAuth(false);            
        });
        
        setLoadingAuth(false);
    }

    async function signOut(){
        await firebase.auth().signOut();
        localStorage.removeItem("SistemaUser");
        setUser(null);
    }


    function storageUser(data){
        localStorage.setItem("SistemaUser", JSON.stringify(data));
    }


    return(
        <AuthContext.Provider value={{ signed: !!user, user, loading, signUp, signOut, signIn, loadingAuth, setUser, storageUser}}>
            {children}
        </AuthContext.Provider>
    );

}