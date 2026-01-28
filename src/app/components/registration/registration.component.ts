import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { User } from '../../interfaces/user';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [InputTextModule, FloatLabelModule, FormsModule, PasswordModule, ButtonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {

  user: User = {
    id: '',
    name: '',
    email: '',
    password: '',
    role: '',
    secret: '',
    reg: new Date(),
    status: true
  };

  constructor(
    private api: ApiService,
    private router: Router
  ) { }


  save() {
    let data = {
      name: this.user.name,
      email: this.user.email,
      password: this.user.password,
      confirm: this.user.confirm,
      phone: this.user.phone,
      address: this.user.address
    };

    this.api.registration('users', data).subscribe({
      next: (res) => {
        alert('Registration successful! You can log in now.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert(err.error);
        console.error(err);
      }
    });
  }
}
