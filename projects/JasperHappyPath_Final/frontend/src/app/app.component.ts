import { Component } from '@angular/core';

import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <nav class="flex flex-row gap-4 p-4 bg-gray-800 text-white">
      <span class="text-xl font-black text-orange-400 mr-12">JasperFx Demos</span>
      <a class="link" routerLink="/">Home</a>
      <a class="link" routerLink="/courses">Courses</a>
    </nav>
    <main class="container mx-auto">
      <router-outlet />
    </main>
  `,
  styles: [],
  imports: [RouterOutlet, RouterLink],
})
export class AppComponent {}
