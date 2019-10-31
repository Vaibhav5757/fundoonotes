import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myDatePipe'
})
export class MyDatePipePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let givenDate = new Date(value);
    let today = new Date();

    if (isSameDay(givenDate, today)) return "today" + formatTime(givenDate);
    else if (isTomorrow(givenDate, today)) return "tomorrow" + formatTime(givenDate);

    return value;
  }

}

function isSameDay(d1, d2) {
  return (d1.getDay() == d2.getDay() &&
    d1.getMonth() == d2.getMonth() &&
    d1.getYear() == d2.getYear());
}

function isTomorrow(d1, d2) {
  d1.setDate(d1.getDate() - 1);
  return (d1.getDay() == d2.getDay() &&
    d1.getMonth() == d2.getMonth() &&
    d1.getYear() == d2.getYear());
}

function formatTime(date: Date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  let minutess = minutes < 10 ? '0' + minutes : minutes;
  let strTime = "\n" + hours + ':' + minutess + ' ' + ampm;
  return strTime;

}
