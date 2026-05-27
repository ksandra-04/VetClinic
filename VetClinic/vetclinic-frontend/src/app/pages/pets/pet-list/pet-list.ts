import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { Pet, PetService } from '../../../core/services/pet.service';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatSnackBarModule, MatChipsModule],
  template: `
    <mat-card style="margin: 20px;">
      <mat-card-header>
        <mat-card-title>🐾 Mascotas registradas</mat-card-title>
        <span style="flex:1"></span>
        <a mat-raised-button color="primary" routerLink="/pets/new">+ Nueva Mascota</a>
      </mat-card-header>
      <mat-card-content>
        <table mat-table [dataSource]="pets" style="width:100%; margin-top:16px;">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Nombre</th>
            <td mat-cell *matCellDef="let p">{{p.name}}</td>
          </ng-container>
          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Tipo</th>
            <td mat-cell *matCellDef="let p">
              <mat-chip>{{p.typeName}}</mat-chip>
            </td>
          </ng-container>
          <ng-container matColumnDef="breed">
            <th mat-header-cell *matHeaderCellDef>Raza</th>
            <td mat-cell *matCellDef="let p">{{p.breed}}</td>
          </ng-container>
          <ng-container matColumnDef="owner">
            <th mat-header-cell *matHeaderCellDef>Dueño</th>
            <td mat-cell *matCellDef="let p">{{p.ownerFullName}}</td>
          </ng-container>
          <ng-container matColumnDef="appointments">
            <th mat-header-cell *matHeaderCellDef>Citas</th>
            <td mat-cell *matCellDef="let p">{{p.appointmentsCount}}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let p">
              <a mat-icon-button color="primary" [routerLink]="['/pets/edit', p.id]">
                <mat-icon>edit</mat-icon>
              </a>
              <button mat-icon-button color="warn" (click)="delete(p.id)">
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
export class PetListComponent implements OnInit {
  pets: Pet[] = [];
  columns = ['name', 'type', 'breed', 'owner', 'appointments', 'actions'];

  constructor(private petService: PetService, private snackBar: MatSnackBar) { }

  ngOnInit() { this.load(); }

  load() { this.petService.getAll().subscribe(data => this.pets = data); }

  delete(id: number) {
    if (confirm('¿Eliminar esta mascota?')) {
      this.petService.delete(id).subscribe({
        next: () => { this.snackBar.open('Mascota eliminada', 'OK', { duration: 3000 }); this.load(); },
        error: (e) => this.snackBar.open(e.error?.message || 'Error', 'OK', { duration: 3000 })
      });
    }
  }
}
