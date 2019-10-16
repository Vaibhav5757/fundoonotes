import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

export interface DialogData {
  title: String,
  description: String,
  id: String,
  color: String
}

@Component({
  selector: 'app-edit-note',
  templateUrl: './edit-note.component.html',
  styleUrls: ['./edit-note.component.scss']
})
export class EditNoteComponent implements OnInit {

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

  title = new FormControl('', [
    Validators.required
  ])

  content = new FormControl('', [
  ])

  color:String = "#FFFFF";

  constructor(@Inject(MAT_DIALOG_DATA) private note: DialogData,
    private dialogRef: MatDialogRef<EditNoteComponent>) { }

  ngOnInit() {
    this.title.setValue(this.note.title);
    this.content.setValue(this.note.description);
    this.color = this.note.color;
  }

  returnData() {
    if (this.content.value != '' || this.title.value != '') {
      this.dialogRef.close({
        title: this.title.value,
        description: this.content.value,
        id: this.note.id,
        color: this.color
      })
    } else {
      this.dialogRef.close();
    }
  }

  changeColor(paint){
    this.color = paint;
  }

}
