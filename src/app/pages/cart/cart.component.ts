import { Component, OnInit } from '@angular/core';
import { CartItem, ProductService } from '../../services/product.service';
import { CommonModule, CurrencyPipe } from '@angular/common'; // Necesario para *ngIf, *ngFor, y Pipes
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  // Pipes y Módulos de Material (Punto 6)
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, CurrencyPipe, RouterLink], 
  template: `
    <h2>Tu Carrito de Compras 🛍️</h2>

    <div *ngIf="(cartItems$ | async)?.length === 0" class="empty-cart">
      <p>Tu carrito está vacío. ¡Añade algunas herramientas!</p>
      <button mat-raised-button color="primary" [routerLink]="['/productos']">Ir a Productos</button>
    </div>

    <div *ngIf="(cartItems$ | async)?.length! > 0" class="cart-layout">
      <div class="items-list">
        <mat-card *ngFor="let item of (cartItems$ | async)" class="cart-item-card">
          <img class="item-image" src="assets/img/{{ item.image }}" alt="{{ item.name }}">
          <div class="item-info">
            <h3>{{ item.name }}</h3>
            <p>Precio Unitario: {{ item.price | currency:'COP':'symbol':'1.2-2' }}</p>
            <p>Cantidad: {{ item.quantity }}</p>
            <p class="subtotal-item">
              Subtotal: 
              <strong>{{ (item.price * item.quantity) | currency:'COP':'symbol':'1.2-2' }}</strong>
            </p>
          </div>
        </mat-card>
      </div>

      <mat-card class="summary-card">
        <mat-card-title>Resumen del Pedido</mat-card-title>
        <mat-card-content>
          <div class="summary-row">
            <span>Subtotal de Productos:</span>
            <span>{{ cartTotal$ | async | currency:'COP':'symbol':'1.2-2' }}</span>
          </div>
          <div class="summary-row">
            <span>Envío (Fijo):</span>
            <span>$ 15.000</span>
          </div>
          <hr>
          <div class="summary-row total">
            <span>Total a Pagar:</span>
            <span>{{ ((cartTotal$ | async) || 0) + 15000 | currency:'COP':'symbol':'1.2-2' }}</span>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="accent" class="checkout-btn" [routerLink]="['/checkout']">
            Proceder al Pago
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    h2 { text-align: center; margin-bottom: 30px; }
    .cart-layout { display: flex; gap: 30px; max-width: 1200px; margin: 0 auto; }
    .items-list { flex: 2; display: flex; flex-direction: column; gap: 15px; }
    .summary-card { flex: 1; position: sticky; top: 84px; height: fit-content; }
    
    .cart-item-card { display: flex; padding: 10px; align-items: center; }
    .item-image { 
      width: 80px; 
      height: 80px; 
      object-fit: cover; 
      margin-right: 20px; 
      background: #e0e0e0; 
      display: flex; 
      align-items: center; 
      justify-content: center;
      border-radius: 4px;
    }
    .item-info { flex-grow: 1; }
    .subtotal-item { margin-top: 5px; font-size: 1.1em; }
    
    .summary-row { display: flex; justify-content: space-between; margin-top: 10px; }
    hr { margin: 10px 0; border: 0; border-top: 1px solid #eee; }
    .total { font-weight: bold; font-size: 1.3em; color: #3f51b5; }
    .checkout-btn { width: 100%; margin-top: 20px; }
    .empty-cart { text-align: center; padding: 50px; border: 1px dashed #ccc; margin-top: 30px; max-width: 600px; margin: 30px auto; }
  `]
})
export class CartComponent implements OnInit {
  cartItems$!: Observable<CartItem[]>;
  cartTotal$!: Observable<number>;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    // (3) Consumo del servicio: Obtener los items del carrito como Observable
    this.cartItems$ = this.productService.cartItems$;

    // Cálculo del total reactivo (usando map de RxJS)
    this.cartTotal$ = this.cartItems$.pipe(
      map(items => items.reduce((total, item) => total + (item.price * item.quantity), 0))
    );
  }
}