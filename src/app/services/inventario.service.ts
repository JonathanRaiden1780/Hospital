import { Injectable } from '@angular/core';
import { MedicamentosInterface } from '../interfaces/medicamentos';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { map, take } from 'rxjs/operators';

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
    this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).collection('Inventario').doc(medicamentosi.caducidad).update({existencia: firebase.firestore.FieldValue.increment(x)});
    this.afs.collection('InventarioGeneral').doc(medicamentosi.nombre+medicamentosi.presentacion+'_'+medicamentosi.lote).update({existencia: firebase.firestore.FieldValue.increment(x)});
    this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).collection('Inventario').doc(medicamentosi.caducidad).collection('Existencia').doc(medicamentosi.lote).update({existencia: firebase.firestore.FieldValue.increment(x)});    
  }
  salida(medicamentosi,x){
    if(x <= medicamentosi.existencia)
    {
      if(x < medicamentosi.existencia){
        console.log('es menor')
        this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).update({existencia: firebase.firestore.FieldValue.increment(-x)});
        this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).collection('Inventario').doc(medicamentosi.caducidad).update({existencia: firebase.firestore.FieldValue.increment(-x)});
        this.afs.collection('InventarioGeneral').doc(medicamentosi.nombre+medicamentosi.presentacion+'_'+medicamentosi.lote).update({existencia: firebase.firestore.FieldValue.increment(-x)});
        this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).collection('Inventario').doc(medicamentosi.caducidad).collection('Existencia').doc(medicamentosi.lote).update({existencia: firebase.firestore.FieldValue.increment(-x)});    
      }
      else{
        this.deletemed(medicamentosi)
      }
    }
    else{
      alert('No hay suficiente en stock')
    }
  }
  addmed(medicamentosi){
    medicamentosi.precio = '$'+medicamentosi.precio;
     var docref = this.afs.collection('Medicamentos').doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).collection('Inventario').doc(medicamentosi.caducidad).collection('Existencia').doc(medicamentosi.lote);
    docref.get().subscribe( doc =>{
      if(doc.exists == true){
         alert('Registro duplicado') 
      }
      else{
        var docref = this.afs.collection('Medicamentos').doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).collection('Inventario').doc(medicamentosi.caducidad);
        docref.get().subscribe( doc =>{
          if(doc.exists == true){
             console.log('existe')
             this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).update({existencia: firebase.firestore.FieldValue.increment(medicamentosi.existencia)});
             this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).collection('Inventario').doc(medicamentosi.caducidad).update({existencia: firebase.firestore.FieldValue.increment(medicamentosi.existencia)})
             this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).collection('Inventario').doc(medicamentosi.caducidad)
             .collection('Existencia').doc(medicamentosi.lote).set(medicamentosi).catch(x=>{
             return console.log(x)
             }) 
             this.afs.collection('InventarioGeneral').doc(medicamentosi.nombre+medicamentosi.presentacion+'_'+medicamentosi.lote).set(medicamentosi).catch(x=>{
              return console.log(x)
            }) 
          }
          else{
            var docref = this.afs.collection('Medicamentos').doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion);
            docref.get().subscribe( doc =>{
              if(doc.exists == true){
                 console.log('existe')
                 this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).update({existencia: firebase.firestore.FieldValue.increment(medicamentosi.existencia)});
                 this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).collection('Inventario').doc(medicamentosi.caducidad).set({existencia: medicamentosi.existencia})
                 this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).collection('Inventario').doc(medicamentosi.caducidad)
                 .collection('Existencia').doc(medicamentosi.lote).set(medicamentosi).catch(x=>{
                 return console.log(x)
                 }) 
                 this.afs.collection('InventarioGeneral').doc(medicamentosi.nombre+medicamentosi.presentacion+'_'+medicamentosi.lote).set(medicamentosi).catch(x=>{
                  return console.log(x)
                }) 
              }
              else{
                console.log('no existe')
                this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).set({existencia: medicamentosi.existencia})
                this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).collection('Inventario').doc(medicamentosi.caducidad).set({existencia: medicamentosi.existencia})
                this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).collection('Inventario').doc(medicamentosi.caducidad)
                .collection('Existencia').doc(medicamentosi.lote).set(medicamentosi).catch(x=>{
                return console.log(x)
                }) 
                this.afs.collection('InventarioGeneral').doc(medicamentosi.nombre+medicamentosi.presentacion+'_'+medicamentosi.lote).set(medicamentosi).catch(x=>{
                  return console.log(x)
                }) 
              }
            }) 
          }
        }) 
      }
    })   
  }
  updatemed(medicamentosi,medicamentosi2){
    if(medicamentosi.compuesto != medicamentosi2.compuesto || medicamentosi.nombre != medicamentosi2.nombre || medicamentosi.presentacion != medicamentosi2.presentacion || medicamentosi.caducidad != medicamentosi2.caducidad || medicamentosi.lote != medicamentosi2.lote){
      console.log('algun pivote principal')
         this.deletemed(medicamentosi)
         this.addmed(medicamentosi2)
    }
    else{
      this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).collection('Inventario').doc(medicamentosi.caducidad)
      .collection('Existencia').doc(medicamentosi.lote).update(medicamentosi2).then(x => {
        console.log('correcto')
      })
      .catch(x=>{
        console.log(x)
      })
      this.afs.collection('InventarioGeneral').doc(medicamentosi.nombre+medicamentosi.presentacion+'_'+medicamentosi.lote).update(medicamentosi).then(x=>{
        console.log('correcto')
      })
      .catch(x=>{
        console.log(x)
      }) 
    }
  }
  deletemed(medicamentosi){
    this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).update({existencia: firebase.firestore.FieldValue.increment(-medicamentosi.existencia)});
    this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).collection('Inventario').doc(medicamentosi.caducidad).update({existencia: firebase.firestore.FieldValue.increment(-medicamentosi.existencia)});
    this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).collection('Inventario').doc(medicamentosi.caducidad)
    .collection('Existencia').doc(medicamentosi.lote).delete().then(x => {
      console.log('correcto')
    })
    .catch(x=>{
      return console.log(x)
    }); 
    this.afs.collection('InventarioGeneral').doc(medicamentosi.nombre+medicamentosi.presentacion+'_'+medicamentosi.lote).delete().then(x => {
    })
    .catch(x=>{
      return console.log(x)
    }); 
  }
  getAll(): Observable<MedicamentosInterface[]> {
    this.mobject = this.mcollection2.snapshotChanges()
    .pipe(map(changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as MedicamentosInterface;
       // data.lote = action.payload.doc.id;
        return data;
      });
    }));
    return this.mobject;
  }
/* 
cont2(x:ContadorInterface){
  this.contadorreal = <number><any>x.contador;
}

  gettotal(x: MedicametosInterface) {
    this.mcollection.doc(medicamentosi.compuesto).collection(medicamentosi.nombre).doc(medicamentosi.presentacion).update({existencia: firebase.firestore.FieldValue.increment(-medicamentosi.existencia)});

    this.afs.collection('type').doc('Viga').collection(this.fechareporte).doc('contestadas').valueChanges().pipe(take(1)).subscribe(res => {this.cont2(res); });      
  } */
}
