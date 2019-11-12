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
  MatOptionModule, MatIconModule, MatSnackBarModule, MatSidenavModule, MatToolbarModule, MatTooltipModule,
  MatCheckboxModule, MatExpansionModule, MatStepperModule, MatChipsModule,
  MatAutocompleteModule, MatDatepickerModule, MatNativeDateModule,
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
import { AuthGuard } from "../app/auth/auth.guard";
import { StorageServiceModule } from 'angular-webstorage-service';
import { NoteService } from './services/note.service';
import { HomeComponent } from './components/home/home.component';
import { RegistrationGuard } from '../app/auth/registration.guard';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { NotesByLabelComponent } from './components/notes-by-label/notes-by-label.component';
import { EditLabelComponent } from './components/edit-label/edit-label.component';
import { AddCollaboratorComponent } from './components/add-collaborator/add-collaborator.component';
import { AddReminderComponent } from './components/add-reminder/add-reminder.component';
import { AddCollaboratorInNewNoteComponent } from './components/add-collaborator-in-new-note/add-collaborator-in-new-note.component';
import { SearchPipe } from './pipe/search.pipe';
import { AllRemindersComponent } from './components/all-reminders/all-reminders.component';
import { MyDatePipePipe } from './pipe/my-date-pipe.pipe';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageCropperComponent } from './components/image-cropper/image-cropper.component';
import { QuestionAnswerOfNoteComponent } from './components/question-answer-of-note/question-answer-of-note.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { PinnedUnPinnedComponent } from './components/pinned-un-pinned/pinned-un-pinned.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { NoteComponent } from './components/note/note.component';

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
    AddCollaboratorComponent,
    AddReminderComponent,
    AddCollaboratorInNewNoteComponent,
    SearchPipe,
    AllRemindersComponent,
    MyDatePipePipe,
    ImageCropperComponent,
    QuestionAnswerOfNoteComponent,
    PinnedUnPinnedComponent,
    ColorPickerComponent,
    NoteComponent
  ],
  entryComponents: [
    EditNoteComponent,
    EditLabelComponent,
    AddCollaboratorComponent,
    AddCollaboratorInNewNoteComponent,
    ImageCropperComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatStepperModule,
    MatCardModule,
    MatAutocompleteModule,
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
    StorageServiceModule,
    ImageCropperModule
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