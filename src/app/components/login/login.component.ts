import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { User } from '../../interfaces/user';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CheckboxModule } from 'primeng/checkbox';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputTextModule, FloatLabelModule, FormsModule, PasswordModule, ButtonModule, CheckboxModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(
    private api: ApiService,
    private router: Router,
    private auth: AuthService
  ) { }

  keepLoggedIn: boolean = false;
  user: User = {
    id: '',
    name: '',
    email: '',
    password: '',
    role: '',
    secret: '',
    reg: new Date(),
    status: false
  }

  login() {

    let data = {
      email: this.user.email,
      password: this.user.password
    }

    this.api.login('users', data).subscribe({
      next: (res) => {
        if (this.keepLoggedIn) {
          this.auth.storeUser((res as any).token);
        }
        this.auth.login((res as any).token);
        alert('Login successful');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        alert('Login failed');
        console.log(err);
      }

    });
  }

}
