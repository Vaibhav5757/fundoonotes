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

  get(url) {
    let obs = this.http.get(environment.domainURL + url, {
      headers: new HttpHeaders({
        'Authorization': this.tokenSource.value
      })
    });
    return obs;
  }

  post(url, data) {
    let obs = this.http.post(environment.domainURL + url, data, {
      headers: new HttpHeaders({
        'Authorization': this.tokenSource.value
      })
    });
    return obs;
  }

  postWithToken(url, data, token) {
    let obs = this.http.post(environment.domainURL + url, data, {
      headers: new HttpHeaders({
        'Authorization': token
      })
    });
    return obs;
  }
}
