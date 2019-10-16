import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AllNotesComponent } from './components/all-notes/all-notes.component';
import { DeletedNotesComponent } from './components/deleted-notes/deleted-notes.component';
import { ArchivedNotesComponent } from './components/archived-notes/archived-notes.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    canActivate: [AuthGuard],
    path: 'dashboard', component: DashboardComponent,
    children: [
      { path: '', component: AllNotesComponent },
      { path: 'notes', component: AllNotesComponent },
      { path: 'deleted', component: DeletedNotesComponent },
      { path: 'archived', component: ArchivedNotesComponent }
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
