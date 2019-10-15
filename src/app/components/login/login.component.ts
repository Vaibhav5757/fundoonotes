import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServiceService } from 'src/app/services/user-service.service';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(private router: Router, private userSvc: UserServiceService, private snackBar: MatSnackBar, private titleService: Title) {
    this.setTitle("Log In");
    this.loginForm = new FormGroup({

      emailFormControl: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),

      passwordFormControl: new FormControl('', [
        Validators.required
      ])
    })
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  onClick(): void {
    this.router.navigateByUrl('/register');
  }

  logIn(): void {
    if (this.loginForm.invalid) {
      if (this.loginForm.get('emailFormControl').invalid) {
        this.snackBar.open("Invalid Email Address", '', {
          duration: 1500
        });
      }
      if (this.loginForm.get('passwordFormControl').invalid) {
        this.snackBar.open("Password required", '', {
          duration: 1500
        });
      }
    } else {

      let obs = this.userSvc.logIn({
        email: this.loginForm.get('emailFormControl').value,
        password: this.loginForm.get('passwordFormControl').value
      })

      obs.subscribe((response: any) => {
        
        //Save the response
        this.userSvc.changeUser(response);
        this.router.navigateByUrl("/dashboard");

      }, (error) => {
        this.snackBar.open("Invalid LogIn Credentials");
      });

      this.loginForm.reset();
    }

  }

  forgotPassword(): void {
    let obs = this.userSvc.forgotPassword({
      email: this.loginForm.get('emailFormControl').value
    })
    obs.subscribe((response) => this.snackBar.open("Check Mail Inbox"));
  }

}


