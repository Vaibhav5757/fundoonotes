import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AllNotesComponent } from './components/all-notes/all-notes.component';
import { DeletedNotesComponent } from './components/deleted-notes/deleted-notes.component';
import { ArchivedNotesComponent } from './components/archived-notes/archived-notes.component';
import { AuthGuard } from '../app/auth/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { RegistrationGuard } from '../app/auth/registration.guard';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { NotesByLabelComponent } from './components/notes-by-label/notes-by-label.component';
import { AllRemindersComponent } from './components/all-reminders/all-reminders.component';
import { QuestionAnswerOfNoteComponent } from './components/question-answer-of-note/question-answer-of-note.component';

const routes: Routes = [
  { path: '', redirectTo: "/home", pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {
    canActivate: [RegistrationGuard],
    path: 'register', component: RegisterComponent
  },
  {
    canActivate: [AuthGuard],
    path: 'dashboard', component: DashboardComponent,
    children: [
      { path: '', component: AllNotesComponent },
      { path: 'notes', component: AllNotesComponent },
      { path: 'shoppingCart', component: ShoppingCartComponent },
      { path: 'deleted', component: DeletedNotesComponent },
      { path: 'archived', component: ArchivedNotesComponent },
      { path: 'reminders', component: AllRemindersComponent },
      { path: 'QuestionAnswer/:noteId', component: QuestionAnswerOfNoteComponent },
      { path: 'notesByLabel/:labelName', component: NotesByLabelComponent }
    ]
  },
  { path: 'resetpassword/:token', component: ResetPasswordComponent },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
