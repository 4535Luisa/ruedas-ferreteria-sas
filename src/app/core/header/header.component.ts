import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu'; // Menú de Material
import { ProductService } from '../../services/product.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule, MatButtonModule, MatIconModule, MatBadgeModule, MatMenuModule,
    RouterLink, RouterLinkActive, AsyncPipe, CommonModule
  ],
  template: `
    <mat-toolbar color="primary" class="main-header">
      <span class="logo" [routerLink]="['/']">Ruedas y Ferretería SAS 🛠️</span>
      <span class="spacer"></span>

      <button mat-button [routerLink]="['/productos']" routerLinkActive="active-link">Productos</button>
      <button mat-button [routerLink]="['/contacto']" routerLinkActive="active-link">Contacto</button>

      <button mat-icon-button [matBadge]="(cartCount$ | async) || 0" matBadgeColor="accent" [routerLink]="['/carrito']">
        <mat-icon>shopping_cart</mat-icon>
      </button>

      <button mat-icon-button [matMenuTriggerFor]="userMenu" title="Mi Cuenta">
        <mat-icon>account_circle</mat-icon>
      </button>
      <mat-menu #userMenu="matMenu">
        <button mat-menu-item>
          <mat-icon>person</mat-icon>
          <span>Perfil</span>
        </button>
        <button mat-menu-item>
          <mat-icon>exit_to_app</mat-icon>
          <span>Salir</span>
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [`
    .main-header { padding: 0 16px; position: fixed; top: 0; z-index: 1000; width: 100%; }
    .logo { font-size: 1.5rem; font-weight: bold; cursor: pointer; }
    .spacer { flex: 1 1 auto; }
    .active-link { background-color: rgba(255, 255, 255, 0.15); border-radius: 4px; }
  `]
})
export class HeaderComponent implements OnInit {
  cartCount$!: Observable<number>;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    // Calcula el total de items en el carrito para el badge
    this.cartCount$ = this.productService.cartItems$.pipe(
      map(items => items.reduce((acc, item) => acc + item.quantity, 0))
    );
  }
}