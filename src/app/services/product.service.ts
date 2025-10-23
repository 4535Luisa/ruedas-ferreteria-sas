import { Injectable, PLATFORM_ID, Inject } from '@angular/core'; // <-- Importar PLATFORM_ID e Inject
import { isPlatformBrowser } from '@angular/common'; // <-- Importar isPlatformBrowser
import { Observable, of, BehaviorSubject } from 'rxjs'; 
import { map } from 'rxjs/operators';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

const CART_KEY = 'cart_items'; // Clave para localStorage

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private MOCK_PRODUCTS: Product[] = [
    { id: 1, name: 'Rueda Industrial de Poliuretano', description: 'Rueda de alta resistencia para cargas pesadas.', price: 95500, stock: 15, image: 'rueda-pu.jpg' },
    { id: 2, name: 'Tornillo Allen Acero Inox M6', description: 'Caja de 100 unidades, ideal para ambientes húmedos.', price: 32900, stock: 50, image: 'tornillo-m6.jpg' },
    { id: 3, name: 'Llave Fija Combinada 10mm', description: 'Herramienta cromo vanadio, acabado espejo.', price: 18000, stock: 0, image: 'llave-fija.jpg' },
    { id: 4, name: 'Rodamiento de Bolas 6205 Z', description: 'Rodamiento sellado de precisión para maquinaria.', price: 45000, stock: 25, image: 'rodamiento.jpg' },
  ];

  private _cartItems: BehaviorSubject<CartItem[]>;
  cartItems$: Observable<CartItem[]>;
  private isBrowser: boolean;

  constructor(
    // 1. Inyectar PLATFORM_ID
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // 2. Determinar si estamos en el navegador
    this.isBrowser = isPlatformBrowser(this.platformId);
    let initialCart: CartItem[] = [];

    // 3. Solo intentar acceder a localStorage si estamos en el navegador
    if (this.isBrowser) {
      const storedCart = localStorage.getItem(CART_KEY);
      if (storedCart) {
        initialCart = JSON.parse(storedCart);
      }
    }

    this._cartItems = new BehaviorSubject<CartItem[]>(initialCart);
    this.cartItems$ = this._cartItems.asObservable();
  }
  
  // --- Métodos de Lectura (Igual que antes) ---

  getProducts(): Observable<Product[]> {
    return of(this.MOCK_PRODUCTS);
  }

  getProductById(id: number): Product | undefined {
    return this.MOCK_PRODUCTS.find(p => p.id === id);
  }

  // --- Métodos de Escritura (Añadir lógica de guardado) ---
  
  addToCart(product: Product): void {
    const currentItems = this._cartItems.getValue();
    const existingItem = currentItems.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentItems.push({ ...product, quantity: 1 });
    }

    this._cartItems.next(currentItems);
    this.saveCartToStorage(currentItems); // <-- Llamar al nuevo método de guardado
  }

  // --- Nuevo método para guardar el carrito, solo en el navegador ---

  private saveCartToStorage(cart: CartItem[]): void {
    if (this.isBrowser) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }
}