import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { WebStorageService, LOCAL_STORAGE } from 'angular-webstorage-service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationGuard implements CanActivate {

  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService,
    private router: Router, private snackBar: MatSnackBar) {
  }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    let cartDetails = this.storage.get('cart-details');
    if (cartDetails.cartId === '' || cartDetails.service === ""){
      this.snackBar.open("Select Service Type first",'',{
        duration:1500
      })
      this.router.navigateByUrl("/home");
    }
    else return true;
  }
}
