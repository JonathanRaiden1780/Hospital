import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth} from '@angular/fire/auth'
import { AuthService } from '../services/auth.service';
import { map, take, tap } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private authservice: AuthService
  ){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authservice.afAuth.authState
      .pipe(take(1))
      .pipe(map(authstate=> !! authstate))
      .pipe(tap(autthen=>{
          if(!autthen){
            this.router.navigate(['/login']);
          }
        })
      );
    }

}
