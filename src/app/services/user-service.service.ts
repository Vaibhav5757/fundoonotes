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
    let obs = this.http.logIn(data);

    obs.subscribe((response: any) => {
      this.router.navigateByUrl("/dashboard");
    }, (error) => {
      this.snackBar.open("Invalid Credentials", '', {
        duration: 1500
      });
    }
    );
  }

  signUp(data): void {
    this.http.signUp(data);
  }

  forgotPassword(data): void {
    this.http.forgotPassword(data);
  }

  resetPassword(data, token): void {
    this.http.resetPassword(data, token);
  }
}
