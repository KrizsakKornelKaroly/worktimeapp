import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { User } from '../../interfaces/user';
import { WorkTime } from '../../interfaces/worktime';
import { ApiService } from '../../services/api.service';
import { TableModule } from 'primeng/table';
import { DatePipe } from '@angular/common';
import { ButtonModule } from "primeng/button";
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-worktimes',
  standalone: true,
  imports: [SelectModule, FloatLabelModule, FormsModule, TableModule, DatePipe, ButtonModule, RouterModule],
  templateUrl: './worktimes.component.html',
  styleUrl: './worktimes.component.scss'
})
export class WorktimesComponent {

  users: User[] = [];
  selectedUser: User | null = null;

  worktimes: WorkTime[] = [];

  constructor(
    private api: ApiService
  ){}

  ngOnInit() : void {
    this.getUsers();
  }

  getUsers(): void {
    this.api.selectAll('users').subscribe({
      next: (res) => {
        this.users = res as User[];
        this.users.forEach(user => {
          user.name = user.name + ' (' + user.email + ')';
        });
        this.users.sort((a, b) => a.name.localeCompare(b.name));
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
    this.getWorkTimes(null);
  }

  getWorkTimes(id: string | null): void {
    if (id) {
      this.api.selectByField('worktimes', 'userId', 'eq', id).subscribe({
        next: (res) => {
          this.worktimes = res as WorkTime[];
        },
        error: (error) => {
          console.error('Error fetching worktimes:', error.error.error);
        }
      });
    }
    else {
      this.api.selectAll('worktimes').subscribe({
        next: (res) => {
          this.worktimes = res as WorkTime[];
          this.worktimes.forEach(worktime => {
            worktime.user = this.users.find(user => user.id === worktime.userId) || null;
          });
        },
        error: (error) => {
          console.error('Error fetching worktimes:', error.error.error);
        }
      });
    }

  }

  delete(id: string){
    
  }

}
