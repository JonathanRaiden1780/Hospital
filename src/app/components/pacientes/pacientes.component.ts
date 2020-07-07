import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PacienteInterface } from "../../interfaces/paciente";
import {EntidadInterface } from "../../interfaces/entidad";
import { _isNumberValue } from '@angular/cdk/coercion';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit {

  constructor(
    private router: Router,
    private authservice: AuthService
  ) { }
    public email:string;
    public pass: string;
    public nombre: string;
    public apaterno: string;
    public amaterno: string;
    public empleado: string;
    public clinica: string;
    public cedula: string;

    entidadesi: EntidadInterface;
    curp:string
    fechan:string
    entidad:string
    sexo:string;
    norigen:string
    edo:string;
    municipio:string
    cp:string
    folio: string;
    
  ngOnInit() {
  }

Registro(x){
console.log(x, 
this.curp)//HUVJ951027HDRFZN04
 var año = this.curp.slice(4,6)
var mes = this.curp.slice(6,8)
var dia = this.curp.slice(8,10)
var mile = this.curp.slice(-2,-1)
var ent = this.curp.slice(-7,-5).toUpperCase();
var s = this.curp.slice(-8,-7).toUpperCase();
var t = this.data.entidades.find( entidad => entidad.ABREVIATURA === ent)
this.entidad = t.ENTIDAD_FEDERATIVA;
this.sexo = s;
this.norigen = 'Mexicana'
//this.entidades.entidad
console.log(ent)
if(_isNumberValue(mile))
this.fechan =  '19'+año +'-'+mes+'-'+dia

}
onGuardar(x){
  console.log(x)
}
  addnewuser(){
     this.authservice.registeruser(this.email,this.pass)
    .then((res)=>{
      this.router.navigate(['/login'])
    }).catch(err=> console.log('err',err.message)); 
  }
  guardarregistro({value}: {value: PacienteInterface}){
    
    //this.authservice.addregistro(value);
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