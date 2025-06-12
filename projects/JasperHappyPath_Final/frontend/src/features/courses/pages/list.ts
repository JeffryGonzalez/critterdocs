import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LinkButtonComponent } from '../components/link-button';
import { CoursesStore } from '../courses-store';

@Component({
  selector: 'app-courses-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LinkButtonComponent],
  template: ` @if (store.error()) {
      <div class="alert alert-error">
        <p class="text-xl">Error loading courses!</p>
        <p>Perhaps you haven't implemented the API Yet?</p>
      </div>
    } @else if (store.isLoading()) {
      <p>Loading courses...</p>
    } @else {
      <h1 class="text-2xl font-bold mb-4">Courses List</h1>

      <ul class="flex flex-auto flex-wrap gap-4 justify-center">
        @for (course of store.courses(); track course.id) {
          <li class="w-1/4">
            <div class="card bg-accent-content shadow-xl">
              <div class="card-body">
                <h2 class="card-title">{{ course.title }}</h2>
                <p>{{ course.description }}</p>
                @if (course.instructor) {
                  <p class="text-sm">Instructor: {{ course.instructor }}</p>
                } @else {
                  <p class="text-sm">Instructor: Unknown</p>
                }
                <p>{{ course.numberOfDays }} days</p>
                <div class="card-actions justify-end">
                  <app-link-button
                    makeActive
                    [link]="['..', 'details', course.id]"
                    label="View Details"
                  ></app-link-button>
                </div>
              </div>
            </div>
          </li>
        } @empty {
          <li>
            <app-link-button
              label="No Courses Available. Add One?"
              [link]="['..', 'add']"
              makeActive
            />
          </li>
        }
      </ul>
    }`,
  styles: ``,
})
export class ListComponent {
  store = inject(CoursesStore);
}
