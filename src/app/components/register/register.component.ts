import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { UserServiceService } from 'src/app/services/user-service.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { ProductsCartService } from 'src/app/services/products-cart.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  hide: Boolean = true;

  registrationForm: FormGroup;

  constructor(private userSvc: UserServiceService, private titleService: Title, 
    private snackBar: MatSnackBar, private router: Router,
    private prodSvc: ProductsCartService) {
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

  onClick(): void {
    this.router.navigateByUrl('/login');
  }


  signUp(): any {
    if (this.registrationForm.valid) {
      
      let cartDetails = this.prodSvc.getServiceType();

      let obs = this.userSvc.signUp({
        firstName: this.registrationForm.get('firstNameFormControl').value,
        lastName: this.registrationForm.get('lastNameFormControl').value,
        email: this.registrationForm.get('emailFormControl').value + '@gmail.com',
        password: this.registrationForm.get('passwordGroup').get('passwordFormControl').value,
        service: cartDetails.service,
        cartId: cartDetails.cartId
      });

      obs.subscribe((response) => {
        if (response["data"].success) {
          this.router.navigateByUrl("/login");
        }
      });

      this.registrationForm.reset();
    } else {

      if (this.registrationForm.get('firstNameFormControl').invalid) {
        this.snackBar.open("First Name Required and should have at least 5 alphabets", '', {
          duration: 1500
        });
      }

      if (this.registrationForm.get('lastNameFormControl').invalid) {
        this.snackBar.open("Last Name Required and should have at least 5 alphabets", '', {
          duration: 1500
        });
      }

      if (this.registrationForm.get('passwordGroup').invalid) {
        this.snackBar.open("Errors in Password", '', {
          duration: 1500
        });
      }

      if (this.registrationForm.get('emailFormControl').invalid) {
        this.snackBar.open("Invalid Email Address", '', {
          duration: 1500
        });
      }
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
