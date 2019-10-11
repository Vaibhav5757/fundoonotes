import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from "src/app/environments/environment.prod";
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  constructor(private http: HttpClient, private router: Router) {
  }

  private tokenSource = new BehaviorSubject('');
  currentToken = this.tokenSource.asObservable();

  changeToken(newToken: string) {
    this.tokenSource.next(newToken);
  }

  logIn(data): any {
    let obs = this.http.post(environment.domainURL + 'user/login', data);
    obs.subscribe((response: any) => {
      this.changeToken(response.id);
    });
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

  fetchAllNotes() {
    let httpOptions = new HttpHeaders({
      'Authorization': this.tokenSource.value
    });
    let obs = this.http.get(environment.domainURL + 'notes/getNotesList', {
      headers: httpOptions
    });
    return obs;
  }

  saveNote(data) {
    let httpOptions = new HttpHeaders({
      'Authorization': this.tokenSource.value
    });
    let obs = this.http.post(environment.domainURL + "notes/addNotes",data,{
      headers: httpOptions
    });
    return obs;
  }
}
