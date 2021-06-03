import { useState, useContext } from 'react';
import firebase from '../../services/firebaseConnection';
import './profileStyle.css';

import Header from '../../components/Header';
import Title from '../../components/Title';

import avatar from '../../assets/avatar.png';

import { AuthContext } from '../../contexts/auth';

import { FiSettings, FiUpload } from 'react-icons/fi';

export default function Profile(){

    const { user, signOut, setUser, storageUser } = useContext(AuthContext);
    const [nome, setNome] = useState(user && user.nome);
    const [email, setEmail] = useState(user && user.email);
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imageAvatar, setImageAvatar ] = useState(null);
    const [ loadingSave, setLoadingSave ] = useState(false);

    

    function handleFile(e){
        if(e.target.files[0]){
            const image = e.target.files[0];
            if(image.type === 'image/jpeg' || image.type === 'image/png'){
                setImageAvatar(image);
                setAvatarUrl(URL.createObjectURL(image));
            }else{
                alert("Selecione imagens do tipo JPEG / PNG!");
                setImageAvatar(null);
                return null;
            }
        }
    }

    async function handleUpload(){
        setLoadingSave(true);
        const currentUid = user.uid;
        const uploadTask = await firebase.storage()
        .ref(`images/${currentUid}/${imageAvatar.name}`)
        .put(imageAvatar)
        .then( async ()=>{
            alert("Foto enviada com sucesso!");

            await firebase.storage().ref(`images/${currentUid}`)
            .child(imageAvatar.name).getDownloadURL()
            .then(async (url)=>{
                let urlFoto = url;
                await firebase.firestore().collection('users')
                .doc(user.uid)
                .update({
                    avatar: urlFoto,
                    nome: nome,
                }).then((value)=>{
                    let data = {
                        ...user,
                        nome: nome,
                        avatarUrl: urlFoto,
                    };
                    setUser(data);
                    storageUser(data);
                    setLoadingSave(false);
                }).catch((error)=>{
                    alert("Erro ao atualizar o banco de dados!");
                    console.log(error);
                    setLoadingSave(false);
                });
                setLoadingSave(false);
            }).catch((error)=>{
                console.log(error);
                alert("Erro ao gerar url da imagem!");
                setLoadingSave(false);
            });
            setLoadingSave(false);
        }).catch((error)=>{
            alert("Erro ao enviar foto!");
            console.log(error);
            setLoadingSave(false);
        });
        setLoadingSave(false);
    }

    async function handleSave(e){
        e.preventDefault();

        setLoadingSave(true);
        if(imageAvatar === null && nome !== ''){
            await firebase.firestore().collection('users')
            .doc(user.uid)
            .update({
                nome: nome
            }).then((value)=>{
                setLoadingSave(false);
                alert("Salvo com sucesso!");
                let data = {
                    ...user,
                    nome: nome
                };
                setUser(data);
                storageUser(data);
            }).catch((error)=>{
                setLoadingSave(false);
                alert("Erro ao salvar os dados, tente novamente mais tarde!");
                console.log(error);
            });
            
        }else 
        if( nome !== '' && imageAvatar !== null){
            setLoadingSave(true);            
            await handleUpload();
            setLoadingSave(false);
        }

        setLoadingSave(false);

        
    }

    return(
        <div>
            <Header />
            <div className="content">
                <Title name="Meu perfil">
                    <FiSettings size={25} />
                </Title>

                <div className="container">
                    <form className="form-profile" type="post" onSubmit={(e)=>handleSave(e)}>
                        <label className="label-avatar">
                            <span>
                                <FiUpload color="#fff" size={25} />
                            </span>
                            <input type="file" accept="image/*" onChange={handleFile} /><br/>
                            { avatarUrl === null ? (
                                <img src={avatar} width="250" height="250" alt="Foto de perfil do usuário" />
                            ) : (
                                <img src={avatarUrl} width="250" height="250" alt="Foto de perfil do usuário" />
                            )}
                        </label>

                        <label>Nome: </label>
                        <input type="text" value={nome} onChange={(e)=>setNome(e.target.value)} />

                        <label>E-mail: </label>
                        <input type="text" value={email} disabled={true} />
                        { loadingSave === false ? (
                            <button type="submit" className="btnSalvar">Salvar</button>
                        ) : (
                            <a href="#" className="logout-btn">Salvando alterações...</a>
                        )}
                        
                    </form>
                </div>
                <div className="container">
                    <button className="logout-btn" onClick={()=>signOut()}>Sair</button>
                </div>

            </div>
        </div>
    );
}