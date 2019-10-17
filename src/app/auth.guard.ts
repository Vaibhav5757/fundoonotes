import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserServiceService } from './services/user-service.service';
import { MatSnackBar } from '@angular/material';
import { WebStorageService, LOCAL_STORAGE } from 'angular-webstorage-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService, private router: Router, private snackBar: MatSnackBar) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    let user = this.storage.get('user');
    if (user['id'] != '') return true;
    else {
      this.snackBar.open("You are not logged In", '', {
        duration: 1500
      });
      this.router.navigateByUrl("/logIn");
    }
  }
}
