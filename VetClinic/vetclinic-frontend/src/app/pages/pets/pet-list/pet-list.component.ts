import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Pet, PetService } from '../../../core/services/pet.service';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatSnackBarModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">🐾 Mascotas</h1>
        <a mat-raised-button class="btn-primary" routerLink="/pets/new">+ Nueva Mascota</a>
      </div>

      <div class="vet-card">
        <table class="vet-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Raza</th>
              <th>Fecha Nac.</th>
              <th>Dueño</th>
              <th>Citas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of pets">
              <td><strong>{{p.name}}</strong></td>
              <td><span class="badge badge-pet">{{getPetIcon(p.type)}} {{p.typeName}}</span></td>
              <td>{{p.breed || '—'}}</td>
              <td style="color:#6b7280">{{p.birthDate | date:'dd/MM/yyyy'}}</td>
              <td>{{p.ownerFullName}}</td>
              <td style="text-align:center">{{p.appointmentsCount}}</td>
              <td>
                <a mat-icon-button color="primary" [routerLink]="['/pets/edit', p.id]" title="Editar">
                  <mat-icon>edit</mat-icon>
                </a>
                <button mat-icon-button color="warn" (click)="delete(p.id)" title="Eliminar">
                  <mat-icon>delete_outline</mat-icon>
                </button>
              </td>
            </tr>
            <tr *ngIf="pets.length === 0">
              <td colspan="7" class="empty-state">No hay mascotas registradas</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class PetListComponent implements OnInit {
  pets: Pet[] = [];

  constructor(private petService: PetService, private snackBar: MatSnackBar) { }

  ngOnInit() { this.load(); }

  load() { this.petService.getAll().subscribe(data => this.pets = data); }

  getPetIcon(type: number): string {
    return ['🐶', '🐱', '🐦', '🐰', '🐾'][type] ?? '🐾';
  }

  delete(id: number) {
    if (confirm('¿Eliminar esta mascota?')) {
      this.petService.delete(id).subscribe({
        next: () => { this.snackBar.open('Mascota eliminada', 'OK', { duration: 3000 }); this.load(); },
        error: (e) => this.snackBar.open(e.error?.message || 'Error', 'OK', { duration: 3000 })
      });
    }
  }
}
