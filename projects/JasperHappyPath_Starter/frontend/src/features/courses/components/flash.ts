import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CoursesStore } from '../courses-store';

@Component({
  selector: 'app-flash',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    @if (store.flash()) {
      <div class="toast toast-end pb-4">
        @if (store.hasError()) {
          <div class="alert alert-info">
            <span>{{ store.flash() }}</span>
          </div>
        } @else {
          <div class="alert alert-success">
            <span>{{ store.flash() }}</span>
          </div>
        }
      </div>
    }
  `,
  styles: ``,
})
export class FlashComponent {
  store = inject(CoursesStore);
}
