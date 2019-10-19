import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from "src/app/environments/environment.prod";
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';


@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService,
    private http: HttpClient, private router: Router) {
  }

  changeUser(data: any) {
    this.storage.set('user', data);
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
