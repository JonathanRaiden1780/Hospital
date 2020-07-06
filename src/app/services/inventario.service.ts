import { Injectable } from '@angular/core';
import { MedicamentosInterface } from '../interfaces/medicamentos';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  medicamentosi : MedicamentosInterface
  mcollection   : AngularFirestoreCollection<MedicamentosInterface>;
  mcollection2  : AngularFirestoreCollection<MedicamentosInterface>;
  mdocument     : AngularFirestoreDocument<MedicamentosInterface>;
  mobject       : Observable<MedicamentosInterface[]>;
  mod: any = {};

  constructor(private afs: AngularFirestore) { 
    this.mcollection = afs.collection('Medicamentos', ref => ref);
    this.mcollection2 = afs.collection('InventarioGeneral', ref => ref);
    const today = new Date();
    this.mod.fecha = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);

  }
  entrada(medicamentosi,x){
    this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).update({existencia: firebase.firestore.FieldValue.increment(x)});
    this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).collection(medicamentosi.caducidad).doc('Inventario').update({existencia: firebase.firestore.FieldValue.increment(x)});
    this.afs.collection('InventarioGeneral').doc(medicamentosi.lote).update({existencia: firebase.firestore.FieldValue.increment(x)});
  }
  salida(medicamentosi,x){
    this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).update({existencia: firebase.firestore.FieldValue.increment(-x)});
    this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).collection(medicamentosi.caducidad).doc('Inventario').update({existencia: firebase.firestore.FieldValue.increment(-x)});
    this.afs.collection('InventarioGeneral').doc(medicamentosi.lote).update({existencia: firebase.firestore.FieldValue.increment(x)});
  }
  addmed(medicamentosi):boolean{
    var res :boolean;
    var lote : string;
    res = true;
    medicamentosi.precio = '$'+medicamentosi.precio;
    lote = medicamentosi.lote as string;
    
    console.log(medicamentosi.lote)
    this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).collection(medicamentosi.caducidad).doc('Inventario')
    .collection('Existencia').doc(medicamentosi.lote).set(medicamentosi).catch(x=>{
     return res = false;
   }) 
   this.afs.collection('InventarioGeneral').doc(medicamentosi.lote).set(medicamentosi).catch(x=>{
    return res = false;
  }) 
     var docref = this.afs.collection('Medicamentos').doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion);
    docref.get().subscribe( doc =>{
      if(doc.exists == true){
         console.log('exuiste')
        this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).update({existencia: firebase.firestore.FieldValue.increment(medicamentosi.existencia)});
        this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).collection(medicamentosi.caducidad).doc('Inventario').update({existencia: firebase.firestore.FieldValue.increment(medicamentosi.existencia)});
       }
      else{
        console.log('no existe')
        this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).set({existencia: medicamentosi.existencia})
        this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).collection(medicamentosi.caducidad).doc('Inventario').set({existencia: medicamentosi.existencia})
      }
    })   
    
   return res;
  }
  updatemed(medicamentosi,medicamentosi2):boolean{
    var res : boolean;
    res = false
    var cambios : number
    if(medicamentosi.compuesto != medicamentosi2.compuesto || medicamentosi.nombre != medicamentosi2.nombre || medicamentosi.presentacion != medicamentosi2.presentacion || medicamentosi.caducidad != medicamentosi2.caducidad || medicamentosi.lote != medicamentosi2.lote){
      console.log('algun pivote principal')
      if(this.deletemed(medicamentosi)){
        if(this.addmed(medicamentosi2)){
          res = true;
        }
        else{
          res = false;
        }
      }
      else{
        res = false;
      }
    }
    else{
      this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).collection(medicamentosi.caducidad).doc('Inventario')
      .collection('Existencia').doc(medicamentosi.lote).update(medicamentosi2).then(x => {
        console.log('correcto')
        res = true;
      })
      .catch(x=>{
         res = false;
      })
      this.afs.collection('InventarioGeneral').doc(medicamentosi.lote).update(medicamentosi).then(x=>{
         res = true;
      })
      .catch(x=>{
         res = false;
      }) 
       res = false
    }
    console.log(res)
    return res
  }
  deletemed(medicamentosi):boolean{
    var res : boolean;
    this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).update({existencia: firebase.firestore.FieldValue.increment(-medicamentosi.existencia)});
    this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).collection(medicamentosi.caducidad).doc('Inventario').update({existencia: firebase.firestore.FieldValue.increment(-medicamentosi.existencia)});

    this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).collection(medicamentosi.caducidad).doc('Inventario')
    .collection('Existencia').doc(medicamentosi.lote).delete().then(x => {
      return res = true;
    })
    .catch(x=>{
      return res = false;
    })
    this.afs.collection('InventarioGeneral').doc(medicamentosi.lote).delete().then(x => {
      return res = true;
    })
    .catch(x=>{
      return res = false;
    })
    return res
  }
  getAll(): Observable<MedicamentosInterface[]> {
    this.mobject = this.mcollection2.snapshotChanges()
    .pipe(map(changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as MedicamentosInterface;
        data.lote = action.payload.doc.id;
        return data;
      });
    }));
    return this.mobject;
  }
}
