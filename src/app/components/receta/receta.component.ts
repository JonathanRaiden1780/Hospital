import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { LocalDataSource, DefaultEditor, Ng2SmartTableComponent } from 'ng2-smart-table';
import { InventarioService } from 'src/app/services/inventario.service';
import { NgbModal, NgbModalConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgModel } from '@angular/forms';
import { FilterDefault } from 'ng2-smart-table/lib/components/filter/filter-default';
import { DateEditorComponent, PrecioEditorComponent, skuEditorComponent, StockEditorComponent } from "../medicamentos/medicamentos.component";
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { RecetaInterface } from "../../interfaces/receta";
import pdfMake from "pdfmake";
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { HistorialService } from 'src/app/services/historial.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { PacienteInterface } from 'src/app/interfaces/paciente';
import { take } from 'rxjs/operators';
import { RegistroInterface } from 'src/app/interfaces/registro';
import { AuthService } from 'src/app/services/auth.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-receta',
  templateUrl: './receta.component.html',
  styleUrls: ['./receta.component.css']
})
export class RecetaComponent implements OnInit {
  user:any
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
  contador: number;
  contadorp: number;
  visiblepdf: boolean
  visiblelogo:boolean
  nombre:string;
  edad: number;
  curp:string
  correo:string;
  telefono:string;
  foliop:string;
  medico: string;
  cedula: string;
  clinica: string;
  fechaactual: string;
  historial: any[]
  elements: any = [
    {Nombre: '',Compuesto:'',Presetacion:'',Dosis:'',Frecuencia:'', Dias:''  }
  ];
  @ViewChild('contentpdf', { 'static': true }) content:ElementRef;
  settings2= {
    columns:{},
    pager:{
      perPage:1
    },
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
      confirmDelete:true,
      deleteButtonContent: '<i class="far fa-trash-alt" title="delete"></i>'
    },
    mode: 'inline'
  }
  tableset:any = {...this.settings2}
  tableconfi:any = {...this.settings}
  source: LocalDataSource;
  lleno: boolean;
  modalname:string; 
  sourcetable: LocalDataSource;
  prescripcion:any[] = [{}];
  contenededor: any[] = [{}];
  idunique: string;
  
  constructor( 
   private medservice:InventarioService, private hservice:HistorialService,
   config: NgbModalConfig, private modalService: NgbModal, private afs: AngularFirestore,
   private authService : AuthService
   ) {
      var day = new Date().getDay()
      var dia = ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo']
      var nday = new Date().getDate()
      var month = new Date().getMonth();
      var mes = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
      var año = new Date().getFullYear();
      this.fechaactual = dia[day-1]+' '+ nday + ' de ' + mes[month]+ ' de '+ año; 
      var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      function randstr(prefix)
      {
        return Math.random().toString(36).replace('0.',prefix || '');
      }
      this.idunique = randstr('id')+randLetter + Date.now();
     this.contador = 0;
     this.contadorp = 0;
     config.backdrop = 'static';
     config.keyboard = false; 
     this.visiblepdf = true;
     this.visiblelogo = true;
     this.authService.getAuth().subscribe(user => {
      if(user)  {
        this.authService.getUserData(user.email).subscribe((info:RegistroInterface) =>{
          this.medico = info.nombre+ ' ' + info.apaterno;
          this.cedula = info.cedula;
          this.clinica = info.clinica
          console.log(this.nombre)
        })
      }
     })
    }
 
query(x){
this.modalService.open(x, {size: 'lg'})
this.modalname = x;
}
onCustomAction(event) {
  var x = event.data;
  const comp = this.alergias.slice(1);
  if(this.contador == 0 )
  {
    if(x.compuesto.search(comp) == 1 ){
    alert('Paciente es alergico al medicamento')
    }
    else{
    this.contenededor[this.contador] = x;
    this.contenededor[this.contador].row = this.contador;
    console.log(this.contenededor)
    this.sourcetable = this.contenededor as any;
    this.contador++;
    this.modalService.dismissAll()
    this.modalService.open(this.modalname, {size: 'lg'})
    }
  }
  else{
    if (x.nombre == this.sourcetable[this.contador-1].nombre) {
      alert('Medicamento ya recetado')
    }
    else{
      this.contenededor[this.contador] = x;
      this.contenededor[this.contador].row = this.contador;
    console.log(this.contenededor)
      this.sourcetable = this.contenededor as any;
      this.contador++;
      this.modalService.dismissAll()
      this.modalService.open(this.modalname, {size: 'lg'})
    }
  } 
}
add(){ 
  this.lleno =  true
  this.prescripcion[this.contadorp] = this.sourcetable[this.contadorp].nombre + ' ' + this.sourcetable[this.contadorp].compuesto+ ' ' + this.sourcetable[this.contadorp].presentacion+ ' Tomar ' + this.sourcetable[this.contadorp].Dosis + ' cada ' + this.sourcetable[this.contadorp].Frecuencia + ' horas durante ' + this.sourcetable[this.contadorp].Dias + ' días ';
  this.contadorp++;
  this.elements = this.prescripcion;
}
viewhistory(){
  this.hservice.getreceta(this.folio).subscribe( x => {
    this.historial = x
  })
  console.log(this.historial)
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
      numero:{
        title:'',
        type: 'string',
      },
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
      allowtaint: true,
      scale: 3,
      useCORS: true,
      scrollY: -window.scrollY
    };
    html2canvas(div, options).then((canvas) => {
      var img = canvas.toDataURL("image/PNG");
      var doc = new jsPDF('l', 'mm', 'letter', 1);
        // Get the image data as JPEG and 0.9 quality (0.0 - 1.0)
        console.log(canvas.toDataURL("image/jpeg", 0.9))
      // Add image Canvas to PDF
      const bufferX = 10;
      const bufferY = 10;
      const imgProps = (<any>doc).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = ((imgProps.height * pdfWidth) / imgProps.width)
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((doc) => {
      doc.save('prueba.pdf');  
    });
   }
  onSubmit({value}: {value : RecetaInterface}){
     var value: RecetaInterface
    value.id = this.idunique;
    value.adicional = this.adicional;
    value.alergias = this.alergias;
    value.clinica = this.clinica;
    value.diagnostico = this.sintomas;
    value.estatura = this.estatura;
    value.fecha = this.fechaactual;
    value.medico = this.medico;
    value.mmhg = this.mmhg;
    value.peso = this.peso;
    value.ppm = this.rpm;
    value.prescripcion = this.elements
    value.rrpm = this.rrp;
    value.temperatura = this.temperatura 
    value.folio = this.folio
     console.log(value)
    this.generatePdf()
    this.hservice.addcita(value)
  }
  searchpaci(x){
    this.afs.collection('Pacientes').doc(x).valueChanges().pipe((take(1))).subscribe(querys => {
      this.detalles(querys as any)
    })
   }
   detalles(x: PacienteInterface){
       this.user = x;
       this.curp = x.curp
       this.correo =x.correo
       this.telefono = x.telefono
       this.foliop = x.folio
       this.nombre = x.nombre + ' ' + x.apaterno + ' ' + x.amaterno;
       var año = +x.fnacimiento.slice(6) 
       const actual = new Date().getFullYear()
        this.edad = actual - año;
   }
   deleteData(event){
     let index = this.contenededor.indexOf(event.data)
     this.contenededor.splice(index,1)
     this.sourcetable = new LocalDataSource( this.contenededor)
     this.contador--
     //  event.confirm.resolve();
    
    
  }
}
