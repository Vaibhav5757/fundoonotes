import { Injectable } from '@angular/core';
import { HttpServiceService } from './http-service.service'

import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private http: HttpServiceService, private snackBar: MatSnackBar, private router: Router) { }

  logIn(data): any {
    let obs = this.http.post('user/login', data);
    obs.subscribe((response: any) => {
      //Save the token (user id which is unique)
      console.log(response.id);
      this.http.changeToken(response.id);
      
      this.router.navigateByUrl("/dashboard");
    }, (error) => {
      this.snackBar.open("Invalid LogIn Credentials");
    });
  }

  signUp(data): void {
    let obs = this.http.post('user/userSignUp', data);
    obs.subscribe((response) => {
      if (response["data"].success) {
        this.router.navigateByUrl("/login");
      }
    });
  }

  forgotPassword(data): void {
    let obs = this.http.post('user/reset', data);
    obs.subscribe((response) => this.snackBar.open("Check Mail Inbox"));
  }

  resetPassword(data, token): void {
    let obs = this.http.postWithToken('user/reset-password', data, token);
    obs.subscribe((response) => this.snackBar.open("Password Changed"));
  }
}
