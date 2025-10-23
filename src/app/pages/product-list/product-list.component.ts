import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; 
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; 
import { Product, ProductService } from '../../services/product.service';
import { Router, RouterLink, ActivatedRoute } from '@angular/router'; 
import { Observable, combineLatest } from 'rxjs'; // <-- Importar combineLatest aquí
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { map } from 'rxjs/operators'; // switchMap ya no es necesario

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, CurrencyPipe, RouterLink], 
  template: `
    <!-- Mostrar título con término de búsqueda si existe -->
    <h2 *ngIf="searchTerm$ | async">Resultados de búsqueda para: 
      **"{{ searchTerm$ | async }}"**
    </h2>
    <h2 *ngIf="!(searchTerm$ | async)">Catálogo de Productos 🔩</h2>
    
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
    h2 { text-align: center; margin-bottom: 30px; font-weight: 500; }
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
      padding: 20px;
    }
    .product-card {
      /* Estilos para que el filtrado se note bien */
      min-height: 400px; 
    }
    /* ... (otros estilos) ... */
  `]
})
export class ProductListComponent implements OnInit {
  products$!: Observable<Product[]>; 
  searchTerm$!: Observable<string | null>; 

  constructor(
    private productService: ProductService, 
    private snackBar: MatSnackBar, 
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // 1. Obtener un Observable del término de búsqueda de la URL
    this.searchTerm$ = this.route.queryParams.pipe(
      map(params => params['q'] ? params['q'].toLowerCase() : null)
    );

    // 2. Usar combineLatest para unir productos y término de búsqueda
    this.products$ = combineLatest([
      this.productService.getProducts(), // Observable<Product[]>
      this.searchTerm$ // Observable<string | null>
    ]).pipe( // <-- El pipe va aquí, después de combineLatest
      // 3. Filtrar los productos
      map(([products, searchTerm]) => {
        if (!searchTerm) {
          // Si no hay término, devolver todos los productos
          return products;
        }
        // Si hay término, filtrar por nombre o descripción
        return products.filter((product: Product) => // <-- Parámetro 'product' correctamente tipado
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm)
        );
      })
    );
  }

  addToCart(product: Product): void {
    this.productService.addToCart(product);
    
    this.snackBar.open(`${product.name} añadido al carrito.`, 'VER CARRITO', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    }).onAction().subscribe(() => {
      this.router.navigate(['/carrito']); 
    });
  }
}