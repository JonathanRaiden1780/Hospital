import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guard/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { MedicamentosComponent } from './components/medicamentos/medicamentos.component';
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { CitasComponent } from './components/citas/citas.component';
import { Page404Component } from './components/page404/page404.component';
import { RecetaComponent } from './components/receta/receta.component';
import { Route } from '@angular/compiler/src/core';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, canActivate:[AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistroComponent, canActivate:[AuthGuard]},
  {path: 'inventario', component: MedicamentosComponent, canActivate:[AuthGuard]},
  {path: 'pacientes', component: PacientesComponent, canActivate:[AuthGuard]},
  {path: 'citas', component: CitasComponent, canActivate:[AuthGuard]},
  {path: 'receta', component: RecetaComponent, canActivate:[AuthGuard]},
  { path: '**', component: Page404Component }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routing: ModuleWithProviders<Route> = RouterModule.forRoot(routes);

