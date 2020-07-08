import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { HistorialService } from 'src/app/services/historial.service';
import { PacienteInterface } from "../../interfaces/paciente";
import {EntidadInterface } from "../../interfaces/entidad";
import { _isNumberValue } from '@angular/cdk/coercion';
import *  as $ from "jquery";
import { parseJSON } from 'date-fns';
import { NbPopoverDirective } from '@nebular/theme';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { tr } from 'date-fns/locale';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})

export class PacientesComponent implements OnInit {
  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;

  openpop() {
    this.popover.show();
  }

  closepop() {
    this.popover.hide();
  }

  constructor(
    private router: Router,
    private authservice: AuthService,
    private historialservice : HistorialService,
    config: NgbModalConfig, private modalService: NgbModal
  ) { 
    config.backdrop = 'static';
    config.keyboard = false;
  }
    
    entidadesi: EntidadInterface;
    nombre:string
    apaterno:string
    amaterno:string
    telefono:number
    correo:string
    curp:string
    fnacimiento:string
    fechan2:string
    entidad:string
    sexo:string;
    norigen:string
    edo:string;
    municipio:string
    cp:string
    folio: string;
    colonia: string;
    paciente:PacienteInterface;

  ngOnInit() {
    if(this.folio == ''|| this.curp == '' || this.nombre =='' || this.apaterno=='' ||this.norigen == ''
    ||this.amaterno==''|| this.cp == ''|| this.sexo==''||this.colonia=='' || this.fechan2 ==''
    || this.telefono == 0 || this.correo == '' || this.municipio == ''||this.edo == '' || this.entidad == '' ||
     this.folio == undefined|| this.curp == undefined || this.nombre =='' || this.apaterno=='' ||this.norigen == undefined
     ||this.amaterno==''|| this.cp == undefined|| this.sexo==''||this.colonia=='' || this.fechan2 ==''
  || this.telefono == undefined || this.correo == undefined || this.municipio == undefined||this.edo == undefined || this.entidad == undefined ){
      this.completo = false
    }
    else{
      this.completo = true;
    }
  }
  query(x){
    var endpoint_sepomex  = "http://api-sepomex.hckdrk.mx/query/";
    var method_sepomex = 'info_cp/';
    var variable_string = '?type=simplified';
    var setting = {
      "async": true,
      "crossDomain": true,
      "url": endpoint_sepomex+method_sepomex+this.cp+variable_string,
      "method": "GET",
      };
  var y = this;
   $.get(setting.url,  function(data){ 
    y.com(data.response)})
  }
  com(response){
  this.municipio = response.municipio;
  this.edo = response.estado;
  this.colonia = response.asentamiento[0] ;
  }
Registro(x){
var año = this.curp.slice(4,6)
var mes = this.curp.slice(6,8)
var dia = this.curp.slice(8,10)
var mile = this.curp.slice(-2,-1)
var ent = this.curp.slice(-7,-5).toUpperCase();
var s = this.curp.slice(-8,-7).toUpperCase();
if( !_isNumberValue(año) || !_isNumberValue(mes) ||!_isNumberValue(dia) || _isNumberValue(s) ){
  alert('CURP NO VALIDO')
}
var t = this.data.entidades.find( entidad => entidad.ABREVIATURA === ent)
console.log(t)
if(t == undefined){
  alert('CURP NO VALIDO')
}
else{
  this.entidad = t.ENTIDAD_FEDERATIVA;

}
this.sexo = s;
this.norigen = 'Mexicana'
//this.entidades.entidad
console.log(ent)
if(_isNumberValue(mile)){
  this.fnacimiento=  '19'+año +'-'+mes+'-'+dia
  this.fechan2 = dia+'/'+mes+'/'+'19'+año
}
else{
  this.fnacimiento=  '20'+año +'-'+mes+'-'+dia
  this.fechan2 = dia+'/'+mes+'/'+'20'+año
}



}
nombrecom: string;
completo: boolean
co({value}: {value: PacienteInterface},bool){
  value.curp = this.curp.toUpperCase();
    value.fnacimiento = this.fechan2;
    value.id = this.folio;
  this.historialservice.addnew(value)
  document.forms.namedItem('formGuardar').reset();
  document.forms.namedItem('formGuardar2').reset();
}
onGuardar({value}: {value: PacienteInterface},content){
  this.completo = true;

  if(this.folio == ''|| this.curp == '' || this.nombre =='' || this.apaterno=='' ||this.norigen == ''
  ||this.amaterno==''|| this.cp == ''|| this.sexo==''||this.colonia=='' || this.fechan2 ==''
  || this.telefono == 0 || this.correo == '' || this.municipio == ''||this.edo == '' || this.entidad == '' ||
   this.folio == undefined|| this.curp == undefined || this.nombre =='' || this.apaterno=='' ||this.norigen == undefined
   ||this.amaterno==''|| this.cp == undefined|| this.sexo==''||this.colonia=='' || this.fechan2 ==''
|| this.telefono == undefined || this.correo == undefined || this.municipio == undefined||this.edo == undefined || this.entidad == undefined ){
    alert('Completar todos los campos')
    this.completo = false
  }
  else{
    value.curp = this.curp.toUpperCase();
    value.fnacimiento = this.fechan2;
    value.id = this.folio;
    this.nombrecom = this.nombre+' '+this.apaterno+' '+this.amaterno;
    this.modalService.open(content)    
  }
 
}
 
   data={
  entidades: [
    {
        "CATALOG_KEY": "01",
        "ENTIDAD_FEDERATIVA": "AGUASCALIENTES",
        "ABREVIATURA": "AS"
    },
    {
        "CATALOG_KEY": "02",
        "ENTIDAD_FEDERATIVA": "BAJA CALIFORNIA",
        "ABREVIATURA": "BC"
    },
    {
        "CATALOG_KEY": "03",
        "ENTIDAD_FEDERATIVA": "BAJA CALIFORNIA SUR",
        "ABREVIATURA": "BS"
    },
    {
        "CATALOG_KEY": "04",
        "ENTIDAD_FEDERATIVA": "CAMPECHE",
        "ABREVIATURA": "CC"
    },
    {
        "CATALOG_KEY": "05",
        "ENTIDAD_FEDERATIVA": "COAHUILA DE ZARAGOZA",
        "ABREVIATURA": "CL"
    },
    {
        "CATALOG_KEY": "06",
        "ENTIDAD_FEDERATIVA": "COLIMA",
        "ABREVIATURA": "CM"
    },
    {
        "CATALOG_KEY": "07",
        "ENTIDAD_FEDERATIVA": "CHIAPAS",
        "ABREVIATURA": "CS"
    },
    {
        "CATALOG_KEY": "08",
        "ENTIDAD_FEDERATIVA": "CHIHUAHUA",
        "ABREVIATURA": "CH"
    },
    {
        "CATALOG_KEY": "09",
        "ENTIDAD_FEDERATIVA": "CIUDAD DE MÉXICO",
        "ABREVIATURA": "DF"
    },
    {
        "CATALOG_KEY": "10",
        "ENTIDAD_FEDERATIVA": "DURANGO",
        "ABREVIATURA": "DG"
    },
    {
        "CATALOG_KEY": "11",
        "ENTIDAD_FEDERATIVA": "GUANAJUATO",
        "ABREVIATURA": "GT"
    },
    {
        "CATALOG_KEY": "12",
        "ENTIDAD_FEDERATIVA": "GUERRERO",
        "ABREVIATURA": "GR"
    },
    {
        "CATALOG_KEY": "13",
        "ENTIDAD_FEDERATIVA": "HIDALGO",
        "ABREVIATURA": "HG"
    },
    {
        "CATALOG_KEY": "14",
        "ENTIDAD_FEDERATIVA": "JALISCO",
        "ABREVIATURA": "JC"
    },
    {
        "CATALOG_KEY": "15",
        "ENTIDAD_FEDERATIVA": "MÉXICO",
        "ABREVIATURA": "MC"
    },
    {
        "CATALOG_KEY": "16",
        "ENTIDAD_FEDERATIVA": "MICHOACÁN DE OCAMPO",
        "ABREVIATURA": "MN"
    },
    {
        "CATALOG_KEY": "17",
        "ENTIDAD_FEDERATIVA": "MORELOS",
        "ABREVIATURA": "MS"
    },
    {
        "CATALOG_KEY": "18",
        "ENTIDAD_FEDERATIVA": "NAYARIT",
        "ABREVIATURA": "NT"
    },
    {
        "CATALOG_KEY": "19",
        "ENTIDAD_FEDERATIVA": "NUEVO LEÓN",
        "ABREVIATURA": "NL"
    },
    {
        "CATALOG_KEY": "20",
        "ENTIDAD_FEDERATIVA": "OAXACA",
        "ABREVIATURA": "OC"
    },
    {
        "CATALOG_KEY": "21",
        "ENTIDAD_FEDERATIVA": "PUEBLA",
        "ABREVIATURA": "PL"
    },
    {
        "CATALOG_KEY": "22",
        "ENTIDAD_FEDERATIVA": "QUERÉTARO",
        "ABREVIATURA": "QT"
    },
    {
        "CATALOG_KEY": "23",
        "ENTIDAD_FEDERATIVA": "QUINTANA ROO",
        "ABREVIATURA": "QR"
    },
    {
        "CATALOG_KEY": "24",
        "ENTIDAD_FEDERATIVA": "SAN LUIS POTOSÍ",
        "ABREVIATURA": "SP"
    },
    {
        "CATALOG_KEY": "25",
        "ENTIDAD_FEDERATIVA": "SINALOA",
        "ABREVIATURA": "SL"
    },
    {
        "CATALOG_KEY": "26",
        "ENTIDAD_FEDERATIVA": "SONORA",
        "ABREVIATURA": "SR"
    },
    {
        "CATALOG_KEY": "27",
        "ENTIDAD_FEDERATIVA": "TABASCO",
        "ABREVIATURA": "TC"
    },
    {
        "CATALOG_KEY": "28",
        "ENTIDAD_FEDERATIVA": "TAMAULIPAS",
        "ABREVIATURA": "TS"
    },
    {
        "CATALOG_KEY": "29",
        "ENTIDAD_FEDERATIVA": "TLAXCALA",
        "ABREVIATURA": "TL"
    },
    {
        "CATALOG_KEY": "30",
        "ENTIDAD_FEDERATIVA": "VERACRUZ DE IGNACIO DE LA LLAVE",
        "ABREVIATURA": "VZ"
    },
    {
        "CATALOG_KEY": "31",
        "ENTIDAD_FEDERATIVA": "YUCATÁN",
        "ABREVIATURA": "YN"
    },
    {
        "CATALOG_KEY": "32",
        "ENTIDAD_FEDERATIVA": "ZACATECAS",
        "ABREVIATURA": "ZS"
    },
    {
        "CATALOG_KEY": "36",
        "ENTIDAD_FEDERATIVA": "ESTADOS UNIDOS MEXICANOS",
        "ABREVIATURA": "EUM"
    },
    {
        "CATALOG_KEY": "97",
        "ENTIDAD_FEDERATIVA": "NO APLICA",
        "ABREVIATURA": "NA"
    },
    {
        "CATALOG_KEY": "98",
        "ENTIDAD_FEDERATIVA": "SE IGNORA",
        "ABREVIATURA": "SI"
    },
    {
        "CATALOG_KEY": "99",
        "ENTIDAD_FEDERATIVA": "NO ESPECIFICADO",
        "ABREVIATURA": "NE"
    }
    ]
  } 
}
