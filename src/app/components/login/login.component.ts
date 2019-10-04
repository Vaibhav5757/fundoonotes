import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(private router: Router, private http: HttpServiceService, private titleService: Title) {
    this.setTitle("LogIn");
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

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  onClick(): void {
    this.router.navigateByUrl('/register');
  }

  logIn(): void {
    this.http.logIn({
      email: this.loginForm.get('emailFormControl').value,
      password: this.loginForm.get('passwordFormControl').value
    })
    this.loginForm.reset();
  }

  forgotPassword(): void {
    this.http.forgotPassword({
      email: this.loginForm.get('emailFormControl').value
    })
  }

}


