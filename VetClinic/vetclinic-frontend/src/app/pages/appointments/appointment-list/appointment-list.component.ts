import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { Appointment, AppointmentService } from '../../../core/services/appointment.service';
import { PetService, Pet } from '../../../core/services/pet.service';
import { VeterinarianService, Veterinarian } from '../../../core/services/veterinarian.service';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatSnackBarModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatChipsModule],
  template: `
    <mat-card style="margin: 20px;">
      <mat-card-header>
        <mat-card-title>📅 Citas</mat-card-title>
        <span style="flex:1"></span>
        <button mat-raised-button color="primary" (click)="showForm=!showForm">+ Nueva Cita</button>
      </mat-card-header>
      <mat-card-content>
        <div *ngIf="showForm" style="background:#f5f5f5; padding:16px; margin:16px 0; border-radius:8px;">
          <h3 style="margin:0 0 12px">Nueva Cita</h3>
          <form [formGroup]="form" (ngSubmit)="create()" style="display:flex; flex-wrap:wrap; gap:12px;">
            <mat-form-field style="flex:1; min-width:200px;">
              <mat-label>Mascota</mat-label>
              <mat-select formControlName="petId">
                <mat-option *ngFor="let p of pets" [value]="p.id">{{p.name}} ({{p.ownerFullName}})</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field style="flex:1; min-width:200px;">
              <mat-label>Veterinario</mat-label>
              <mat-select formControlName="veterinarianId">
                <mat-option *ngFor="let v of vets" [value]="v.id">{{v.firstName}} {{v.lastName}} — {{v.specialty}}</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field style="flex:1; min-width:200px;">
              <mat-label>Fecha y hora</mat-label>
              <input matInput type="datetime-local" formControlName="appointmentDate">
            </mat-form-field>
            <mat-form-field style="flex:1; min-width:200px;">
              <mat-label>Motivo</mat-label>
              <input matInput formControlName="reason">
            </mat-form-field>
            <mat-form-field style="flex:1; min-width:200px;">
              <mat-label>Notas (opcional)</mat-label>
              <input matInput formControlName="notes">
            </mat-form-field>
            <div style="width:100%; display:flex; gap:8px;">
              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Guardar</button>
              <button mat-button type="button" (click)="showForm=false">Cancelar</button>
            </div>
          </form>
        </div>
        <table mat-table [dataSource]="appointments" style="width:100%; margin-top:16px;">
          <ng-container matColumnDef="pet">
            <th mat-header-cell *matHeaderCellDef>Mascota</th>
            <td mat-cell *matCellDef="let a">{{a.petName}}</td>
          </ng-container>
          <ng-container matColumnDef="owner">
            <th mat-header-cell *matHeaderCellDef>Dueño</th>
            <td mat-cell *matCellDef="let a">{{a.ownerFullName}}</td>
          </ng-container>
          <ng-container matColumnDef="vet">
            <th mat-header-cell *matHeaderCellDef>Veterinario</th>
            <td mat-cell *matCellDef="let a">{{a.veterinarianFullName}}</td>
          </ng-container>
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Fecha</th>
            <td mat-cell *matCellDef="let a">{{a.appointmentDate | date:'dd/MM/yyyy HH:mm'}}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let a">
              <span [style.background]="getColor(a.status)" style="color:white; padding:4px 8px; border-radius:12px; font-size:12px;">
                {{getStatusName(a.status)}}
              </span>
            </td>
          </ng-container>
          <ng-container matColumnDef="reason">
            <th mat-header-cell *matHeaderCellDef>Motivo</th>
            <td mat-cell *matCellDef="let a">{{a.reason}}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Cambiar Estado</th>
            <td mat-cell *matCellDef="let a">
              <button *ngIf="a.status===0" mat-stroked-button color="accent" style="margin:2px" (click)="changeStatus(a.id, 1)">▶ Iniciar</button>
              <button *ngIf="a.status===1" mat-stroked-button color="primary" style="margin:2px" (click)="changeStatus(a.id, 2)">✔ Completar</button>
              <button *ngIf="a.status===0||a.status===1" mat-stroked-button color="warn" style="margin:2px" (click)="changeStatus(a.id, 3)">✖ Cancelar</button>
              <button *ngIf="a.status===0" mat-icon-button color="warn" (click)="delete(a.id)">
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
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  pets: Pet[] = [];
  vets: Veterinarian[] = [];
  columns = ['pet', 'owner', 'vet', 'date', 'status', 'reason', 'actions'];
  showForm = false;
  form: FormGroup;

  constructor(
    private appointmentService: AppointmentService,
    private petService: PetService,
    private vetService: VeterinarianService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      petId: [null, Validators.required],
      veterinarianId: [null, Validators.required],
      appointmentDate: ['', Validators.required],
      reason: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit() {
    this.load();
    this.petService.getAll().subscribe(d => this.pets = d);
    this.vetService.getAll().subscribe(d => this.vets = d);
  }

  load() { this.appointmentService.getAll().subscribe(data => this.appointments = data); }

  getStatusName(s: number) {
    return ['Programada', 'En Progreso', 'Completada', 'Cancelada'][s] ?? 'Desconocido';
  }

  getColor(s: number) {
    return ['#1976d2', '#f57c00', '#388e3c', '#d32f2f'][s] ?? '#999';
  }

  create() {
    if (this.form.invalid) return;
    this.appointmentService.create(this.form.value).subscribe({
      next: () => { this.snackBar.open('Cita creada', 'OK', { duration: 3000 }); this.showForm = false; this.form.reset(); this.load(); },
      error: (e: any) => this.snackBar.open(e.error?.message || 'Error', 'OK', { duration: 3000 })
    });
  }

  changeStatus(id: number, status: number) {
    this.appointmentService.updateStatus(id, status).subscribe({
      next: () => { this.snackBar.open('Estado actualizado', 'OK', { duration: 3000 }); this.load(); },
      error: (e: any) => this.snackBar.open(e.error?.message || 'Error', 'OK', { duration: 3000 })
    });
  }

  delete(id: number) {
    if (confirm('¿Eliminar esta cita?')) {
      this.appointmentService.delete(id).subscribe({
        next: () => { this.snackBar.open('Cita eliminada', 'OK', { duration: 3000 }); this.load(); },
        error: (e: any) => this.snackBar.open(e.error?.message || 'Error', 'OK', { duration: 3000 })
      });
    }
  }
}
