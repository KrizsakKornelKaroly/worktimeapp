import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { HomeComponent } from './components/home/home.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { WorktimesComponent } from './components/worktimes/worktimes.component';
import { UsersComponent } from './components/users/users.component';
import { LogoutComponent } from './components/logout/logout.component';
import { WorktimesFormComponent } from './components/worktimes-form/worktimes-form.component';
import { CalendarComponent } from './components/calendar/calendar.component';

export const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'users',
        component: UsersComponent
    },
    {
        path: 'worktimes',
        children: [
            {
                path: '',
                component: WorktimesComponent
            },
            {
                path: 'new',
                component: WorktimesFormComponent
            },
            {
                path: ':id',
                component: WorktimesFormComponent
            }
        ]
    },
    {
        path: 'statistics',
        component: StatisticsComponent
    },
    {
        path: 'calendar',
        component: CalendarComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'logout',
        component: LogoutComponent
    },
    {
        path: 'registration',
        component: RegistrationComponent
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
