import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from "@angular/fire/firestore";
import { RegistroInterface } from "../interfaces/registro";
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from "rxjs/operators"
;
@Injectable({
  providedIn: 'root'
})
export class AuthService {
private user: Observable<firebase.User | null>;
registroCollection: AngularFirestoreCollection<RegistroInterface>
registroDoc: AngularFirestoreDocument<RegistroInterface>;
registro: Observable<RegistroInterface>
id: string;
  constructor(
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore) 
  {
    this.user = afAuth.authState;
    this.registroCollection = afs.collection('Registro', ref => ref); 
  }
  registeruser(email: string, pass: string): Promise<firebase.auth.UserCredential> {
    return new Promise((resolve , reject) => {
      this.afAuth.createUserWithEmailAndPassword(email, pass)
      .then( userData => resolve(userData),
      err => reject (err));
    });
  }
  deleteregistro(registro: RegistroInterface) {
    this.registroDoc = this.afs.doc('Registro/' + registro.id);
    this.registroDoc.delete();
  }
   updateregistro(registro: RegistroInterface) {
      this.registroDoc = this.afs.doc('Registro/' + registro.id);
      this.registroDoc.update(registro);
    }
  addregistro(registro: RegistroInterface) {
    this.registroCollection.doc(registro.id).set(registro);
  }
  loginEmail(email: string, pass: string) {
    return new Promise((resolve , reject) => {
      this.afAuth.signInWithEmailAndPassword(email, pass)
      .then( userData => resolve(userData),
      err => reject (err));
    });
  }
  getAuth() {
    return this.afAuth.authState.pipe(map(auth => auth));
  }
  getid(): string {
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        return this.id = user.email;
      }
    });
    return this.id;
  }
  getUserData( data: any) {
    return this.registroCollection.doc(data).valueChanges();
  }
  getcurrentUser(): Observable<firebase.User | null> {
    return this.user;
  }
  logout() {
    return this.afAuth.signOut();
  }
  getUser(id: string) {
      this.registroDoc = this.afs.doc<RegistroInterface>('Registro/' + id);
      this.registro = this.registroDoc.snapshotChanges().pipe(map(action => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data() as RegistroInterface;
          data.id = action.payload.id;
        }
      }));
    }


}
