import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RegistroInterface } from 'src/app/interfaces/registro';
import { el } from 'date-fns/locale';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

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
    public adminstrador: boolean;
    public tipo: string;
  ngOnInit() {
  }


  addnewuser(){
     this.authservice.registeruser(this.email,this.pass)
    .then((res)=>{
      this.router.navigate(['/login'])
    }).catch(err=> console.log('err',err.message)); 
  }
  guardarregistro({value}: {value: RegistroInterface}){
  //  let userID  = auth().currentUser!.uid;
   if(this.tipo == 'Administrador')
   {
     this.adminstrador = true;
   }
   else{ this.adminstrador = false}
    value.id = this.email;
    value.correo = this.email;
    value.nombre = this.nombre;
    value.amaterno = this.amaterno;
    value.apaterno = this.apaterno;
    value.cedula = this.cedula;
    value.noempleado= this.empleado;
    value.administrador = this.adminstrador
    value.clinica = this.clinica;
    this.authservice.addregistro(value);
  }
}
