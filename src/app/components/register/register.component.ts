import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  hide = true;

  registrationForm: FormGroup;

  constructor(private http: HttpServiceService) {
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


      passwordFormControl: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),

      confirmPasswordFormControl: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ])
    })
  }

  ngOnInit() {
  }


  signUp(): any {
    if (this.registrationForm.get('passwordFormControl').value === this.registrationForm.get('confirmPasswordFormControl').value) {
      this.http.signUp({
        firstName: this.registrationForm.get('firstNameFormControl').value,
        lastName: this.registrationForm.get('lastNameFormControl').value,
        email: this.registrationForm.get('emailFormControl').value + '@gmail.com',
        password: this.registrationForm.get('passwordFormControl').value,
        service: "basic"
      })
    }
  }

}
