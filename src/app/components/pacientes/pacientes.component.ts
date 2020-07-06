import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PacienteInterface } from "../../interfaces/paciente";

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

    Cliente:string
    combustible:string
    opcion:string;
    name:string;
    idenc: string;
    placa:string;
    vehiculo:string;
    marca:string;
    combustilbe:string;
    numserie:string;
    kilometraje:number;
    anio:number;
    fechaent:string;
    fechasal:string;
    tarjetac:string;
    llantas:string;
    ordenservicio:string;
    antena:string;
    llantaref:string;
    vestiduras:string;
    controlllave:string;
    gato:string;
    tapetes:string;
    llavetuerc:string;
    taponllanta:string;
    extintor:string;
    kitherram:string;
    segurorueda:string;
    señal:string;
    placas:string;
    tapongas:string;
    radio:string;
    admonflota:string;
    asesor:string;
    solicdiag:string;
    trabajosol:string;
    trabajorea:string;
    nombrecliente:string;
    correocliente:string;
    numerocliente:string;
    cliente:string;
    tipo:string;

  ngOnInit() {
  }

Registro(x){

}
onGuardar(x){

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
}
