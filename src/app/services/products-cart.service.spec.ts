import { TestBed, inject } from '@angular/core/testing';

import { ProductsCartService } from './products-cart.service';

describe('ProductsCartService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductsCartService]
    });
  });

  it('should be created', inject([ProductsCartService], (service: ProductsCartService) => {
    expect(service).toBeTruthy();
  }));
});
