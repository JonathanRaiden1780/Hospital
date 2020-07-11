import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { LocalDataSource, DefaultEditor, Ng2SmartTableComponent } from 'ng2-smart-table';
import { InventarioService } from 'src/app/services/inventario.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgModel } from '@angular/forms';
import { FilterDefault } from 'ng2-smart-table/lib/components/filter/filter-default';
import { DateEditorComponent, PrecioEditorComponent, skuEditorComponent, StockEditorComponent } from "../medicamentos/medicamentos.component";
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import pdfMake from "pdfmake";
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { HistorialService } from 'src/app/services/historial.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { PacienteInterface } from 'src/app/interfaces/paciente';
import { take } from 'rxjs/operators';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-receta',
  templateUrl: './receta.component.html',
  styleUrls: ['./receta.component.css']
})
export class RecetaComponent implements OnInit {
  folio:  string;
  estatura: string;
  peso: string;
  adicional:string;
  rpm: string;
  mmhg : string;
  rrp: string;
  temperatura: string;
  alergias: string;
  sintomas: string;
  contador: number
  elements: any = [
    {Nombre: '',Compuesto:'',Presetacion:'',Dosis:'',Frecuencia:'', Dias:''  }
  ];

  @ViewChild('contentpdf', { 'static': true }) content:ElementRef;

  settings2= {
    columns:{},
    hideHeader: false,
    hideSubHeader: false,
    actions: {
      columnTitle: 'Agregar',
      add: false,
      edit: false,
      delete: false,
      custom:[
        {
      name: 'agreagar',
      title: '<i class="fas fa-plus" title="entrada"></i>'
    }
      ],
      position: 'right', // left|right
    },
    delete:{
      deleteButtonContent: '<i class="far fa-trash-alt" title="delete"></i>'
    },
    noDataMessage: 'Agregue medicamento',
  }
  
  settings = {
    columns:{},
    hideSubHeader: true,
    actions: {
      columnTitle: 'Acciones',
      add: false,
      edit: true,
      delete: true,
      custom: [],
      position: 'right', // left|right
    },
    edit:{
      editButtonContent: '<i class="fa fa-pen" title="Edit"></i>'
    },
    delete:{
      deleteButtonContent: '<i class="far fa-trash-alt" title="delete"></i>'
    },
    mode: 'inline'
  }
  
  tableset:any = {...this.settings2}
  tableconfi:any = {...this.settings}
  source: LocalDataSource;

  sourcetable: LocalDataSource;
  
  
  constructor( 
   private medservice:InventarioService, private hservice:HistorialService,
   config: NgbModalConfig, private modalService: NgbModal, private afs: AngularFirestore
   ) { 
     this.contador = 0;
     config.backdrop = 'static';
     config.keyboard = false; 
     this.visiblepdf = true;
     this.visiblelogo = true;
    }
lleno: boolean;
modalname:string;  
query(x){
this.modalService.open(x, {size: 'lg'})
this.modalname = x;
}
contenededor: any[] = [{}]
onCustomAction(event) {
  var x = event.data;
  this.contenededor[this.contador] = x;
  this.contador++;
  console.log(this.contenededor)
  this.sourcetable = this.contenededor as any;
  this.modalService.dismissAll()
  this.modalService.open(this.modalname, {size: 'lg'})
}
add(){
  this.lleno =  true
  this.elements = this.sourcetable;
}

  ngOnInit(): void {
    this.medservice.getAll().subscribe(x=> this.source = x as any) 

    this.tableset.columns = {
      nombre:{
        title:'Nombre Medicamento',
        type: 'string',
      },
      compuesto:{
        title:'Compuesto',
        type: 'string',
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
    
    this.tableconfi.columns = {
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
      Dosis:{
        title:'Dosis',
        type:'string'
      },
      Frecuencia:{
        title:'Horas',
        type:'string'
      },
      Dias:{
        title:'Dias',
        type:'string'
      },
    
    }
    
  }
  generatePdf(){
    const div = document.getElementById('contentpdf');
    const options = {
      background: 'white',
      scale: 3
    };

    html2canvas(div, options).then((canvas) => {

      var img = canvas.toDataURL("image/PNG");
      var doc = new jsPDF('l', 'mm', 'a4', 1);

      // Add image Canvas to PDF
      const bufferX = 20;
      const bufferY = 25;
      const imgProps = (<any>doc).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');

      return doc;
    }).then((doc) => {
      doc.save('postres.pdf');  
    });
   }
  
visiblepdf: boolean
visiblelogo:boolean
nombre:string;
edad: number;
curp:string
correo:string;
telefono:string;
foliop:string;
  onSubmit(){
    this.visiblepdf = false;
    this.visiblelogo = true;
    this.generatePdf()

  }
  user:any
  searchpaci(x){
    this.afs.collection('Pacientes').doc(x).valueChanges().pipe((take(1))).subscribe(querys => {
      this.detalles(querys as any)
    })
   }
   detalles(x: PacienteInterface){
       this.user = x;
       this.nombre = x.nombre + ' ' + x.apaterno + '' + x.amaterno;
       var año = +x.fnacimiento.slice(6) 
       const actual = new Date().getFullYear()
        this.edad = actual - año;
       console.log(año, actual)
   }
  quest: string
  ca: FilterDefault
  
}
