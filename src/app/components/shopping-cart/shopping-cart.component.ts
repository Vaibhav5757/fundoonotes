import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  // hide:Boolean= false;
  // addressDetails:Boolean = true;
  isCompleted:Boolean = false;
  isLinear:Boolean = true;

  constructor() { }

  ngOnInit() {
  }

}