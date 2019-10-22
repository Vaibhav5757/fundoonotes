import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DialogData } from '../edit-note/edit-note.component';
import { FormControl, Validators } from '@angular/forms';
import { NoteService } from 'src/app/services/note.service';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';

@Component({
  selector: 'app-edit-label',
  templateUrl: './edit-label.component.html',
  styleUrls: ['./edit-label.component.scss']
})
export class EditLabelComponent implements OnInit {

  allLabels;
  label = new FormControl('', [
  ])

  constructor(@Inject(MAT_DIALOG_DATA) private labels: DialogData,
    private dialogRef: MatDialogRef<EditLabelComponent>,
    private noteSvc: NoteService,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService) { }

  ngOnInit() {
    this.fetchAllLabels();
  }

  fetchAllLabels() {
    let obs = this.noteSvc.fetchAllLabel();
    obs.subscribe((response: any) => {
      this.allLabels = response.data.details;
    })
  }

  addLabel() {
    if (this.label.value != "") {
      let data = {
        label: this.label.value,
        userId: this.storage.get('user')["userId"],
        isDeleted: false
      }
      let obs = this.noteSvc.addLabelWithoutNote(data);
      obs.subscribe((response) => {
        this.fetchAllLabels();
        this.label.setValue("");
      })
    }
  }

  deleteLabel(labelToBeDeleted) {
    let obs = this.noteSvc.deleteLabel({
      id: labelToBeDeleted.id
    })
    obs.subscribe((response) => {
      this.fetchAllLabels();
    })
  }

  updateLabel(labelToBeUpdate) {
    console.log(labelToBeUpdate);
    let data = {
      id: labelToBeUpdate.id,
      isDeleted: false,
      label: this.label.value,
      userId: this.storage.get('user')["userId"]
    }
    let obs = this.noteSvc.updateLabel(data);
    obs.subscribe((response) => {
      this.fetchAllLabels();
      this.label.setValue('');
    })
  }

}
