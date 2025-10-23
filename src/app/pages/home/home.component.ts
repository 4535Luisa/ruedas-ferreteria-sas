import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; 
import { Router, RouterLink } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 

// Declarar la interfaz para Web Speech API (Permite al compilador reconocer 'webkitSpeechRecognition')
declare var webkitSpeechRecognition: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule, 
    RouterLink, 
    MatSnackBarModule 
  ],
  template: `
    <div class="home-container">
      <div class="hero">
        <h1>Bienvenido a Ruedas y Ferretería SAS 🛠️</h1>
        <p>Tu mejor aliado en soluciones industriales y herramientas de calidad en Bogotá.</p>
        
        <!-- Implementación de Búsqueda por Voz (Punto 7) -->
        <button mat-raised-button color="accent" (click)="startSpeechRecognition()" class="search-btn">
          <mat-icon>mic</mat-icon> Búsqueda por Voz
        </button>

        <button mat-stroked-button color="primary" [routerLink]="['/productos']" class="catalogo-btn">
          Ver Catálogo Completo
        </button>
      </div>
    </div>
  `,
  styles: [`
    .home-container { text-align: center; padding: 50px 20px; }
    .hero {
      background-color: #f5f5f5;
      padding: 60px 20px;
      border-radius: 8px;
      margin-top: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    h1 { color: #3f51b5; font-size: 2.5em; margin-bottom: 10px; }
    p { margin-bottom: 30px; font-size: 1.1em; }
    .search-btn, .catalogo-btn { 
      margin: 10px; 
      padding: 10px 30px; 
      font-size: 1.1em; 
      line-height: 1.5; 
      height: 48px; 
    }
  `]
})
export class HomeComponent {
  constructor(private router: Router, private snackBar: MatSnackBar) { }

  startSpeechRecognition(): void {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.continuous = false; 
      recognition.interimResults = false;

      this.snackBar.open('Escuchando... Di lo que quieres buscar.', 'CANCELAR', { duration: 5000 });

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        
        this.snackBar.open(`Buscando: "${transcript}"`, 'CERRAR', {
          duration: 3000,
        });

        // Navegar a la página de productos con el término de búsqueda
        this.router.navigate(['/productos'], { queryParams: { q: transcript } });
      };

      recognition.onerror = (event: any) => {
        this.snackBar.open('Error en el micrófono o API no disponible.', 'CERRAR', { duration: 5000 });
      };

      recognition.start();
    } else {
      this.snackBar.open('Tu navegador no soporta Búsqueda por Voz.', 'CERRAR', { duration: 5000 });
    }
  }
}