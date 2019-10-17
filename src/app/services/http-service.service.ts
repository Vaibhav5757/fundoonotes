import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from "src/app/environments/environment.prod";
import { BehaviorSubject, Observable } from 'rxjs';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';


@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, private http: HttpClient, private router: Router) {
    let dummyUser = {
      id:''
    }
    this.storage.set('user',dummyUser)
  }

  changeUser(data: any) {
    this.storage.set('user',data);
  }

  getUser() {
    return this.storage.get('user');
  }

  get(url) {
    let obs = this.http.get(environment.domainURL + url, {
      headers: new HttpHeaders({
        'Authorization': this.storage.get('user')["id"]
      })
    });
    return obs;
  }

  getWithData(url, data) {
    let obs = this.http.get(environment.domainURL + url, {
      headers: new HttpHeaders({
        'Authorization': this.storage.get('user')["id"]
      }),
      params: {
        id: data
      }
    });
    return obs;
  }

  post(url, data) {
    let obs = this.http.post(environment.domainURL + url, data, {
      headers: new HttpHeaders({
        'Authorization': this.storage.get('user')["id"]
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
