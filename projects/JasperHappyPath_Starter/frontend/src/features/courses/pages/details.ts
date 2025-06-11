import {
  Component,
  ChangeDetectionStrategy,
  input,
  resource,
  inject,
} from '@angular/core';
import { CourseListModel } from '../types';
import { DeleteCourseComponent } from '../components/delete-course';
import { Router } from '@angular/router';
import { AssignInstructorComponent } from '../components/assign-instructor';

@Component({
  selector: 'app-courses-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DeleteCourseComponent, AssignInstructorComponent],
  template: `
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        @if (course.isLoading()) {
          <p>Loading...</p>
        } @else if (course.error()) {
          <p>Error loading course details</p>
        } @else {
          @let c = course.value()!;
          <h2 class="card-title">{{ c.title }}</h2>
          <p>{{ c.description }}</p>
          @if (c.instructor) {
            <p class="text-sm">Instructor: {{ c.instructor }}</p>
          } @else {
            <p class="text-sm">Instructor: Unknown</p>
          }
          <p>{{ c.numberOfDays }} days</p>
          <div class="card-actions justify-end">
            <app-courses-delete
              [course]="course.value()!"
              (deleted)="onDeleted()"
            ></app-courses-delete>
            <app-courses-assign-instructor
              [course]="course.value()!"
              (instructorAssigned)="onInstructorAssigned()"
            ></app-courses-assign-instructor>
          </div>
        }
      </div>
    </div>
  `,
  styles: ``,
})
export class DetailsComponent {
  id = input.required<string>();
  router = inject(Router);

  onDeleted() {
    this.router.navigate(['/courses']);
  }
  course = resource({
    params: () => ({ id: this.id() }),
    loader: ({ params }) =>
      fetch(`/api/courses/${params.id}`).then(
        (response) => response.json() as Promise<CourseListModel>,
      ),
  });
  onInstructorAssigned() {
    this.course.reload(); // Handle the event when an instructor is assigned
  }
}
