import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'courses',
    loadChildren: () =>
      import('../features/courses/routes').then((m) => m.COURSES_ROUTES),
  },
];
