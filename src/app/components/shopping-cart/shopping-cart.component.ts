import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ProductsCartService } from 'src/app/services/products-cart.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  basicUser: Boolean = false;
  advancedUserWishToShop: Boolean;
  cartDetails: any;
  cartEmpty: Boolean = false;
  cartPresent: Boolean = false;
  cartAdvance: Boolean;//True for advance Service, False for basic service
  serviceAmount;
  serviceType;
  serviceDescription: String;

  formGroup = new FormGroup({
    addressFormControl: new FormControl('', [
      Validators.required
    ])
  })

  constructor(private dash: DashboardComponent,
    private prodSvc: ProductsCartService, private router: Router) { }

  ngOnInit() {
    this.advancedUserWishToShop = this.dash.advancedUser;
    this.getCartDetails();
  }

  getCartDetails() {
    this.cartDetails = this.prodSvc.getServiceType();
    if (this.cartDetails.service === "") this.cartEmpty = true;
    else {
      this.cartPresent = true;
      this.cartAdvance = this.cartDetails.service === "advance";
      this.serviceAmount = this.cartAdvance ? "99$" : "49$";
      this.serviceType = this.cartAdvance ? "advance" : "basic";
      this.serviceDescription = this.cartAdvance ? "Ability to add title, description, images, labels, checklist and colors"
        : "Ability to add only title and description"
    }
  }

  placeOrder() {
    let obs = this.prodSvc.placeOrder({
      cartId: this.cartDetails.cartId,
      address: this.formGroup.get('addressFormControl').value
    })
    obs.subscribe((response) => {
      this.formGroup.get('addressFormControl').setValue("");
    })
  }

  redirectToHomePage() {
    this.dash.logOut();
    this.router.navigateByUrl("/home");
  }
}
