import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  fetchErrorMsg: string = ''


  constructor(private authService: AuthService, private router: Router) {

    if (localStorage.getItem("user_token")) {
      this.router.navigate(['/']);

    }
  }

  handleLoginForm(loginForm: Object) {
    this.authService.signin(loginForm).subscribe(
      data => {
        console.log(data)
        this.fetchErrorMsg = ''
        // set token in local storage

        localStorage.setItem("user_token", data.token)
        localStorage.setItem("isAdmin", data.isAdmin)
        this.router.navigate(['/']);
      },
      error => {
        this.fetchErrorMsg = error.error.error.msg
      });

  }
}
