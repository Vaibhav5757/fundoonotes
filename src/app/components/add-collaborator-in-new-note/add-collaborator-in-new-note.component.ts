import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { UserServiceService } from 'src/app/services/user-service.service';
import { FormControl, Validators } from '@angular/forms';

interface DialogDataForUser {
  firstName,
  lastName,
  user,
  email
}

@Component({
  selector: 'app-add-collaborator-in-new-note',
  templateUrl: './add-collaborator-in-new-note.component.html',
  styleUrls: ['./add-collaborator-in-new-note.component.scss']
})
export class AddCollaboratorInNewNoteComponent implements OnInit {

  allUsers;
  searchedUsers;
  searchUserString = new FormControl('', [
    Validators.required
  ]);

  constructor(@Inject(MAT_DIALOG_DATA) public user: DialogDataForUser,
    private dialogRef: MatDialogRef<AddCollaboratorInNewNoteComponent>,
    private userSvc: UserServiceService,
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
        
        this.user.user.collaborators.push(response.data.details[0]);

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
    this.user.user.collaborators = this.user.user.collaborators.filter(obj => obj != collaborator);
  }

  closeDialogBox() {
    this.dialogRef.close({
      user: this.user
    });
  }

}
