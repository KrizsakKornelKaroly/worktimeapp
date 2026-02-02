import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from "@angular/router";
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { User } from '../../interfaces/user';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { WorkTime } from '../../interfaces/worktime';
import { ApiService } from '../../services/api.service';
import moment from 'moment';

@Component({
  selector: 'app-worktimes-form',
  standalone: true,
  imports: [ButtonModule, RouterModule, SelectModule, FloatLabelModule, FormsModule, DatePickerModule],
  templateUrl: './worktimes-form.component.html',
  styleUrl: './worktimes-form.component.scss'
})
export class WorktimesFormComponent {
  users: User[] = [];

  worktime: WorkTime = {
    date: new Date(),
    start: '',
    end: '',
    userId: ''
  }

  constructor(
    private api: ApiService
  ) { }

  ngOnInit(): void {
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
  }

  save() {
    let data: WorkTime = {
      userId: this.worktime.userId,
      date: this.worktime.date,
      start: moment(this.worktime.start).format('HH:mm').toString(),
      end: moment(this.worktime.end).format('HH:mm').toString()
    };

    this.api.insert('worktimes', data).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (error) => {
        console.error('Error saving worktime:', error.error.error);
      }
    });
  }

}
