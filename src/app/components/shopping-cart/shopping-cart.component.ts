import { Component, OnInit } from '@angular/core';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  basicUser: Boolean = false;
  advancedUser: Boolean = false;
  isCompleted: Boolean = false;
  isLinear: Boolean = true;

  constructor(private dash: DashboardComponent) { }

  ngOnInit() {
    this.advancedUser = this.dash.advancedUser;
    this.basicUser = !this.advancedUser;
  }

}
