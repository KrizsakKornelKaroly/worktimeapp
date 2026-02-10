import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { InputIconModule } from 'primeng/inputicon';
import { User } from '../../interfaces/user';
import { ApiService } from '../../services/api.service';
import moment from 'moment';
import { WorkTime } from '../../interfaces/worktime';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserDataset } from '../../interfaces/userDataset';



@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [ChartModule, CalendarModule, FormsModule, InputIconModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})

export class StatisticsComponent implements OnInit, OnDestroy {

  // A naptárban kiválasztott hónap.
  date: Date  = new Date();

  // A PrimeNG diagramhoz tartozó adatstruktúra.
  data: any;

  // A diagram megjelenítési beállításai.
  options: any;

  // Az aktív felhasználók listája, akikhez munkaidők tartoznak.
  users: User[] = [];

  // A kiválasztott hónap minden napjának (MM-DD) címkéje.
  monthDays: string[] = [];

  // Napi átlag munkaórák tömbje, melyet a vonaldiagram használ.
  avgWorkTimePerDays: number[] = [];

  // Napi összes ledolgozott percek minden felhasználótól együtt.
  sumMinutesPerDay: number[] = [];

  // Naponta hány felhasználónak volt munkaidő bejegyzése.
  countUsersWithDataPerDay: number[] = [];

  // A párhuzamos munkaidő lekérésekhez tartozó feliratkozás referenciája.
  private worktimeSubscription?: Subscription;

  constructor(private api: ApiService){}

  // Inicializálja az alapértelmezett diagram adatokat és betölti a felhasználókat.
  ngOnInit(): void {
    this.initializeChart();
    this.getUsers();
  }

  // Takarítja a feliratkozásokat a komponens megszűnésekor.
  ngOnDestroy(): void {
    this.worktimeSubscription?.unsubscribe();
  }

  // Újratölti az adott hónap statisztikáit és felépíti a diagramot.
  refreshData(){
    if(!this.users.length){
      this.initializeChart();
      return;
    }

    this.getSelectedMonthDays();
    this.resetAggregations();

    const worktimeRequests = this.users.map(user => this.getUserWorkTimes(user));

    if(!worktimeRequests.length){
      this.renderChart();
      return;
    }

    this.worktimeSubscription?.unsubscribe();

    this.worktimeSubscription = forkJoin(worktimeRequests).subscribe({
      next: (datasets) => {
        this.getAvgWorkTimes();
        this.renderChart(datasets);
      },
      error: (err) => {
        console.log(err);
        this.renderChart();
      }
    });
  }

  // Megrajzolja a napi átlagot és felhasználói adatokat tartalmazó kombinált grafikont.
  renderChart(userDatasets: UserDataset[] = []){
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    const barColors = [
      '--green-500',
      '--orange-500',
      '--purple-500',
      '--yellow-500',
      '--pink-500',
      '--cyan-500'
    ];

    const barDatasets = userDatasets.map((dataset, index) => {
      const colorVar = barColors[index % barColors.length];
      const backgroundColor = documentStyle.getPropertyValue(colorVar) || '#6c757d';

      return {
        type: 'bar',
        label: dataset.label,
        backgroundColor,
        borderColor: 'transparent',
        borderWidth: 0,
        data: dataset.data
      };
    });

    this.data = {
        labels: this.monthDays,
        datasets: [
            {
                type: 'line',
                label: 'Átlag munkaidő (óra)',
                borderColor: documentStyle.getPropertyValue('--blue-500') || '#2196F3',
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                data: this.avgWorkTimePerDays
            },
            ...barDatasets
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

  // Összegyűjti a kiválasztott hónap összes napját címkézéshez.
  getSelectedMonthDays(){
    const y = this.date.getFullYear();
    const m = this.date.getMonth();

    const first = new Date(y, m, 1);
    const last = new Date(y, m +1, 0);

    this.monthDays = [];

    for(let d = new Date(first); d<= last; d.setDate(d.getDate() + 1)){
      this.monthDays.push(moment(d).format('MM-DD'));
    }

  }

  // Kiszámítja a napi átlag munkaidőt a felhasználói adatokból.
  getAvgWorkTimes(){
    this.avgWorkTimePerDays = this.sumMinutesPerDay.map((sum, index) => {
      const userCount = this.countUsersWithDataPerDay[index];
      if(!userCount){
        return 0;
      }

      return this.minutesToHours(sum / userCount);
    });
  }

  // Lekéri és feldolgozza az adott felhasználó munkaidejét napokra bontva.
  getUserWorkTimes(user: User){
      return this.api.selectByField('worktimes', 'userId', 'eq', user.id).pipe(
        map((res) => {
          const worktimes = res as WorkTime[];
          const filteredWorktimes = this.filterWorktimesBySelectedMonth(worktimes);
          const minutesPerDay = this.aggregateMinutesPerDay(filteredWorktimes);

          minutesPerDay.forEach((minutes, index) => {
            if(minutes > 0){
              this.sumMinutesPerDay[index] += minutes;
              this.countUsersWithDataPerDay[index] += 1;
            }
          });

          return {
            label: user.name,
            data: minutesPerDay.map(minutes => this.minutesToHours(minutes))
          } as UserDataset;
        })
      );
  }

  // Betölti az aktív felhasználókat, majd újraszámolja a statisztikát.
  getUsers(){
    this.api.selectByField('users', 'status', 'eq', '1').subscribe({
        next: (res) => {
          this.users = res as User[];
          this.refreshData();
        },
        error: (err) => {
          console.log(err.error.error);
        }
    });
  }

  // Üres adatsorral inicializálja a grafikont és a belső állapotot.
  private initializeChart(){
    this.getSelectedMonthDays();
    this.resetAggregations();
    this.renderChart();
  }

  // Lenullázza a napi összegek és számlálók tárolóit.
  private resetAggregations(){
    this.sumMinutesPerDay = new Array(this.monthDays.length).fill(0);
    this.countUsersWithDataPerDay = new Array(this.monthDays.length).fill(0);
    this.avgWorkTimePerDays = new Array(this.monthDays.length).fill(0);
  }

  // Csak a kiválasztott hónapba eső munkaidő bejegyzéseket tartja meg.
  private filterWorktimesBySelectedMonth(worktimes: WorkTime[]): WorkTime[]{
    const selectedMonth = moment(this.date).format('YYYY-MM');
    return worktimes.filter(w => moment(w.date).format('YYYY-MM') === selectedMonth);
  }

  // Napokra összegezve visszaadja, hány percet dolgoztak a felhasználók.
  private aggregateMinutesPerDay(worktimes: WorkTime[]): number[]{
    const minutesPerDay = new Array(this.monthDays.length).fill(0);

    worktimes.forEach(worktime => {
      const dayKey = moment(worktime.date).format('MM-DD');
      const dayIndex = this.monthDays.indexOf(dayKey);

      if(dayIndex > -1){
        const minutes = this.calculateMinutesBetween(worktime.date, worktime.start, worktime.end);
        minutesPerDay[dayIndex] += minutes;
      }
    });

    return minutesPerDay;
  }

  // Egy nap kezdő és záró ideje között eltelt perceket számolja ki.
  private calculateMinutesBetween(date: string | Date, start?: string, end?: string): number {
    if(!start || !end){
      return 0;
    }

    const base = moment(date).format('YYYY-MM-DD');
    const startMoment = moment(`${base} ${start}`, 'YYYY-MM-DD HH:mm');
    const endMoment = moment(`${base} ${end}`, 'YYYY-MM-DD HH:mm');

    if(!startMoment.isValid() || !endMoment.isValid()){
      return 0;
    }

    const diff = endMoment.diff(startMoment, 'minutes');
    return diff > 0 ? diff : 0;
  }

  // Percet órára konvertál két tizedes pontossággal.
  private minutesToHours(minutes: number): number {
    return Number((minutes / 60).toFixed(2));
  }

}
