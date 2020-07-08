import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { PacienteInterface } from '../interfaces/paciente';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  pinterface : PacienteInterface
  pcollection   : AngularFirestoreCollection<PacienteInterface>;
  pdocument     : AngularFirestoreDocument<PacienteInterface>;
  pobject       : Observable<PacienteInterface[]>;
  mod: any = {};

  constructor(private afs: AngularFirestore) { 
  this.pcollection =  this.afs.collection('Pacientes', ref => ref)
}
addnew(value){  
  var x = this.afs.collection('Pacientes', ref => ref.where('curp','==',value.curp)).doc(value.folio).get().subscribe( qu => {
    if(qu.exists == true){
      alert('Paciente ya registrado')
    }
    else{
      this.pcollection.doc(value.folio).set(value);
    }
  })
}



}
