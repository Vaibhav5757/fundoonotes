import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from "src/environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  constructor(private http: HttpClient, private router: Router) {
  }

  logIn(data): void {
    let obs = this.http.post(environment.domainURL + 'user/login', data);
    obs.subscribe((response) => console.log(response));
  }

  signUp(data): void {
    let obs = this.http.post(environment.domainURL + 'user/userSignUp', data);
    obs.subscribe((response) => {
      if (response["data"].success) {
        this.router.navigateByUrl("/login");
      }
    });
  }

  forgotPassword(data): void {
    let obs = this.http.post(environment.domainURL + 'user/reset', data);
    obs.subscribe((response) => console.log(response));
  }

  resetPassword(data, token): void {
    let obs = this.http.post(environment.domainURL + 'user/reset-password?access_token='+token, data);
    obs.subscribe((response) => console.log(response));
  }
}
