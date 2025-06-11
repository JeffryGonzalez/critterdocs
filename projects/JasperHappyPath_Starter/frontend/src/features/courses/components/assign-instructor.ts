import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { injectForm, TanStackField } from '@tanstack/angular-form';
import { CourseListModel } from '../types';
import { CoursesStore } from '../courses-store';

@Component({
  selector: 'app-courses-assign-instructor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TanStackField],
  template: `
    <button class="btn btn-primary btn-sm" onclick="assign_modal.showModal()">
      Assign Instructor
    </button>
    <dialog id="assign_modal" class="modal" #assignModal>
      <div class="modal-box">
        <h3 class="text-lg font-bold mb-2">Assign An Instructor</h3>
        <div class="divider my-2"></div>
        <div class="modal-action flex flex-col">
          <form (submit)="handleSubmit($event)" class="w-full space-y-4">
            <ng-container
              [tanstackField]="form"
              name="instructor"
              #instructor="field"
            >
              <div class="form-control w-full">
                <label for="instructor" class="label">
                  <span class="label-text font-medium">Instructor Name</span>
                </label>
                <input
                  id="instructor"
                  type="text"
                  class="input input-bordered w-full focus:input-primary"
                  [value]="instructor.api.state.value"
                  (input)="
                    instructor.api.handleChange($any($event).target.value)
                  "
                  placeholder="Enter instructor's full name"
                  autocomplete="name"
                />
              </div>
            </ng-container>
            <div class="flex justify-end gap-2 mt-6">
              <button class="btn" type="button" (click)="cancel()">
                Cancel
              </button>
              <button class="btn btn-primary" type="submit">
                Assign Instructor
              </button>
            </div>
          </form>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  `,
  styles: ``,
})
export class AssignInstructorComponent {
  modal = viewChild<ElementRef<HTMLDialogElement>>('assignModal');
  course = input.required<CourseListModel>();
  instructorAssigned = output<void>();
  store = inject(CoursesStore);
  form = injectForm({
    defaultValues: {
      instructor: '',
    },
    onSubmit: async ({ value }) => {
      const course = this.course();
      if (course) {
        await this.store.assignInstructor(course.id, value.instructor);
      }
      this.instructorAssigned.emit();
      this.cancel();
    },
  });

  constructor() {
    effect(() => {
      const course = this.course();
      if (course) {
        this.form.setFieldValue('instructor', course.instructor || '');
      }
    });
  }

  cancel() {
    const m = this.modal();
    if (m) {
      m.nativeElement.close();
    }
  }

  handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.form.handleSubmit();
  }
}
