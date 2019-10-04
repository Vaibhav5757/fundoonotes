import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordFormGroup: FormGroup;
  token: String

  constructor(private http: HttpServiceService, private route: ActivatedRoute) {
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

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.token = params.get("token")
    })
  }

  resetPassword() {
    this.http.resetPassword({
      password: this.resetPasswordFormGroup.get('passwordFormController').value
    },{
      token: this.token,
    })
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