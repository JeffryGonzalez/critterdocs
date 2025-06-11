import {
  Component,
  ChangeDetectionStrategy,
  input,
  booleanAttribute,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-link-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: ` <a
    [routerLinkActive]="''"
    class="btn hover:ring-2 hover:ring-primary "
    [routerLink]="link()"
    #linkId="routerLinkActive"
    [class.btn-sm]="makeActive()"
    [class.btn-primary]="linkId.isActive || makeActive()"
    [class.btn-ghost]="!linkId.isActive && !makeActive()"
    [class.underline]="linkId.isActive || makeActive()"
    >{{ label() }}
  </a>`,
  styles: ``,
})
export class LinkButtonComponent {
  label = input.required<string>();
  link = input.required<string | string[]>();
  makeActive = input(false, {
    transform: booleanAttribute,
  });
}
