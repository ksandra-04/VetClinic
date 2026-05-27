import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Veterinarian, VeterinarianService } from '../../../core/services/veterinarian.service';

@Component({
  selector: 'app-veterinarian-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">🩺 Veterinarios</h1>
        <button mat-raised-button class="btn-primary" (click)="showForm = !showForm">
          {{ showForm ? '✕ Cancelar' : '+ Nuevo Veterinario' }}
        </button>
      </div>

      <div *ngIf="showForm" class="vet-card form-panel" style="margin-bottom:20px; padding:24px;">
        <h3>Nuevo Veterinario</h3>
        <form [formGroup]="form" (ngSubmit)="create()" style="display:flex; flex-wrap:wrap; gap:12px;">
          <mat-form-field appearance="outline" style="flex:1; min-width:160px;">
            <mat-label>Nombre</mat-label>
            <input matInput formControlName="firstName">
          </mat-form-field>
          <mat-form-field appearance="outline" style="flex:1; min-width:160px;">
            <mat-label>Apellido</mat-label>
            <input matInput formControlName="lastName">
          </mat-form-field>
          <mat-form-field appearance="outline" style="flex:1; min-width:160px;">
            <mat-label>Especialidad</mat-label>
            <input matInput formControlName="specialty">
          </mat-form-field>
          <mat-form-field appearance="outline" style="flex:1; min-width:160px;">
            <mat-label>N° Licencia</mat-label>
            <input matInput formControlName="licenseNumber">
          </mat-form-field>
          <mat-form-field appearance="outline" style="flex:1; min-width:160px;">
            <mat-label>Teléfono</mat-label>
            <input matInput formControlName="phone">
          </mat-form-field>
          <div style="width:100%; display:flex; gap:10px;">
            <button mat-raised-button class="btn-primary" type="submit" [disabled]="form.invalid">Guardar</button>
            <button mat-button class="btn-cancel" type="button" (click)="showForm=false; form.reset()">Cancelar</button>
          </div>
        </form>
      </div>

      <div class="vet-card">
        <table class="vet-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Especialidad</th>
              <th>N° Licencia</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let v of vets">
              <td><strong>Dr. {{v.firstName}} {{v.lastName}}</strong></td>
              <td><span class="badge badge-scheduled">{{v.specialty}}</span></td>
              <td style="font-family:monospace; color:#6b7280">{{v.licenseNumber}}</td>
              <td>{{v.phone || '—'}}</td>
              <td>
                <button mat-icon-button color="warn" (click)="delete(v.id)" title="Eliminar">
                  <mat-icon>delete_outline</mat-icon>
                </button>
              </td>
            </tr>
            <tr *ngIf="vets.length === 0">
              <td colspan="5" class="empty-state">No hay veterinarios registrados</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class VeterinarianListComponent implements OnInit {
  vets: Veterinarian[] = [];
  showForm = false;
  form!: FormGroup;

  constructor(
    private vetService: VeterinarianService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      specialty: ['', Validators.required],
      licenseNumber: ['', Validators.required],
      phone: ['']
    });
    this.load();
  }

  load() {
    this.vetService.getAll().subscribe(data => this.vets = data);
  }

  create() {
    if (this.form.invalid) return;
    this.vetService.create(this.form.value as any).subscribe({
      next: () => {
        this.snackBar.open('Veterinario creado', 'OK', { duration: 3000 });
        this.showForm = false;
        this.form.reset();
        this.load();
      },
      error: (e: any) => this.snackBar.open(e.error?.message || 'Error', 'OK', { duration: 3000 })
    });
  }

  delete(id: number) {
    if (confirm('¿Eliminar este veterinario?')) {
      this.vetService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Veterinario eliminado', 'OK', { duration: 3000 });
          this.load();
        },
        error: (e: any) => this.snackBar.open(e.error?.message || 'Error', 'OK', { duration: 3000 })
      });
    }
  }
}
