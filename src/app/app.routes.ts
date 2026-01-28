import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { HomeComponent } from './components/home/home.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { WorktimesComponent } from './components/worktimes/worktimes.component';
import { UsersComponent } from './components/users/users.component';
import { LogoutComponent } from './components/logout/logout.component';

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
        component: WorktimesComponent
    },
    {
        path: 'statistics',
        component: StatisticsComponent
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
