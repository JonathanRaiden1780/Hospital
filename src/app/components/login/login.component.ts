import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from "angular2-flash-messages";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
email: string;
password: string;

  constructor(private authservice: AuthService, private flash: FlashMessagesService, private router:Router) { }

  ngOnInit(): void {
  }
  onSubmitLogin(){
    this.authservice.loginEmail(this.email,this.password).then( res => {
      this.router.navigate(['/home'])
    }).catch( (err) => {
      alert(err)
  });
}
}
