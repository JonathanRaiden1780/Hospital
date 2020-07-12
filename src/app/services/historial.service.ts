import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { PacienteInterface } from '../interfaces/paciente';
import { Observable } from 'rxjs';
import { map,take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  pinterface : PacienteInterface
  pcollection   : AngularFirestoreCollection<PacienteInterface>;
  pscollection   : AngularFirestoreCollection<PacienteInterface>;
  ccollection   : AngularFirestoreCollection<PacienteInterface>;
  pdocument     : AngularFirestoreDocument<PacienteInterface>;
  pobject       : Observable<PacienteInterface[]>;
  pobject2      : Observable<PacienteInterface[]>;
  mod: any = {};

  constructor(private afs: AngularFirestore) { 
  this.pcollection =  this.afs.collection('Pacientes', ref => ref)
  this.ccollection =  this.afs.collection('Citas', ref => ref)
  
}
validarcitas(val,date){
  var paciente = this.afs.collection('Pacientes').doc(val.title).get().subscribe( doc => {
    if(!doc.exists){
      alert('Paciente no registrado')
    }
    else{
      console.log('no esta duplicado')
      var slicefecha = date.slice(0,15)
      var paciente = this.afs.collection('Pacientes').doc(val.title).collection('Citas').doc(slicefecha).get().subscribe( doc => {
        if(!doc.exists){
          this.pcollection.doc(val.title).collection('Citas').doc(slicefecha).set({start:date, fecha: date, detalles: val.detalles, 
            color: val.color, draggable: val.draggable, resizable: val.resizable, title: val.title, end: date});
            this.ccollection.doc(slicefecha).set({start:date, fecha: date, detalles: val.detalles, 
              color: val.color, draggable: val.draggable, resizable: val.resizable, title: val.title, end: date});
        }
        else{
          alert('El Paciente ya tiene una cita programada para ese día')
        }
      })
    }
  })
}
getusuario(nom: string):Observable<PacienteInterface[]>{
  this.pscollection = this.afs.collection('Pacientes', ref => ref.where("folio","==",nom.toString()));
  this.pobject2 = this.pscollection.snapshotChanges()
  .pipe(map(changes => {
    return changes.map(action => {
      const data = action.payload.doc.data() as PacienteInterface;
      //data.id = action.payload.doc.id;
      return data;
    });
  }));
  return this.pobject2;
}
delete(val){
  var fecha = val.start.toString()
 var slicefecha = fecha.slice(0,15)
  this.pcollection.doc(val.title).collection('Citas').doc(slicefecha).delete()
    this.ccollection.doc(slicefecha).delete() 
}
getAll(): Observable<PacienteInterface[]> {
  this.pobject = this.ccollection.snapshotChanges()
  .pipe(map(changes => {
    return changes.map(action => {
      const data = action.payload.doc.data() as PacienteInterface;
      
      data.id = action.payload.doc.id;
      return data;
    });
  }));
  return this.pobject;
}
addcita(val){
  this.afs.collection('Pacientes').doc(val.folio).collection('Recetas').doc(val.id).set(val)
}
getreceta(x): Observable<PacienteInterface[]> {
  this.pobject = this.afs.collection('Pacientes').doc(x).collection('Recetas').snapshotChanges()
  .pipe(map(changes => {
    return changes.map(action => {
      const data = action.payload.doc.data() as PacienteInterface;
      
      data.id = action.payload.doc.id;
      return data;
    });
  }));
  return this.pobject;
}

addnew(value){  
  var x = this.afs.collection('Pacientes')
    .valueChanges().pipe(take(1)).subscribe(dat => {this.getvalidate(dat,value)
  })
}
getvalidate(x,y){
 var valcurp =  x.find(que => que.curp === y.curp )
 var valfolio =  x.find(que => que.folio === y.folio )

 if(valcurp == undefined &&  valfolio == undefined){
   this.pcollection.doc(y.folio).set(y);
 }
 else{
   alert('Registro duplicado')
 }
 
}



}
