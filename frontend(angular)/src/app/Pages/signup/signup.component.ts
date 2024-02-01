import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../Services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {

  myForm: FormGroup = new FormGroup({});
  data: any
  fetchErrorMsg: string = ''

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    if (localStorage.getItem("user_token")) {
      this.router.navigate(['/']);

    }
  }

  ngOnInit() {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });


  }

  handleReactiveForm() {
    if (this.myForm.valid) {
      this.authService.signup(this.myForm.value).subscribe(
        data => {
          this.data = data
          this.fetchErrorMsg = ''
          this.router.navigate(['/login']);
        },
        error => {
          this.fetchErrorMsg = error.error.error.msg
        });
    } else {
      console.log("Form is invalid");
    }
  }
}
