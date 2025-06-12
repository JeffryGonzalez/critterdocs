import { Routes } from '@angular/router';
import { CoursesComponent } from './courses';
import { AddComponent } from './pages/add';
import { ListComponent } from './pages/list';
import { DetailsComponent } from './pages/details';
import { CoursesStore } from './courses-store';
export const COURSES_ROUTES: Routes = [
  {
    path: '',
    component: CoursesComponent,
    providers: [CoursesStore],
    children: [
      {
        path: 'add',
        component: AddComponent,
      },
      {
        path: 'list',
        component: ListComponent,
      },

      {
        path: 'details/:id',
        component: DetailsComponent,
      },
      {
        path: '**',
        redirectTo: 'list',
      },
    ],
  },
];
