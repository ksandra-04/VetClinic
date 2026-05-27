import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Veterinarian, VeterinarianService } from '../../../core/services/veterinarian.service';

@Component({
  selector: 'app-veterinarian-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  template: `
    <mat-card style="margin: 20px;">
      <mat-card-header>
        <mat-card-title>🩺 Veterinarios</mat-card-title>
        <span style="flex:1"></span>
        <button mat-raised-button color="primary" (click)="showForm=true">+ Nuevo Veterinario</button>
      </mat-card-header>
      <mat-card-content>
        <div *ngIf="showForm" style="background:#f5f5f5; padding:16px; margin:16px 0; border-radius:8px;">
          <h3 style="margin:0 0 12px">Nuevo Veterinario</h3>
          <form [formGroup]="form" (ngSubmit)="create()" style="display:flex; flex-wrap:wrap; gap:12px;">
            <mat-form-field style="flex:1; min-width:150px;">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="firstName">
            </mat-form-field>
            <mat-form-field style="flex:1; min-width:150px;">
              <mat-label>Apellido</mat-label>
              <input matInput formControlName="lastName">
            </mat-form-field>
            <mat-form-field style="flex:1; min-width:150px;">
              <mat-label>Especialidad</mat-label>
              <input matInput formControlName="specialty">
            </mat-form-field>
            <mat-form-field style="flex:1; min-width:150px;">
              <mat-label>Licencia</mat-label>
              <input matInput formControlName="licenseNumber">
            </mat-form-field>
            <mat-form-field style="flex:1; min-width:150px;">
              <mat-label>Teléfono</mat-label>
              <input matInput formControlName="phone">
            </mat-form-field>
            <div style="width:100%; display:flex; gap:8px;">
              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Guardar</button>
              <button mat-button type="button" (click)="showForm=false">Cancelar</button>
            </div>
          </form>
        </div>
        <table mat-table [dataSource]="vets" style="width:100%; margin-top:16px;">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Nombre</th>
            <td mat-cell *matCellDef="let v">{{v.firstName}} {{v.lastName}}</td>
          </ng-container>
          <ng-container matColumnDef="specialty">
            <th mat-header-cell *matHeaderCellDef>Especialidad</th>
            <td mat-cell *matCellDef="let v">{{v.specialty}}</td>
          </ng-container>
          <ng-container matColumnDef="license">
            <th mat-header-cell *matHeaderCellDef>Licencia</th>
            <td mat-cell *matCellDef="let v">{{v.licenseNumber}}</td>
          </ng-container>
          <ng-container matColumnDef="phone">
            <th mat-header-cell *matHeaderCellDef>Teléfono</th>
            <td mat-cell *matCellDef="let v">{{v.phone}}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let v">
              <button mat-icon-button color="warn" (click)="delete(v.id)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
      </mat-card-content>
    </mat-card>
  `
})
export class VeterinarianListComponent implements OnInit {
  vets: Veterinarian[] = [];
  columns = ['name', 'specialty', 'license', 'phone', 'actions'];
  showForm = false;
  form: FormGroup;

  constructor(
    private vetService: VeterinarianService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      specialty: ['', Validators.required],
      licenseNumber: ['', Validators.required],
      phone: ['']
    });
  }

  ngOnInit() { this.load(); }

  load() { this.vetService.getAll().subscribe(data => this.vets = data); }

  create() {
    if (this.form.invalid) return;
    this.vetService.create(this.form.value).subscribe({
      next: () => { this.snackBar.open('Veterinario creado', 'OK', { duration: 3000 }); this.showForm = false; this.form.reset(); this.load(); },
      error: (e: any) => this.snackBar.open(e.error?.message || 'Error', 'OK', { duration: 3000 })
    });
  }

  delete(id: number) {
    if (confirm('¿Eliminar este veterinario?')) {
      this.vetService.delete(id).subscribe({
        next: () => { this.snackBar.open('Eliminado', 'OK', { duration: 3000 }); this.load(); },
        error: (e: any) => this.snackBar.open(e.error?.message || 'Error', 'OK', { duration: 3000 })
      });
    }
  }
}
