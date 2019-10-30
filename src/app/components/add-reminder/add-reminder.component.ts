import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { FormControl } from '@angular/forms';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'app-add-reminder',
  templateUrl: './add-reminder.component.html',
  styleUrls: ['./add-reminder.component.scss']
})
export class AddReminderComponent implements OnInit {

  @Input('note') note;
  @ViewChild('triggerElement') trigger: MatMenuTrigger;
  @Output() events = new EventEmitter();

  myDatePicker = new FormControl('', []);
  myTimePicker = new FormControl('', []);

  minDate: Date;

  constructor(private noteSvc: NoteService) {
  }

  ngOnInit() {
    this.minDate = new Date();
    this.myTimePicker.setValue(this.getCurrentTime());
  }

  getCurrentTime() {
    let now = new Date();
    let hours = now.getHours();
    let minutes = (now.getMinutes() < 10 ? '0' : '') + now.getMinutes()
    if (hours > 12) return hours % 12 + ":" + minutes + " PM"
    else return hours + ":" + minutes + " AM"
  }

  closeMenu() {
    this.trigger.closeMenu();
  }

  addReminderPreSelectedDate(date, time) {
    let selectedDate = date;

    if (date === 'today') {
      selectedDate = new Date();
      selectedDate = this.formatDate(selectedDate);
    }
    if (date === 'tomorrow') {
      let currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 1);
      selectedDate = currentDate;
      selectedDate = this.formatDate(selectedDate);
    }
    if (date === "nextMonday") {
      let currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + (1 + 7 - currentDate.getDay()) % 7);
      selectedDate = currentDate;
      selectedDate = this.formatDate(selectedDate);
    }
    this.saveReminder(selectedDate, time);
  }

  addReminder() {

    let selectedDate = this.formatDate(new Date(this.myDatePicker.value));
    let time = this.myTimePicker.value;

    time = this.convert12into24(time);

    this.saveReminder(selectedDate, time);
  }

  saveReminder(selectedDate, time) {
    let reminder = selectedDate + "T" + time;

    console.log(reminder);

    let obs = this.noteSvc.addReminder({
      noteIdList: [this.note.id],
      reminder: reminder
    })
    obs.subscribe((response) => {
      console.log(response);
      this.events.emit(null);
    })
  }

  convert12into24(time12h) {
    let [time, modifier] = time12h.split(" ");

    let [hours, minutes] = time.split(":");

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    return hours + ":" + minutes;
  }

  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

}
