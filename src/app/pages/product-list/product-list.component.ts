import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; 
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; 
import { Product, ProductService } from '../../services/product.service';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs'; // <-- ¡Importamos Observable!

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, CurrencyPipe, RouterLink], 
  template: `
    <h2>Catálogo de Productos 🔩</h2>
    <div class="product-grid">
      <mat-card *ngFor="let product of (products$ | async)" class="product-card"> 
        <div class="image-placeholder">
          
        </div>
        
        <mat-card-header>
          <mat-card-title>{{ product.name }}</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <p class="price">{{ product.price | currency:'COP':'symbol':'1.2-2' }}</p>
          <p class="description">{{ product.description | slice:0:70 }}...</p>
        </mat-card-content>
        
        <mat-card-actions class="actions-footer">
          <button mat-stroked-button color="primary" [routerLink]="['/productos', product.id]">
            Ver Detalle
          </button>
          <button mat-raised-button color="accent" (click)="addToCart(product)">
            <mat-icon>add_shopping_cart</mat-icon> Agregar
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
      padding: 20px;
    }
    .product-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.2s;
      height: 100%;
    }
    .product-card:hover { transform: translateY(-5px); box-shadow: 0 8px 16px rgba(0,0,0,0.2); }
    .image-placeholder { background-color: #f0f0f0; height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; font-weight: bold; }
    .price { font-size: 1.4em; color: #3f51b5; font-weight: 600; margin: 5px 0 10px; }
    .description { color: #666; font-size: 0.9em; }
    .actions-footer { display: flex; justify-content: space-between; padding: 0 16px 16px; }
  `]
})
export class ProductListComponent implements OnInit {
  // 1. Cambiamos el tipo a Observable<Product[]>
  products$!: Observable<Product[]>; 

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    // 2. Asignamos el Observable directamente
    this.products$ = this.productService.getProducts(); 
  }

  addToCart(product: Product): void {
    this.productService.addToCart(product);
    alert(`${product.name} añadido al carrito.`);
  }
}