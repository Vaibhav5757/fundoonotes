import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  hide: Boolean = true;

  registrationForm: FormGroup;

  constructor(private http: HttpServiceService, private titleService: Title) {
    this.setTitle("Sign Up");

    this.registrationForm = new FormGroup({
      firstNameFormControl: new FormControl('', [
        Validators.required,
        Validators.minLength(5)
      ]),

      lastNameFormControl: new FormControl('', [
        Validators.required,
        Validators.minLength(5)
      ]),

      emailFormControl: new FormControl('', [
        Validators.required
      ]),

      passwordGroup: new FormGroup({
        passwordFormControl: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),

        confirmPasswordFormControl: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ])
      }, {
        validators: matchPassword
      })
    })
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  ngOnInit() {
  }


  signUp(): any {
    if (this.registrationForm.valid) {
      this.http.signUp({
        firstName: this.registrationForm.get('firstNameFormControl').value,
        lastName: this.registrationForm.get('lastNameFormControl').value,
        email: this.registrationForm.get('emailFormControl').value + '@gmail.com',
        password: this.registrationForm.get('passwordGroup').get('passwordFormControl').value,
        service: "basic"
      });
      this.registrationForm.reset();
    }
  }
}

function matchPassword(group: AbstractControl): { [key: string]: any } | null {
  let password = group.get('passwordFormControl');
  let confirm = group.get('confirmPasswordFormControl');

  if (password.value === confirm.value) return null;
  else {
    return {
      'Passwords do not Match': true
    };
  }
}
