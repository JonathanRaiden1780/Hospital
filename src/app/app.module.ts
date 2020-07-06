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
import { MedicamentosComponent, DateEditorComponent, PrecioEditorComponent, StockEditorComponent, skuEditorComponent } from './components/medicamentos/medicamentos.component';
import { RecetaComponent } from './components/receta/receta.component';
import { CitasComponent } from './components/citas/citas.component';

//Firebase
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {environment} from '../environments/environment';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { InventarioService } from './services/inventario.service';
import { AuthGuard } from './guard/auth.guard';
import { AuthService } from './services/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule, NbIconModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';



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
    CitasComponent,
    DateEditorComponent,
    PrecioEditorComponent,
    StockEditorComponent,
    skuEditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    Ng2SmartTableModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    FormsModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'dark' }),
    NbLayoutModule,
    NbEvaIconsModule,
    NbIconModule
  ],
  providers: [
    InventarioService,
    AuthGuard,
    AuthService
  ],
  entryComponents:[DateEditorComponent,PrecioEditorComponent,StockEditorComponent,skuEditorComponent ],
  bootstrap: [AppComponent]
})
export class AppModule { }