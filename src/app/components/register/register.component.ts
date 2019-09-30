import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  hide = true;

  firstNameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(5)
  ]);

  lastNameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(5)
  ]);

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);

  confirmPasswordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ])

}
