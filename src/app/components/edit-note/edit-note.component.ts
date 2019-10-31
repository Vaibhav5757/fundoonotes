import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatDialog, MatMenuTrigger } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { NoteService } from 'src/app/services/note.service';
import { AddCollaboratorComponent } from '../add-collaborator/add-collaborator.component';

export interface DialogData {
  title: String,
  description: String,
  id: String,
  color: String,
  collaborators,
  noteCheckLists,
  user,
  reminder
}

@Component({
  selector: 'app-edit-note',
  templateUrl: './edit-note.component.html',
  styleUrls: ['./edit-note.component.scss']
})
export class EditNoteComponent implements OnInit {
  @ViewChild('menuTrigger') trigger: MatMenuTrigger;

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

  checkListAbsent: Boolean;

  basicUser: Boolean = false;

  checkListInput = new FormControl('', []);

  constructor(@Inject(MAT_DIALOG_DATA) private note: DialogData,
    private dialogRef: MatDialogRef<EditNoteComponent>,
    private noteSvc: NoteService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit() {
    if (this.note.user.service != "advance") this.basicUser = true;
    this.title.setValue(this.note.title);
    this.content.setValue(this.note.description);
    this.color = this.note.color;
    if (this.note.noteCheckLists.length > 0) {
      this.checkListAbsent = false;
    } else this.checkListAbsent = true;
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
    // this.snackBar.open('Color Change is not supported in our API while editing notes', '', {
    //   duration: 1500
    // })
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

  deleteLabel(label, note) {
    let obs = this.noteSvc.deleteLabelFromNote({
      noteId: note.id,
      labelId: label.id
    })

    obs.subscribe((response) => {
      note.noteLabels = note.noteLabels.filter(object => object != label);
      this.snackBar.open("Label Deleted", '', {
        duration: 1500
      })
    })
  }

  checkListChange(list) {
    if (list.status === "open") list.status = "close"
    else list.status = "open"
    let obs = this.noteSvc.updateCheckList(list);
    obs.subscribe((response) => {
      // this.fetchAllNotes();
    })
  }

  checkListStatus(list) {
    return list.status === "close" ? true : false;
  }

  addCollaborator(note) {
    let obs = this.dialog.open(AddCollaboratorComponent, {
      width: '1100px',
      panelClass: 'dialogBox',
      data: note
    })
    obs.afterClosed().subscribe(() => {
      // this.fetchAllNotes();
    })
  }

  addCheckList(event) {
    if (event.key == "Enter") {
      let obs = this.noteSvc.addCheckList(this.note, {
        itemName: this.checkListInput.value,
        status: "open"
      })
      obs.subscribe((response) => {
        this.note.noteCheckLists.push({
          itemName: this.checkListInput.value
        })
        this.checkListInput.setValue("");
      })
    }
  }

  removeReminder(note) {
    let obs = this.noteSvc.removeReminder({
      noteIdList: [note.id]
    })
    obs.subscribe((response) => {
      note.reminder = [];
    })
  }

  reminderAdded(event) {
    this.snackBar.open("Reminder Added", '', {
      duration: 1500
    })
  }
}
