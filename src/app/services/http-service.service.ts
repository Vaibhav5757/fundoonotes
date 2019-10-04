import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  constructor(private http: HttpClient, private router: Router) {
  }

  logIn(data): any {
    let obs = this.http.post('http://fundoonotes.incubation.bridgelabz.com/api/user/login', data);
    obs.subscribe((response) => console.log(response));
  }

  signUp(data): any {
    let obs = this.http.post('http://fundoonotes.incubation.bridgelabz.com/api/user/userSignUp', data);
    obs.subscribe((response) => {
      if(response["data"].success){
        this.router.navigateByUrl("/login");
      }
    });
  }
}
