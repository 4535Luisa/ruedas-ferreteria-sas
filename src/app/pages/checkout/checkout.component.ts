import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { MatStepperModule } from '@angular/material/stepper'; 
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../services/product.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// IMPORTAR TODOS LOS MÓDULOS DE CARD NECESARIOS
import { MatCardModule, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card'; 

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, 
    MatStepperModule, MatButtonModule, MatInputModule, MatFormFieldModule, CurrencyPipe,
    // ¡CORRECCIÓN AQUÍ!
    MatCardModule, MatCardTitle, MatCardContent, MatCardActions 
  ],
  template: `
    <h2>Finalizar Compra - Checkout 🛒</h2>
    
    <div class="checkout-container">
      <mat-stepper [linear]="true" #stepper>
        <!-- Paso 1: Datos de Envío (Punto 5: Formularios Reactivos) -->
        <mat-step [stepControl]="shippingFormGroup">
          <form [formGroup]="shippingFormGroup">
            <ng-template matStepLabel>Datos de Envío</ng-template>
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Nombre Completo</mat-label>
              <input matInput placeholder="Juan Pérez" formControlName="name" required>
              <mat-error *ngIf="shippingFormGroup.get('name')?.hasError('required')">El nombre es obligatorio.</mat-error>
            </mat-form-field>
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Dirección</mat-label>
              <input matInput placeholder="Carrera 13 # 78-85" formControlName="address" required>
              <mat-error *ngIf="shippingFormGroup.get('address')?.hasError('required')">La dirección es obligatoria.</mat-error>
            </mat-form-field>
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Ciudad</mat-label>
              <input matInput placeholder="Bogotá" formControlName="city" required>
              <mat-error *ngIf="shippingFormGroup.get('city')?.hasError('required')">La ciudad es obligatoria.</mat-error>
            </mat-form-field>
            <div>
              <button mat-raised-button color="primary" matStepperNext [disabled]="shippingFormGroup.invalid">Siguiente</button>
            </div>
          </form>
        </mat-step>

        <!-- Paso 2: Revisión de Pedido y Pago -->
        <mat-step [stepControl]="paymentFormGroup">
          <form [formGroup]="paymentFormGroup">
            <ng-template matStepLabel>Revisión y Pago</ng-template>
            
            <mat-card class="summary-card">
              <mat-card-title>Resumen del Pedido</mat-card-title>
              <mat-card-content>
                <div class="summary-row">
                  <span>Productos (Subtotal):</span>
                  <span>{{ cartTotal$ | async | currency:'COP':'symbol':'1.2-2' }}</span>
                </div>
                <div class="summary-row">
                  <span>Envío:</span>
                  <span>$ 15.000</span>
                </div>
                <hr>
                <div class="summary-row total">
                  <span>Total a Pagar:</span>
                  <span>{{ ((cartTotal$ | async) || 0) + 15000 | currency:'COP':'symbol':'1.2-2' }}</span>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Email para Recibo</mat-label>
              <input matInput placeholder="correo@dominio.com" formControlName="email" required email>
              <mat-error *ngIf="paymentFormGroup.get('email')?.hasError('required')">El email es obligatorio.</mat-error>
              <mat-error *ngIf="paymentFormGroup.get('email')?.hasError('email')">Formato de email inválido.</mat-error>
            </mat-form-field>
            
            <mat-card-actions class="stepper-actions">
              <button mat-button matStepperPrevious>Volver</button>
              <button mat-raised-button color="accent" matStepperNext [disabled]="paymentFormGroup.invalid">Confirmar Pedido</button>
            </mat-card-actions>
          </form>
        </mat-step>

        <!-- Paso 3: Confirmación -->
        <mat-step>
          <ng-template matStepLabel>Confirmación</ng-template>
          <h3>¡Pedido Confirmado! 🎉</h3>
          <p>Tu orden ha sido procesada con éxito y se enviará a la siguiente dirección:</p>
          
          <mat-card class="final-summary">
            <p><strong>{{ shippingFormGroup.value.name }}</strong></p>
            <p>{{ shippingFormGroup.value.address }}</p>
            <p>{{ shippingFormGroup.value.city }}, Colombia</p>
            <p class="final-total">Total Pagado: **{{ ((cartTotal$ | async) || 0) + 15000 | currency:'COP':'symbol':'1.2-2' }}**</p>
          </mat-card>

          <mat-card-actions class="stepper-actions">
            <button mat-raised-button color="primary" (click)="finalizeOrder()">Finalizar</button>
          </mat-card-actions>
        </mat-step>
      </mat-stepper>
    </div>
  `,
  styles: [`
    .checkout-container { max-width: 800px; margin: 30px auto; padding: 20px; }
    h2 { text-align: center; margin-bottom: 30px; }
    .full-width { width: 100%; }
    .summary-card { margin: 20px 0; padding: 10px; }
    .summary-row { display: flex; justify-content: space-between; margin-top: 5px; }
    hr { margin: 10px 0; border: 0; border-top: 1px solid #eee; }
    .total { font-weight: bold; font-size: 1.2em; color: #3f51b5; }
    .stepper-actions { justify-content: space-between; margin-top: 20px; display: flex; }
    .final-summary { 
      padding: 15px; 
      margin-top: 20px; 
      border-left: 5px solid #4CAF50; 
      background-color: #f9f9f9;
    }
    .final-total { font-size: 1.2em; margin-top: 10px; color: #4CAF50; font-weight: bold; }
  `]
})
export class CheckoutComponent implements OnInit {
  shippingFormGroup!: FormGroup;
  paymentFormGroup!: FormGroup;
  cartTotal$!: Observable<number>;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private productService: ProductService) {}

  ngOnInit(): void {
    // Inicialización de formularios reactivos (Punto 5)
    this.shippingFormGroup = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
    });

    this.paymentFormGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      // Simulación de campos de pago
      card: ['', Validators.minLength(16)],
    });

    // Calcular el total del carrito para mostrar en el resumen
    this.cartTotal$ = this.productService.cartItems$.pipe(
      map(items => items.reduce((total, item) => total + (item.price * item.quantity), 0))
    );
  }

  finalizeOrder(): void {
    // Lógica final del pedido (limpiar carrito, notificar, redirigir)
    this.snackBar.open('¡Gracias por tu compra! Tu pedido está en camino.', 'CERRAR', {
      duration: 5000,
      verticalPosition: 'top'
    });
    // Limpieza de datos (opcional, dependiendo de la lógica del servicio)
    // this.productService.clearCart(); 
    
    // Redirección al inicio
    // this.router.navigate(['/']); 
  }
}