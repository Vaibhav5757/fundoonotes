import { Component, OnInit } from '@angular/core';
import { UserServiceService } from 'src/app/services/user-service.service';
import { FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordFormGroup: FormGroup;
  token: String

  constructor(private http: UserServiceService, private snackBar: MatSnackBar, private titleService: Title, private route: ActivatedRoute) {
    this.setTitle("Reset Password");

    this.resetPasswordFormGroup = new FormGroup({

      passwordFormController: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),

      confirmFormController: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ])

    }, {
      validators: matchPassword
    })
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.token = params.get("token")
    })
  }

  resetPassword() {
    let obs = this.http.resetPassword({
      newPassword: this.resetPasswordFormGroup.get('passwordFormController').value
    }, this.token)

    obs.subscribe((response) => this.snackBar.open("Password Changed"));
  }
}


function matchPassword(group: AbstractControl): { [key: string]: any } | null {
  let password = group.get('passwordFormController');
  let confirm = group.get('confirmFormController');

  if (password.value === confirm.value) return null;
  else {
    return {
      'Passwords do not Match': true
    };
  }
}