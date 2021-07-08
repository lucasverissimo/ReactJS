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

        await firebase.storage()
        .ref(this.namePath+'/'+this.nameFolder+'/'+this.nameFile)
        .put(file)
        .then( async ()=>{            

            await firebase.storage()
            .ref(this.namePath+'/'+this.nameFolder+'/')
            .child(file.name)
            .getDownloadURL()
            .then(async (url)=>{

                if(this.id !== null && nameCollection !== null){                
                    const db = new DatabaseConnection(nameCollection);                
                    let data = {
                        id: this.id,
                        imagem: url,
                    }
                    await db.updateDocument(data).then((value)=>{
                        funcCallback(value);
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

}

