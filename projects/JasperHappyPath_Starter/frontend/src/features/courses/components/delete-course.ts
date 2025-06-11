import {
  Component,
  ChangeDetectionStrategy,
  input,
  ElementRef,
  viewChild,
  output,
  inject,
} from '@angular/core';
import { CourseListModel } from '../types';
import { CoursesStore } from '../courses-store';

@Component({
  selector: 'app-courses-delete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <!-- Open the modal using ID.showModal() method -->
    <button class="btn btn-error btn-sm" onclick="my_modal_1.showModal()">
      Delete Course
    </button>
    <dialog id="my_modal_1" class="modal" #modal>
      <div class="modal-box">
        <h3 class="text-lg font-bold">Delete {{ course().title }}</h3>
        <p class="py-4">Press ESC key or click the button below to close</p>
        <div class="modal-action">
          <!-- if there is a button in form, it will close the modal -->

          <button class="btn btn-error" (click)="cancel()">Cancel</button>
          <button class="btn btn-primary" (click)="delete()">Delete</button>
        </div>
      </div>
    </dialog>
  `,
  styles: ``,
})
export class DeleteCourseComponent {
  modal = viewChild<ElementRef<HTMLDialogElement>>('modal');
  course = input.required<CourseListModel>();
  deleted = output<void>();
  store = inject(CoursesStore);

  cancel() {
    const m = this.modal();
    if (m) {
      m.nativeElement.close();
    }
  }
  async delete() {
    await this.store.delete(this.course().id);
    this.deleted.emit();
  }
}
