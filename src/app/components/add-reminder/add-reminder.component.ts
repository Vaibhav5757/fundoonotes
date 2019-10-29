import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-add-reminder',
  templateUrl: './add-reminder.component.html',
  styleUrls: ['./add-reminder.component.scss']
})
export class AddReminderComponent implements OnInit {

  @Input('note') note;
  @ViewChild('triggerElement') trigger: MatMenuTrigger;

  min: Date;

  constructor() {
  }

  ngOnInit() {
    this.min = new Date();
  }

  getCurrentTime() {
    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    // if (minutes < 10) minutes += "0" + minutes;
    if (hours > 12) return hours % 12 + ":" + now.getMinutes() + " PM"
    else return hours + ":" + now.getMinutes() + " AM"
  }

  closeMenu() {
    this.trigger.closeMenu();
  }

}
