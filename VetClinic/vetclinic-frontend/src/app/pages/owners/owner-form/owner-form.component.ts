import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OwnerService } from '../../../core/services/owner.service';

@Component({
  selector: 'app-owner-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatSnackBarModule],
  template: `
    <mat-card style="margin: 20px; max-width: 500px;">
      <mat-card-header>
        <mat-card-title>{{ isEdit ? 'Editar' : 'Nuevo' }} Dueño</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="submit()" style="display:flex; flex-direction:column; gap:12px; margin-top:16px;">
          <mat-form-field>
            <mat-label>Nombre</mat-label>
            <input matInput formControlName="firstName">
          </mat-form-field>
          <mat-form-field>
            <mat-label>Apellido</mat-label>
            <input matInput formControlName="lastName">
          </mat-form-field>
          <mat-form-field>
            <mat-label>Teléfono</mat-label>
            <input matInput formControlName="phone">
          </mat-form-field>
          <mat-form-field>
            <mat-label>Email</mat-label>
            <input matInput formControlName="email">
          </mat-form-field>
          <mat-form-field>
            <mat-label>Dirección</mat-label>
            <input matInput formControlName="address">
          </mat-form-field>
          <div style="display:flex; gap:8px;">
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Guardar</button>
            <button mat-button type="button" (click)="router.navigate(['/owners'])">Cancelar</button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `
})
export class OwnerFormComponent implements OnInit {
  isEdit = false;
  id: number | null = null;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private ownerService: OwnerService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['']
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;
    this.isEdit = !!this.id;
    if (this.isEdit && this.id) {
      this.ownerService.getById(this.id).subscribe(o => this.form.patchValue(o));
    }
  }

  submit() {
    if (this.form.invalid) return;
    const dto = this.form.value;
    if (this.isEdit && this.id) {
      this.ownerService.update(this.id, dto).subscribe({
        next: () => { this.snackBar.open('Dueño actualizado', 'OK', { duration: 3000 }); this.router.navigate(['/owners']); },
        error: (e: any) => this.snackBar.open(e.error?.message || 'Error', 'OK', { duration: 3000 })
      });
    } else {
      this.ownerService.create(dto).subscribe({
        next: () => { this.snackBar.open('Dueño creado', 'OK', { duration: 3000 }); this.router.navigate(['/owners']); },
        error: (e: any) => this.snackBar.open(e.error?.message || 'Error', 'OK', { duration: 3000 })
      });
    }
  }
}
