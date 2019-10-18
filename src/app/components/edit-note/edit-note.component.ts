import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { NoteService } from 'src/app/services/note.service';

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

  color: String = "#FFFFF";

  constructor(@Inject(MAT_DIALOG_DATA) private note: DialogData,
    private dialogRef: MatDialogRef<EditNoteComponent>,
    private noteSvc: NoteService,
    private snackBar: MatSnackBar) { }

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

  changeColor(note, paint) {
    note.color = paint;
    this.color = paint;
    this.snackBar.open('Color Change is not supported in our API while editing notes', '', {
      duration: 1500
    })
  }

  //Delete a Note
  deleteNote(note) {
    let data = {
      noteIdList: [note.id],
      isDeleted: true
    }
    let obs = this.noteSvc.deleteNote(data);
    obs.subscribe(response => {
      this.dialogRef.close({
        message: 'update-notes'
      });
      this.snackBar.open("Note Deleted", '', {
        duration: 1500
      })
    })
  }

  //archive a note
  archiveNote(note) {
    let data = {
      noteIdList: [note.id],
      isArchived: true
    }
    let obs = this.noteSvc.archiveNote(data);
    obs.subscribe(response => {
      this.dialogRef.close({
        message: 'update-notes'
      });
      this.snackBar.open("Note Archived", '', {
        duration: 1500
      })
    })
  }


}
