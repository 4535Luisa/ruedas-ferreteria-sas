import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ContactComponent } from './pages/contact/contact.component';

// 4) Rutas
export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Inicio | Ruedas y Ferretería SAS' },
  { path: 'productos', component: ProductListComponent, title: 'Catálogo | Ruedas y Ferretería' },
  { path: 'productos/:id', component: ProductDetailComponent, title: 'Detalle de Producto' },
  { path: 'carrito', component: CartComponent, title: 'Carrito de Compras' },
  { path: 'checkout', component: CheckoutComponent, title: 'Finalizar Compra' },
  { path: 'contacto', component: ContactComponent, title: 'Contacto y Ubicación' },
  
  // Carga Perezosa del componente Admin Standalone
  { 
    path: 'admin', 
    // Apunta al archivo 'admin.component' en la carpeta 'admin'
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
    title: 'Administración'
  },

  { path: '**', redirectTo: '' }
];