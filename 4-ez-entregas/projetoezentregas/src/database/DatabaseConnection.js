import firebase from '../services/firebaseConfig';

export default class DatabaseConnection {
 
  constructor(collection){
    this.ref = firebase.firestore().collection(collection);
  }


  async getDocument(id){
    let result = await this.ref
    .doc(id)
    .get().then((data)=>{
      return data.data();      
    }).catch((error)=>{
      alert("Erro ao buscar documento, consulte o log de erros!");
      console.log(error.message);
      return null;
    });

    return result;
  }

  async getListDocuments(numItems = 5, fieldOrderBy = null, orderByValue = 'asc', whereField = null, whereValue = null){

    let ref = this.ref;

    if(whereField !== null && whereValue !== null){
      ref = ref.where(whereField, "==", whereValue);
    }

    if(fieldOrderBy !== null){
      ref = ref.orderBy(fieldOrderBy, orderByValue);
    }    

    let result = await ref.limit(numItems)
    .get()    
    .then((snapshot)=>{
      let lista = [];
      snapshot.forEach((doc)=>{        
        lista.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return lista;

    }).catch((error)=>{
      alert("Erro ao carregar lista, verifique o log de erros!");
      console.log(error);
      return [];
    });

   return result;
  }

  async newUser(data){
    let result = await firebase.auth()
    .createUserWithEmailAndPassword(data.email, data.senha)
    .then(async (firebaseUser)=>{
      let uid = firebaseUser.user.uid;
      let newData = {
        id: uid,
        ...data
      };
      return await this.newDocument(newData);
    }).catch((error)=>{
      alert("Erro ao criar usuário - verifique o log e tente novamente!")
      return error;
    });
    return result;
  }

  async updateUser(data){
    // Ask signed in user for current password.

    if(typeof data.senha !== 'undefined'){      
      const currentPass = data.senhaAtual;
      const emailCred  = firebase.auth.EmailAuthProvider.credential(
      firebase.auth().currentUser, currentPass);
      let result = firebase.auth().currentUser.reauthenticateWithCredential(emailCred)
      .then(async () => {
        // User successfully reauthenticated.
        const newPass = data.senha;
        await firebase.auth().currentUser.updatePassword(newPass)
        .then((value)=>{
          let info = {
            nome: data.nome,
            ativo: data.ativo,
          };
          return  this.updateDocument(info);
        }).catch((error)=>{
          alert("Erro ao alterar usuário!");
          return error;
        });
      })
      .catch(error => {
        alert("Erro ao autenticar!");
        console.log(error);
      });

      return result;
    }else{
      return this.updateDocument(data);
    }
  }

  async newDocument(data){

    let ref;
    if(typeof data.id !== 'undefined'){
        ref = this.ref.doc(data.id).set(data);
    }else{
        ref = this.ref.add(data);
    }


    let result = await ref.then((value)=>{
      return value;
    }).catch((error)=>{
      console.log(error);
      return false;
    });

    return result;
  }

  async updateDocument(data){
    
    let result = await this.ref
    .doc(data.id)
    .update(data)
    .then((value)=>{
      return true;
    }).catch((error)=>{
      alert("Erro ao alterar dados no firestore!");
      return error;
    });

    return result;
  }

  async deleteDocument(id){
    let result = await this.ref.doc(id).delete()
    .then((value)=>{
      console.log(value);
      return true;;
    }).catch((error)=>{
      alert("Erro ao deletar, consulte o log de erros!");
      console.log(error);
      return error;
    });
    return result;
  }
  
  
}