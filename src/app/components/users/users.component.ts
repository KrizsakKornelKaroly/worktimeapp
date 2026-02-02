import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { User } from '../../interfaces/user';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, TableModule, Button, ToggleSwitchModule, FormsModule, IconFieldModule, InputIconModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  constructor(
    private api: ApiService
  ){} 

  users: User[] = [];

  ngOnInit() {
    this.getUsers()
  }

  getUsers(){
    this.api.selectAll('users').subscribe({
      next: (res) => {
        this.users = res as User[];
        this.users.forEach(user => {
          user.status = user.status ? true : false;
        });
      },
      error: (err) => {
        console.error(err.error.error);
      }
    })
  }
}
