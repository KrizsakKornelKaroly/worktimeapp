import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { User } from '../../interfaces/user';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, TableModule, Button],
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
        console.log(res);
        this.users = res as User[];
      },
      error: (err) => {
        console.error(err.error.error);
      }
    })
  }
}
