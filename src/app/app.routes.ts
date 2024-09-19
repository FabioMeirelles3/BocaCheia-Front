import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RestaurantListComponent } from './pages/restaurant-list/restaurant-list.component';
import { RestaurantDetailComponent } from './pages/restaurant-detail/restaurant-detail.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginGuard } from './core/guards/login.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'restaurants',
        component: RestaurantListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'restaurants/:id',
        component: RestaurantDetailComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];
