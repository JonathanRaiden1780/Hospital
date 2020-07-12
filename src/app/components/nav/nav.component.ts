import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { RegistroInterface } from 'src/app/interfaces/registro';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export class NavComponent implements OnInit {
status: boolean
admin: boolean
nombre: string
  constructor( public authService: AuthService) { }

  ngOnInit(): void {
     this.authService.getAuth().subscribe(user => {
      if(user)  {
        this.status = true
        this.authService.getUserData(user.email).subscribe((info:RegistroInterface) =>{
          if (info.administrador == true){
            this.admin = true
          }
          else{
            this.admin = false
          }
          this.nombre = info.nombre+ ' ' + info.apaterno;
          console.log(this.nombre)
        })
      }
      else{
        this.status = false
      }
     })
  }
  onClickLogOut() {
    this.authService.logout();
  }

}
