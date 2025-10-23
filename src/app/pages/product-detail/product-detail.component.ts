import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductService } from '../../services/product.service';
import { CommonModule, CurrencyPipe } from '@angular/common'; // <-- Necesario
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // <-- Necesario

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, CurrencyPipe],
  template: `
    <div *ngIf="product" class="detail-container">
      <mat-card>
        <div class="product-layout">
          <div class="image-section">
            <div class="image-placeholder-detail">
              
            </div>
            <p>Artículo: {{ product.name }}</p>
          </div>

          <div class="info-section">
            <h2>{{ product.name }}</h2>
            <div class="rating">⭐⭐⭐⭐⭐ (4.8)</div> 
            
            <h1 class="price">{{ product.price | currency:'COP':'symbol':'1.2-2' }}</h1>
            
            <mat-card-content>
              <h3>Descripción:</h3>
              <p>{{ product.description }}</p>
              
              <p class="stock">Disponibilidad: <span [ngClass]="{'in-stock': product.stock > 0, 'out-stock': product.stock === 0}">
                {{ product.stock > 0 ? 'En Stock (' + product.stock + ' unidades)' : 'Agotado' }}
              </span></p>
            </mat-card-content>

            <mat-card-actions>
              <button 
                mat-raised-button 
                color="accent" 
                (click)="addToCart(product)" 
                [disabled]="product.stock === 0"
              >
                <mat-icon>add_shopping_cart</mat-icon> Añadir al Carrito
              </button>
            </mat-card-actions>
          </div>
        </div>
      </mat-card>
    </div>

    <div *ngIf="!product">
      <p>Producto no encontrado.</p>
    </div>
  `,
  styles: [`
    .detail-container { max-width: 1000px; margin: 20px auto; }
    .product-layout { display: flex; gap: 40px; }
    .image-section { flex: 1; text-align: center; }
    .info-section { flex: 2; }
    .image-placeholder-detail { background-color: #e0e0e0; height: 350px; width: 100%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; font-weight: bold; }
    .price { font-size: 2.5em; color: #4CAF50; margin: 10px 0; }
    .rating { color: gold; font-size: 1.2em; margin-bottom: 20px; }
    .stock { font-size: 1.1em; font-weight: 500; margin-top: 20px; }
    .in-stock { color: green; }
    .out-stock { color: red; }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.product = this.productService.getProductById(productId);
    });
  }

  addToCart(product: Product): void {
    this.productService.addToCart(product);
    alert(`${product.name} agregado al carrito.`);
  }
}