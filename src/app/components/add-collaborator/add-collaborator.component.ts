import { Component, OnInit, Inject } from '@angular/core';
import { DialogData } from '../edit-note/edit-note.component';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { UserServiceService } from 'src/app/services/user-service.service';
import { FormControl, Validators } from '@angular/forms';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'app-add-collaborator',
  templateUrl: './add-collaborator.component.html',
  styleUrls: ['./add-collaborator.component.scss']
})
export class AddCollaboratorComponent implements OnInit {

  allUsers;
  searchedUsers;
  searchUserString = new FormControl('', [
    Validators.required
  ]);

  constructor(@Inject(MAT_DIALOG_DATA) public note: DialogData,
    private userSvc: UserServiceService, private noteSvc: NoteService,
    private dialogRef: MatDialogRef<AddCollaboratorComponent>,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.allUsers = [];
    let obs = this.userSvc.fetchAllUsers();
    obs.subscribe((response: any) => {
      this.allUsers = response;
    })
  }

  searchUser(str) {
    this.searchedUsers = [];
    for (let user of this.allUsers) {
      if (user.email.includes(str)) {
        this.searchedUsers.push(user.email);
      }
    }
  }

  search(event: any) {
    this.searchUser(this.searchUserString.value);
  }

  searchUserList() {
    // Open Snackbar if no user is selected
    if (this.searchUserString.value === '') {
      this.snackBar.open('Select a User', '', {
        duration: 1500
      })
    } else {
      let obs = this.userSvc.searchUserList({
        searchWord: this.searchUserString.value
      })

      obs.subscribe((response: any) => {

        // Add Collaborator
        let observe = this.noteSvc.addCollaborator(this.note.id, response.data.details[0]);
        let collaboratorDetails = response.data.details[0];
        observe.subscribe((response) => {
          //fetch the Note Again somehow

          //current workaround - just add user to collaborators list
          this.note.collaborators.push(collaboratorDetails);
        })

      }, (error) => {

        this.snackBar.open("Valid User not selected", '', {
          duration: 1500
        })

      })
    }

    this.searchUserString.setValue('');
    this.searchedUsers = [];//Empty list of searched Users
  }

  removeCollaborator(collaborator) {

    let obs = this.noteSvc.removeCollaborator(this.note.id, collaborator.userId);
    obs.subscribe((response) => {
      //remove the collaborator from array
      this.note.collaborators = this.note.collaborators.filter(obj => obj != collaborator)
    }, (error) => {
      // console.log(error.url);
    })
  }
}