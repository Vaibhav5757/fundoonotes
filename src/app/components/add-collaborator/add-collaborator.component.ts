import { Component, OnInit, Inject } from '@angular/core';
import { DialogData } from '../edit-note/edit-note.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-collaborator',
  templateUrl: './add-collaborator.component.html',
  styleUrls: ['./add-collaborator.component.scss']
})
export class AddCollaboratorComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private note: DialogData,
    private dialogRef: MatDialogRef<AddCollaboratorComponent>, ) { }

  ngOnInit() {
    console.log(this.note);
  }
}
