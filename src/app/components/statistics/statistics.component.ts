import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { DatePickerModule } from 'primeng/datepicker';
import { User } from '../../interfaces/user';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [ChartModule, DatePickerModule, FormsModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent {
  data: any;
  options: any;

  date: Date = new Date();
  users: User[] = [];

  constructor(
    private api: ApiService
  ){}

  ngOnInit() {
    this.getUsers();
    this.initChart();
  }

  initChart() {

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          type: 'line',
          label: 'Átlag munkaidő',
          borderColor: documentStyle.getPropertyValue('--p-orange-500'),
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          data: [50, 25, 12, 48, 56, 76, 42]
        },
        {
          type: 'bar',
          label: 'Dataset 2',
          backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
          data: [21, 84, 24, 75, 37, 65, 34],
          borderColor: 'white',
          borderWidth: 2
        },
        {
          type: 'bar',
          label: 'Dataset 3',
          backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
          data: [41, 52, 24, 74, 23, 21, 32]
        }
      ]
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        }
      }
    };
  }

  refreshChartData() {
    this.getSelectedMonthDays();
    this.getAvgWorkTimes();

    this.users.forEach(user => {
      this.getUserWorkTimes(user.id);
    });

    this.initChart();
  };

  getSelectedMonthDays() { }

  getAvgWorkTimes() { }

  getUserWorkTimes(userId: string) { }

  getUsers() {
    this.api.selectByField('users', 'status', 'eq', '1').subscribe({
      next: (res) => {
        this.users = res as User[];
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
      
    });
  }


}
