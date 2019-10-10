import { Injectable } from '@angular/core';
import { HttpServiceService } from './http-service.service'
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private http: HttpServiceService, private snackBar: MatSnackBar, private router: Router) { }

  private messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();

  changeToken(newToken: string) {
    this.messageSource.next(newToken);
  }

  logIn(data): any {
    let obs = this.http.logIn(data);
    obs.subscribe((response: any) => {
      this.changeToken(response.id);
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
