import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <main class="content">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    .content {
      padding: 20px;
      min-height: calc(100vh - 48px - 64px); /* Altura de la vista menos Footer (48px) y Header (64px) */
      margin-top: 64px; /* Espacio para el header fijo */
      margin-bottom: 48px; /* Espacio para el footer fijo */
    }
  `]
})
export class AppComponent { }