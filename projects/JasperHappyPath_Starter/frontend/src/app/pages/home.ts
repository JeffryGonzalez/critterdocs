import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div class="prose pt-12">
      <h2 class="font-black text-orange-400">
        A Demo App for the JasperFx Critter Stack
      </h2>
      <p>
        This is a simple application using an Angular 20 frontend implemented
        using the "Backend for Frontend" Pattern.
      </p>
      <p>It is using .NET 9.0 and the following NuGet Packages</p>
      <ul>
        <li>WolverineFx.Http (4.1.0)</li>
        <li>WolverineFx.Http.Marten (4.1.0)</li>
      </ul>

      <h3>Sites and More Information</h3>
      <ul>
        <li>
          <a href="https://jasperfx.net/" target="_blank">JasperFX Main Site</a>
        </li>
        <li>
          <a href="https://wolverinefx.io/" target="_blank">Wolverine</a>
        </li>
        <li>
          <a href="https://martendb.io/" target="_blank">Marten</a>
        </li>
        <li>
          <a
            href="https://www.youtube.com/channel/UCAa9jGUNNCixzeWJR0Iocsg"
            target="_blank"
            >JasperFx YouTube Channel</a
          >
        </li>
      </ul>
    </div>
  `,
  styles: ``,
})
export class HomeComponent {}
