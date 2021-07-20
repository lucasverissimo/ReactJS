import firebase from "../services/firebaseConfig";

import DatabaseConnection from "./DatabaseConnection";

export default class FilesManager{
    
    constructor(namePath, nameFolder, nameFile, id = null, messageReturn = ''){
        this.namePath = namePath;
        this.nameFolder = nameFolder;
        this.nameFile = nameFile;
        this.id = id;
        this.messageReturn = messageReturn;
    }

    async uploadImage(file, funcCallback, nameCollection = null){
        let _this = this;
        
        await firebase.storage()
        .ref(_this.namePath+'/'+_this.nameFile)
        .put(file)
        .then( async ()=>{            

            await firebase.storage()
            .ref(_this.namePath+'/')
            .child(_this.nameFile)
            .getDownloadURL()
            .then(async (url)=>{                
                if(_this.id !== null && nameCollection !== null){                
                    const db = new DatabaseConnection(nameCollection);                
                    let data = {
                        id: _this.id,
                        nomeImagem: _this.nameFile,
                        imagem: url,
                    }
                    await db.updateDocument(data).then((value)=>{
                        funcCallback(value, url);
                    });
    
                }else{
                    funcCallback(url);                
                }

            }).catch((error)=>{
                alert("Erro ao capturar URL da imagem!");
                console.log(error);
            });
            
        }).catch((error)=>{
            alert("Erro ao fazer upload da imagem, verifique o log de erros!");
            console.log(error);
            return null;
        });
    }

    async deleteDirectory(callBackFunction){
        await firebase.storage().ref(this.namePath+'/')
        .child(this.nameFile)
        .delete()
        .then(async (value)=>{
            await callBackFunction(value);
        });
    }

}

