import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from "src/app/environments/environment.prod";
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  constructor(private http: HttpClient, private router: Router) {
  }

  private userSource: BehaviorSubject<{}> = new BehaviorSubject({
    id: ""
  });
  userCredentials: Observable<{}> = this.userSource.asObservable();

  changeUser(data: any) {
    this.userSource.next(data);
  }

  getUser(){
    return this.userSource.value;
  }

  get(url) {
    let obs = this.http.get(environment.domainURL + url, {
      headers: new HttpHeaders({
        'Authorization': this.userSource.value["id"]
      })
    });
    return obs;
  }

  getWithData(url,data){
    let obs = this.http.get(environment.domainURL + url, {
      headers: new HttpHeaders({
        'Authorization': this.userSource.value["id"]
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
        'Authorization': this.userSource.value["id"]
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
