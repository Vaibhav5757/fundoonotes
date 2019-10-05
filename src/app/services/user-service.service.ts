import { Injectable } from '@angular/core';
import { HttpServiceService } from './http-service.service'

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private http: HttpServiceService) { }

  logIn(data): void {
    this.http.logIn(data);
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
