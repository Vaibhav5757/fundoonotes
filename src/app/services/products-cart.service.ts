import { Injectable, Inject } from '@angular/core';
import { HttpServiceService } from './http-service.service';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';

@Injectable({
  providedIn: 'root'
})
export class ProductsCartService {

  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService,
    private http: HttpServiceService) { }

  addToCart(data) {
    return this.http.post("productcarts/addToCart", data);
  }

  setServiceType(data) {
    this.storage.set('cart-details',{
      "service": data.name,
      "cartId":data.id
    })
  }

  getServiceType(){
    return this.storage.get('cart-details');
  }
}
