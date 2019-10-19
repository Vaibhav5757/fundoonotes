import { Component, OnInit } from '@angular/core';
import { UserServiceService } from 'src/app/services/user-service.service';
import { ProductsCartService } from 'src/app/services/products-cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  basicUserId: String;
  advanceUserId: String;

  constructor(private userSvc: UserServiceService,
    private prodSvc: ProductsCartService, private router: Router) { }

  ngOnInit() {

    let obs = this.userSvc.getService();
    obs.subscribe((response: any) => {
      this.advanceUserId = response.data.data[0]["id"];
      this.basicUserId = response.data.data[1]["id"];
    })

    //flush pre existing details
    this.changeService({
      name: '',
      id: ''
    })
  }

  addToCartBasic() {

    //flush pre existing details
    this.changeService({
      name: '',
      id: ''
    })

    let obs = this.prodSvc.addToCart({
      productId: this.basicUserId
    });

    obs.subscribe((response: any) => {
      this.changeService(response.data.details.product);
      this.router.navigateByUrl('/register');
    })
  }

  addToCartAdvance() {
    //flush pre existing details
    this.changeService({
      name: '',
      id: ''
    })

    let obs = this.prodSvc.addToCart({
      productId: this.advanceUserId
    });

    obs.subscribe((response: any) => {
      this.changeService(response.data.details.product);
      this.router.navigateByUrl('/register');
    })
  }

  changeService(data) {
    this.prodSvc.setServiceType(data);
  }

  logIn(){
    this.router.navigateByUrl("/logIn");
  }
}


