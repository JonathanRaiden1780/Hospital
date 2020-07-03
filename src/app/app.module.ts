import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatStepperModule, MatInputModule, MatButtonModule, MatAutocompleteModule, MatNativeDateModule, MatIconModule, MatFormFieldModule, MatTabsModule, MatCheckboxModule,MatTableModule, MatSortModule, MatPaginatorModule, MatDatepickerModule, MatRadioButton, MatRadioModule } from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistroComponent } from './components/registro/registro.component';
import { NavComponent } from './components/nav/nav.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { Page404Component } from './components/page404/page404.component';
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { MedicamentosComponent } from './components/medicamentos/medicamentos.component';
import { RecetaComponent } from './components/receta/receta.component';
import { CitasComponent } from './components/citas/citas.component';

//Firebase
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {environment} from '../environments/environment';



@NgModule({
  declarations: [
    AppComponent,
    RegistroComponent,
    NavComponent,
    LoginComponent,
    HomeComponent,
    Page404Component,
    PacientesComponent,
    MedicamentosComponent,
    RecetaComponent,
    CitasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
