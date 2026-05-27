import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OwnerService } from '../../../core/services/owner.service';

@Component({
  selector: 'app-owner-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule],
  template: `
    <div class="form-container">
      <div class="form-card">
        <h2>{{ isEdit ? '✏️ Editar' : '➕ Nuevo' }} Dueño</h2>
        <form [formGroup]="form" (ngSubmit)="submit()" class="form-fields">
          <mat-form-field appearance="outline">
            <mat-label>Nombre</mat-label>
            <input matInput formControlName="firstName">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Apellido</mat-label>
            <input matInput formControlName="lastName">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Teléfono</mat-label>
            <input matInput formControlName="phone">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Dirección</mat-label>
            <input matInput formControlName="address">
          </mat-form-field>
          <div class="form-actions">
            <button mat-raised-button class="btn-primary" type="submit" [disabled]="form.invalid">Guardar</button>
            <button mat-button class="btn-cancel" type="button" (click)="router.navigate(['/owners'])">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class OwnerFormComponent implements OnInit {
  isEdit = false;
  id: number | null = null;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private ownerService: OwnerService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['']
    });

    this.id = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;
    this.isEdit = !!this.id;

    if (this.isEdit && this.id) {
      this.ownerService.getById(this.id).subscribe(o => this.form.patchValue(o));
    }
  }

  submit() {
    if (this.form.invalid) return;
    const dto = this.form.value as any;
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
