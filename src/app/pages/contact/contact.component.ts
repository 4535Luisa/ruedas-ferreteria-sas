import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- ¡Añadido!
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // <-- ¡Añadido!
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule, // <-- ¡Importado para *ngIf!
    ReactiveFormsModule, 
    MatCardModule, MatInputModule, MatFormFieldModule, 
    MatButtonModule, MatIconModule // <-- Importado para <mat-icon>!
  ],
  template: `
    <h2>Contáctanos y Ubicación 📍</h2>
    <div class="contact-layout">
      <mat-card class="form-card">
        <mat-card-title>Envíanos un Mensaje</mat-card-title>
        <mat-card-content>
          <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="name" required>
              <mat-error *ngIf="contactForm.get('name')?.hasError('required')">El nombre es obligatorio.</mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" required>
              <mat-error *ngIf="contactForm.get('email')?.hasError('required')">El email es obligatorio.</mat-error>
              <mat-error *ngIf="contactForm.get('email')?.hasError('email')">Formato de email inválido.</mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Mensaje</mat-label>
              <textarea matInput formControlName="message" rows="5" required></textarea>
              <mat-error *ngIf="contactForm.get('message')?.hasError('required')">El mensaje es obligatorio.</mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" [disabled]="contactForm.invalid" type="submit">
              <mat-icon>send</mat-icon> Enviar Mensaje
            </button>
          </form>
        </mat-card-content>
      </mat-card>

      <mat-card class="map-card">
        <mat-card-title>Ubicación: Ruedas y Ferretería SAS</mat-card-title>
        <mat-card-content>
          <iframe 
            class="map-iframe"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.602568656114!2d-74.07720978523773!3d4.673856096603125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9a73e6a6b577%3A0xcb3252a1d25d1997!2sRuedas%20y%20Ferreter%C3%ADa%20SAS!5e0!3m2!1ses!2sco!4v1678822600000!5m2!1ses!2sco" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
          <p class="address">📍 **Dirección:** Carrera 13 # 78-85, Bogotá, Colombia</p>
          <p class="phone">📞 **Teléfono:** (601) 123 4567</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .contact-layout { display: flex; max-width: 1200px; margin: 30px auto; gap: 30px; }
    .form-card, .map-card { flex: 1; padding: 20px; }
    .full-width { width: 100%; }
    .map-iframe { width: 100%; height: 350px; border: 0; margin-bottom: 15px; }
    .address, .phone { margin-top: 5px; font-weight: 500; }
    
    @media (max-width: 800px) {
      .contact-layout { flex-direction: column; }
    }
  `]
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log('Formulario enviado:', this.contactForm.value);
      this.snackBar.open('¡Mensaje enviado! Pronto nos comunicaremos contigo.', 'CERRAR', {
        duration: 3000,
        verticalPosition: 'top'
      });
      this.contactForm.reset();
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.setErrors(null);
      });
    }
  }
}