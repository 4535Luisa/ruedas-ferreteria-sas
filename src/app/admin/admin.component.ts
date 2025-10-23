import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [MatCardModule],
  // Usamos template y styles inline para un solo archivo
  template: `
    <mat-card class="admin-card">
      <mat-card-title>⚙️ Panel de Administración</mat-card-title>
      <mat-card-content>
        <p>Este es el Panel de control de **Ruedas y Ferretería SAS**.</p>
        <p>El contenido de esta ruta fue configurado para cargarse perezosamente (Lazy Loading), optimizando el tiempo de inicio de la aplicación.</p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .admin-card {
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
      text-align: center;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      border-radius: 8px;
    }
    mat-card-title {
      color: #007bff; /* Un color de acento azul */
      font-weight: 600;
    }
  `]
})
export class AdminComponent { }
