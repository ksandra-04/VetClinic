import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Appointment, AppointmentService } from '../../../core/services/appointment.service';
import { Pet, PetService } from '../../../core/services/pet.service';
import { Veterinarian, VeterinarianService } from '../../../core/services/veterinarian.service';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">📅 Citas</h1>
        <button mat-raised-button class="btn-primary" (click)="showForm = !showForm">
          {{ showForm ? '✕ Cancelar' : '+ Nueva Cita' }}
        </button>
      </div>

      <div *ngIf="showForm" class="vet-card" style="padding:24px; margin-bottom:20px;">
        <h3 style="margin:0 0 16px; font-weight:700; color:#1a237e;">Nueva Cita</h3>
        <form [formGroup]="form" (ngSubmit)="create()" style="display:flex; flex-wrap:wrap; gap:12px;">
          <mat-form-field appearance="outline" style="flex:1; min-width:220px;">
            <mat-label>Mascota</mat-label>
            <mat-select formControlName="petId">
              <mat-option *ngFor="let p of pets" [value]="p.id">
                {{getPetIcon(p.type)}} {{p.name}} — {{p.ownerFullName}}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" style="flex:1; min-width:220px;">
            <mat-label>Veterinario</mat-label>
            <mat-select formControlName="veterinarianId">
              <mat-option *ngFor="let v of vets" [value]="v.id">
                Dr. {{v.firstName}} {{v.lastName}} — {{v.specialty}}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" style="flex:1; min-width:220px;">
            <mat-label>Fecha y hora</mat-label>
            <input matInput type="datetime-local" formControlName="appointmentDate">
          </mat-form-field>
          <mat-form-field appearance="outline" style="flex:1; min-width:220px;">
            <mat-label>Motivo</mat-label>
            <input matInput formControlName="reason">
          </mat-form-field>
          <mat-form-field appearance="outline" style="flex:1; min-width:220px;">
            <mat-label>Notas (opcional)</mat-label>
            <input matInput formControlName="notes">
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
              <th>Mascota</th>
              <th>Dueño</th>
              <th>Veterinario</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Motivo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let a of appointments">
              <td><strong>{{getPetIcon(0)}} {{a.petName}}</strong></td>
              <td style="color:#6b7280">{{a.ownerFullName}}</td>
              <td>{{a.veterinarianFullName}}</td>
              <td style="color:#6b7280; white-space:nowrap">{{a.appointmentDate | date:'dd/MM/yyyy HH:mm'}}</td>
              <td>
                <span class="badge" [ngClass]="getStatusClass(a.status)">
                  {{getStatusName(a.status)}}
                </span>
              </td>
              <td>{{a.reason}}</td>
              <td style="white-space:nowrap">
                <button *ngIf="a.status===0" mat-stroked-button class="btn-start"    style="margin:2px" (click)="changeStatus(a.id, 1)">▶ Iniciar</button>
                <button *ngIf="a.status===1" mat-stroked-button class="btn-complete" style="margin:2px" (click)="changeStatus(a.id, 2)">✔ Completar</button>
                <button *ngIf="a.status===0||a.status===1" mat-stroked-button class="btn-cancel-s" style="margin:2px" (click)="changeStatus(a.id, 3)">✖ Cancelar</button>
                <button *ngIf="a.status===0" mat-icon-button color="warn" (click)="delete(a.id)" title="Eliminar">
                  <mat-icon>delete_outline</mat-icon>
                </button>
              </td>
            </tr>
            <tr *ngIf="appointments.length === 0">
              <td colspan="7" class="empty-state">No hay citas registradas</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  pets: Pet[] = [];
  vets: Veterinarian[] = [];
  showForm = false;

  form!: FormGroup;

  constructor(
    private appointmentService: AppointmentService,
    private petService: PetService,
    private vetService: VeterinarianService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      petId: [null, Validators.required],
      veterinarianId: [null, Validators.required],
      appointmentDate: ['', Validators.required],
      reason: ['', Validators.required],
      notes: ['']
    });
    this.load();
    this.petService.getAll().subscribe(d => this.pets = d);
    this.vetService.getAll().subscribe(d => this.vets = d);
  }

  load() {
    this.appointmentService.getAll().subscribe(data => this.appointments = data);
  }

  getPetIcon(type: number): string {
    return ['🐶', '🐱', '🐦', '🐰', '🐾'][type] ?? '🐾';
  }

  getStatusName(s: number): string {
    return ['Programada', 'En Progreso', 'Completada', 'Cancelada'][s] ?? 'Desconocido';
  }

  getStatusClass(s: number): string {
    return ['badge-scheduled', 'badge-inprogress', 'badge-completed', 'badge-cancelled'][s] ?? '';
  }

  create() {
    if (this.form.invalid) return;
    this.appointmentService.create(this.form.value as any).subscribe({
      next: () => { this.snackBar.open('Cita creada', 'OK', { duration: 3000 }); this.showForm = false; this.form.reset(); this.load(); },
      error: (e) => this.snackBar.open(e.error?.message || 'Error', 'OK', { duration: 3000 })
    });
  }

  changeStatus(id: number, status: number) {
    this.appointmentService.updateStatus(id, status).subscribe({
      next: () => { this.snackBar.open('Estado actualizado', 'OK', { duration: 3000 }); this.load(); },
      error: (e) => this.snackBar.open(e.error?.message || 'Error', 'OK', { duration: 3000 })
    });
  }

  delete(id: number) {
    if (confirm('¿Eliminar esta cita?')) {
      this.appointmentService.delete(id).subscribe({
        next: () => { this.snackBar.open('Cita eliminada', 'OK', { duration: 3000 }); this.load(); },
        error: (e) => this.snackBar.open(e.error?.message || 'Error', 'OK', { duration: 3000 })
      });
    }
  }
}
