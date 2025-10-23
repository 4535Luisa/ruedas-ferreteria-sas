import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule],
  template: `
    <mat-toolbar color="primary" class="footer-bar">
      <span>© {{ currentYear }} Ruedas y Ferretería SAS - Tu aliado en Bogotá.</span>
      <span class="spacer"></span>
      <mat-icon class="icon-spacer">location_on</mat-icon>
      <span>Calle 26 # 116-31, Bogotá</span>
    </mat-toolbar>
  `,
  styles: [`
    .footer-bar {
      height: 48px;
      font-size: 0.8rem;
      justify-content: center;
      position: fixed;
      bottom: 0;
      width: 100%;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .icon-spacer {
      margin-right: 5px;
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}