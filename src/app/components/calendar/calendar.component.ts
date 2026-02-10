import { Component } from '@angular/core';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { ApiService } from '../../services/api.service';
import { Days } from '../../interfaces/days';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {

  holidays: object[] = [];

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.getHolidayData();
  }


  getHolidayData() {
    this.api.getHolidays('worktimes').subscribe({
      next: (data) => {
        const holidaysData = data as Days[];

        this.holidays = holidaysData.map(h => ({
          date: h.date,
          title: h.name
        }));

        this.renderCalendar();
      },
      error: (error) => {
        console.error('Error fetching holidays:', error);
      }
    });
  }


  renderCalendar() {
    let calendarEl = document.getElementById('calendar');
    let calendar = new Calendar(calendarEl!, {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
      initialView: 'dayGridMonth',
      locale: 'hu',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,listWeek'
      },
      buttonText: {
        today: 'Ma',
        month: 'Hónap',
        week: 'Hét',
        day: 'Nap',
        list: 'Lista',
      },
      firstDay: 1,
      events: this.holidays
    });
    calendar.render();
  }

}
