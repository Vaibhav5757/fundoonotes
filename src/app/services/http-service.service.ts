import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'reset': 'my-auth-token'
    })
  };

  constructor(private http: HttpClient, private router: Router) {
  }

  logIn(data): void {
    let obs = this.http.post('http://fundoonotes.incubation.bridgelabz.com/api/user/login', data);
    obs.subscribe((response) => console.log(response));
  }

  signUp(data): void {
    let obs = this.http.post('http://fundoonotes.incubation.bridgelabz.com/api/user/userSignUp', data);
    obs.subscribe((response) => {
      if (response["data"].success) {
        this.router.navigateByUrl("/login");
      }
    });
  }

  forgotPassword(data): void {
    let obs = this.http.post('http://fundoonotes.incubation.bridgelabz.com/api/user/reset', data);
    obs.subscribe((response) => console.log(response));
  }

  resetPassword(data, token): void {
    this.httpOptions.headers.set('reset', token);
    let obs = this.http.post('http://fundoonotes.incubation.bridgelabz.com/api/user/reset-password', data, this.httpOptions);
    obs.subscribe((response) => console.log(response));
  }
}
