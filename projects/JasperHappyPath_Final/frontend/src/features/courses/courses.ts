import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LinkButtonComponent } from './components/link-button';
import { FlashComponent } from './components/flash';

@Component({
  selector: 'app-courses',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, LinkButtonComponent, FlashComponent],
  template: `
    <app-flash />
    <h1>Courses</h1>
    <div class="flex flex-row gap-4 mb-4">
      <app-link-button label="List Courses" link="list"></app-link-button>
      <app-link-button label="Add Course" link="add"></app-link-button>
    </div>
    <router-outlet />
  `,
  styles: ``,
})
export class CoursesComponent {}
