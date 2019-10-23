import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  MatButtonModule, MatInputModule, MatListModule,
  MatCardModule, MatFormFieldModule, MatMenuModule, MatSelectModule, MatDialogModule,
  MatOptionModule, MatIconModule, MatSnackBarModule, MatSidenavModule, MatToolbarModule, MatTooltipModule, MatCheckboxModule, MatExpansionModule, MatStepperModule, MatChipsModule
} from '@angular/material';
import { FlexLayoutModule, GridModule } from '@angular/flex-layout';
import { RegisterComponent } from './components/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpServiceService } from '../app/services/http-service.service';
import { UserServiceService } from '../app/services/user-service.service';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LayoutModule } from '@angular/cdk/layout';
import { AllNotesComponent } from './components/all-notes/all-notes.component';
import { ArchivedNotesComponent } from './components/archived-notes/archived-notes.component';
import { DeletedNotesComponent } from './components/deleted-notes/deleted-notes.component';
import { EditNoteComponent } from './components/edit-note/edit-note.component';
import { AuthGuard } from "./auth.guard";
import { StorageServiceModule } from 'angular-webstorage-service';
import { NoteService } from './services/note.service';
import { HomeComponent } from './components/home/home.component';
import { RegistrationGuard } from './registration.guard';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { NotesByLabelComponent } from './components/notes-by-label/notes-by-label.component';
import { EditLabelComponent } from './components/edit-label/edit-label.component';
import { AddCollaboratorComponent } from './components/add-collaborator/add-collaborator.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    DashboardComponent,
    AllNotesComponent,
    ArchivedNotesComponent,
    DeletedNotesComponent,
    EditNoteComponent,
    HomeComponent,
    ShoppingCartComponent,
    NotesByLabelComponent,
    EditLabelComponent,
    AddCollaboratorComponent
  ],
  entryComponents: [
    EditNoteComponent,
    EditLabelComponent,
    AddCollaboratorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatStepperModule,
    MatCardModule,
    MatFormFieldModule,
    MatMenuModule,
    MatChipsModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSelectModule,
    MatOptionModule,
    FlexLayoutModule,
    GridModule,
    HttpClientModule,
    LayoutModule,
    StorageServiceModule
  ],
  providers: [
    HttpServiceService,
    UserServiceService,
    NoteService,
    AuthGuard,
    RegistrationGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }