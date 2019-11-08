import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent {

  @Input('note') note;
  @Output() events = new EventEmitter();

  public defaultColors1: string[] = [
    '#ffffff',
    '#BDD561',
    '#3e6158'
  ];

  public defaultColors2: string[] = [
    '#3f7a89',
    '#96c582',
    '#b7d5c4'
  ];

  public defaultColors3: string[] = [
    '#bcd6e7',
    '#7c90c1',
    '#9d8594'
  ];

  constructor(private noteSvc: NoteService) { }

  //Change Color of Card
  changeColor(paint) {
    let data = {
      noteIdList: [this.note.id],
      color: paint
    };
    let obs = this.noteSvc.changeNoteColor(data);
    obs.subscribe(() => {
      this.events.emit();
    })
  }

}
