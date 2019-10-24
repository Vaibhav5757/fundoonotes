import { Injectable } from '@angular/core';
import { HttpServiceService } from './http-service.service'

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private http: HttpServiceService) {
  }

  logIn(data: { email: any; password: any; }): any {
    return this.http.post('user/login', data);
  }

  signUp(data: any) {
    return this.http.post('user/userSignUp', data);
  }

  forgotPassword(data: { email: any; }): any {
    return this.http.post('user/reset', data);
  }

  resetPassword(data: { newPassword: any; }, token: String): any {
    return this.http.postWithToken('user/reset-password', data, token);
  }

  changeUser(data: any) {
    this.http.changeUser(data);
  }

  getUser() {
    return this.http.getUser();
  }

  getUserDetails(id) {
    return this.http.getWithData("user/" + id, id);
  }

  loggedIn(): Boolean {
    let user = this.getUser();
    if (user['id'] != '') return true;
    else return false;
  }

  logOut() {
    this.http.changeUser({
      id: ''
    });
  }

  getService() {
    return this.http.get("user/service");
  }

  fetchAllUsers() {
    return this.http.get("user");
  }

  searchUserList(data) {
    return this.http.post("user/searchUserList",data);
  }
}
