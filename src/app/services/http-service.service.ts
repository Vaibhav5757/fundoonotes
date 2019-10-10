import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from "src/app/environments/environment.prod";


@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  constructor(private http: HttpClient, private router: Router) {
  }

  logIn(data): any {
    let obs = this.http.post(environment.domainURL + 'user/login', data);
    return obs;

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
    let httpOptions = new HttpHeaders({
      'Authorization': token
    });
    let obs = this.http.post(environment.domainURL + 'user/reset-password', data, {
      headers: httpOptions
    });
    obs.subscribe((response) => console.log(response));
  }

  fetchAllNotes(token): any {
    let httpOptions = new HttpHeaders({
      'Authorization': token
    });
    let obs = this.http.get(environment.domainURL + 'notes/getNotesList', {
      headers: httpOptions
    });
    return obs;
  }
}
