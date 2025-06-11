import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { injectForm, injectStore, TanStackField } from '@tanstack/angular-form';
import { CoursesStore } from '../courses-store';
@Component({
  selector: 'app-courses-add',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TanStackField],
  template: `
    @if (isSubmitting() === false) {
      <div class="max-w-2xl mx-auto p-6">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title text-2xl mb-6">Add a New Course</h2>

            <form (submit)="handleSubmit($event)" class="space-y-6">
              <ng-container [tanstackField]="form" name="title" #title="field">
                <div class="form-control w-full">
                  <label class="label" [for]="title.api.name">
                    <span class="label-text font-medium">Course Title</span>
                  </label>
                  <input
                    [id]="title.api.name"
                    [name]="title.api.name"
                    [value]="title.api.state.value"
                    type="text"
                    placeholder="Enter course title"
                    class="input input-bordered w-full"
                    (input)="title.api.handleChange($any($event).target.value)"
                  />
                </div>
              </ng-container>

              <ng-container
                [tanstackField]="form"
                name="description"
                #description="field"
              >
                <div class="form-control w-full">
                  <label class="label" [for]="description.api.name">
                    <span class="label-text font-medium">Description</span>
                  </label>
                  <textarea
                    [id]="description.api.name"
                    [name]="description.api.name"
                    [value]="description.api.state.value"
                    placeholder="Enter course description"
                    class="textarea textarea-bordered w-full h-24"
                    (input)="
                      description.api.handleChange($any($event).target.value)
                    "
                  ></textarea>
                </div>
              </ng-container>

              <ng-container
                [tanstackField]="form"
                name="numberOfDays"
                #numberOfDays="field"
              >
                <div class="form-control w-full max-w-xs">
                  <label class="label" [for]="numberOfDays.api.name">
                    <span class="label-text font-medium">Duration (Days)</span>
                  </label>
                  <input
                    [id]="numberOfDays.api.name"
                    [name]="numberOfDays.api.name"
                    [value]="numberOfDays.api.state.value"
                    type="number"
                    min="0"
                    placeholder="0"
                    class="input input-bordered w-full max-w-xs"
                    (input)="
                      numberOfDays.api.handleChange(+$any($event).target.value)
                    "
                  />
                </div>
              </ng-container>

              <div class="card-actions justify-end pt-4">
                <button type="submit" class="btn btn-primary btn-wide">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    } @else {
      <div class="max-w-2xl mx-auto p-6">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title text-2xl mb-6">Submitting...</h2>
            <p class="text-sm">Please wait while we add your course.</p>
          </div>
        </div>
      </div>
    }
  `,
  styles: ``,
})
export class AddComponent {
  store = inject(CoursesStore);

  form = injectForm({
    defaultValues: {
      title: '',
      description: '',
      numberOfDays: 0,
    },
    onSubmit: async ({ value }) => {
      console.log('Submitted values:', value);
      // Here you would typically send the data to your backend API
      // For example:

      await this.store.addCourse(value);
      // After submission, you might want to reset the form or navigate to another page
      this.form.reset();
    },
  });
  isSubmitting = injectStore(this.form, (state) => state.isSubmitting);
  handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.form.handleSubmit();
  }
}
