import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(private router: Router, private http: HttpServiceService) {
    this.loginForm = new FormGroup({
      
      emailFormControl: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      
      passwordFormControl: new FormControl('', [
        Validators.required
      ])
    })
  }

  onClick(): void {
    this.router.navigateByUrl('/register');
  }

  logIn(): void {
    this.http.logIn({
      email: this.loginForm.get('emailFormControl').value,
      password: this.loginForm.get('passwordFormControl').value
    })
  }

}


