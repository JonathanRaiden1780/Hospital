import { Component, OnInit, Type } from '@angular/core';
import { MedicamentosInterface } from "../../interfaces/medicamentos";
import { Ng2SmartTableComponent, LocalDataSource, DefaultEditor } from "ng2-smart-table";
import { InventarioService} from '../../services/inventario.service'


@Component({
  selector: 'app-medicamentos',
  templateUrl: './medicamentos.component.html',
  styleUrls: ['./medicamentos.component.css']
})
export class MedicamentosComponent implements OnInit {
  settings = {
    columns:{},
    actions:{
      custom:[
        {
      name: 'entrada',
      title: '<i class="fas fa-dolly" title="entrada"></i>'
    },
    {
      name: 'salida',
      title: '<i class="fas fa-shipping-fast" title="sailda"></i><br></br>'
    }
      ]
    },
    add:{
      confirmCreate:true,
      addButtonContent:'<i class="fa fa-plus" style="font-size:32px"></i>',
      createButtonContent:'<i class="fa fa-check" style="font-size:32px">add</i><br></br>',
      cancelButtonContent:'<i class="fa fa-times" style="font-size:32px">cancel</i>'
    },
    edit:{
      editButtonContent: '<i class="fa fa-pen" style="font-size:32px"></i>',
      saveButtonContent: '<i class="fa fa-check" style="font-size:32px">add</i>',
      cancelButtonContent: '<i class="fa fa-times" style="font-size:32px">cancel</i>',
      confirmSave:true
    },
    delete:{
      confirmDelete:true,
      deleteButtonContent: '<i class="far fa-trash-alt" title="delete"></i>'
    },
    mode: 'inline'
  }
  
  tableset:any = {...this.settings}
  source: LocalDataSource;
  acumulador: number
  filtros: string
  source2: MedicamentosInterface[];
  constructor( 
    public medservice: InventarioService
    ){
      this.acumulador = 0
   }
   addData(event){
      this.medservice.addmed(event.newData)
       event.confirm.resolve()
       this.medservice.getAll().subscribe(x=> this.source = x as any)  
   }
  
   editData(event){
    if ( confirm('Seguro que desea editar el medicamento: ' + event.data.nombre))
    {
      this.medservice.updatemed(event.data,event.newData)   
        event.confirm.resolve();
        this.medservice.getAll().subscribe(x=> this.source = x as any) 
    }
    else{
      event.confirm.reject();
    }
   }
   deleteData(event){
    if (confirm('Seguro que desea borrar el medicamento: '+event.data.nombre+' ?'))
    {
     this.medservice.deletemed(event.data)
      event.confirm.resolve();
      this.medservice.getAll().subscribe(x=> this.source = x as any) 
    }
    
  }
  onCustomAction(event) {
    switch ( event.action) {
    case 'entrada':
    this.entradas(event.data);
    break;
    case 'salida':
    this.salidas(event.data);
    }
  }
  entradas(event){
    var e = prompt('Cuantas unidades ingresa ?');
    var t:number = +e;
    this.medservice.entrada(event, t);
  }
  salidas(event){
    var e = prompt('Cuantas unidades salen ?');
    var t:number = +e;
    this.medservice.salida(event, t);
  }
  ngOnInit(): void {

    this.medservice.getAll().subscribe(x=> this.source = x as any) 
    this.tableset.columns = {
      nombre:{
        title:'Nombre Medicamento',
        type: 'string',
        placeholder:'Tempra'
      },
      compuesto:{
        title:'Compuesto',
        type: 'string',
        placeholder:'Penicilina/Paracetamol/etc'
      },
      presentacion:{
        title:'mg/ml',
        type:'string',
        
      },
      caducidad:{
        title:'Fecha de Caducidad',
        type: 'date',
        addable: true,
        editor:{
          type:'custom',
          component: DateEditorComponent
        }
      },
      precio:{
        title:'Precio',
        type:'string',
        addable: true,
        editor:{
          type:'custom',
          component: PrecioEditorComponent
        }
      },
      lote:{
        title:'lote',
        type:'string',
        addable: true,
        editor:{
          type:'custom',
          component: skuEditorComponent
        }
      },
      existencia:{
        title:'Stock',
        type:'string',
        addable: true,
        editor:{
          type:'custom',
          component: StockEditorComponent
        }
      }
    
    }
    
  } 
  
  onUserRowSelect(event){
    this.acumulador = 0;
    var x = event.source.filteredAndSorted
    console.log(event)
    if(x.length >= 1){
      if(x.length==1){
        this.elements = [
          {existencia: x[0].existencia }
        ]
      }
      else{
        console.log('mayor a 1')
        for(var i = 0 ; i < x.length; i++){
          var s = x[i].existencia
          this.acumulador = s + this.acumulador;
          this.elements = [
            {existencia: this.acumulador }
          ]
        }
      }
    }
    else{
      console.log('no se ')
    }
    
  }
  elements: any = [
    {busqueda: '',existencia:0  }
  ];

  headElements = [' ', 'existencia'];
}

@Component({
  selector: 'input-editor',
  template: `
    <input type="string"
           [(ngModel)]="cell.newValue"
           [name]="cell.getId()"
           [placeholder]="912301"
           [disabled]="!cell.isEditable()"
           (click)="onClick.emit($event)"
           (keydown.enter)="onEdited.emit($event)"
           (keydown.esc)="onStopEditing.emit()">
    `,
})
export class skuEditorComponent extends DefaultEditor {
  constructor() {
    super();
  }
}
@Component({
  selector: 'input-editor',
  template: `
    <input type="number"
           [(ngModel)]="cell.newValue"
           [name]="cell.getId()"
           [placeholder]="10.00"
           [disabled]="!cell.isEditable()"
           (click)="onClick.emit($event)"
           (keydown.enter)="onEdited.emit($event)"
           (keydown.esc)="onStopEditing.emit()">
    `,
})
export class StockEditorComponent extends DefaultEditor {
  constructor() {
    super();
  }
}

@Component({
  selector: 'input-editor',
  template: `
     <i class="fas fa-dollar-sign fa-sm">
    <input type="string"
           [(ngModel)]="cell.newValue"
           [name]="cell.getId()"
           [placeholder]="10.00"
           [disabled]="!cell.isEditable()"
           (click)="onClick.emit($event)"
           (keydown.enter)="onEdited.emit($event)"
           (keydown.esc)="onStopEditing.emit()"
           ></i>
    `,
})
export class PrecioEditorComponent extends DefaultEditor {
  constructor() {
    super();
  }
  
}

@Component({
  selector: 'input-editor',
  template: `
    <input type="date"
           [(ngModel)]="cell.newValue"
           [name]="cell.getId()"
           [placeholder]="cell.getTitle()"
           [disabled]="!cell.isEditable()"
           (click)="onClick.emit($event)"
           (keydown.enter)="onEdited.emit($event)"
           (keydown.esc)="onStopEditing.emit()"
           required ="true">
    `,
})
export class DateEditorComponent extends DefaultEditor {
  constructor() {
    super();
  }
  
}
