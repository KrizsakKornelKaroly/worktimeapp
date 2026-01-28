import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) { }

  items: MenuItem[] | undefined;
  isLoggedIn: boolean = false;

  ngOnInit() {

    this.auth.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      setTimeout(() => {
        this.setupMenu();
      }, 50);
    });

    if (this.isLoggedIn) {
      this.router.navigate(['/home']);
    }
  }


  setupMenu() {
    this.items = [

      //always visible
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: '/home'
      },

      //isloggedin true

      ...this.isLoggedIn ? [
        {
          label: 'Users',
          icon: 'pi pi-star',
          routerLink: '/users'
        },
        {
          label: 'Worktimes',
          icon: 'pi pi-envelope',
          routerLink: '/worktimes'
        },
        {
          label: 'Statistics',
          icon: 'pi pi-chart-bar',
          routerLink: '/statistics'
        },
        {
          label: 'Logout',
          icon: 'pi pi-sign-out',
          routerLink: '/logout'
        },
      ] : [
        //isloggedin false
        {
          label: 'Login',
          icon: 'pi pi-sign-in',
          routerLink: '/login'
        },
        {
          label: 'Register',
          icon: 'pi pi-user-plus',
          routerLink: '/registration'
        }
      ],
    ]

  }
}
