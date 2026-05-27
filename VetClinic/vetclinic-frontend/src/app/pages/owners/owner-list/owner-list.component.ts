import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Owner, OwnerService } from '../../../core/services/owner.service';

@Component({
  selector: 'app-owner-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatSnackBarModule],
  template: `
    <mat-card style="margin: 20px;">
      <mat-card-header>
        <mat-card-title>👤 Dueños registrados</mat-card-title>
        <span style="flex:1"></span>
        <a mat-raised-button color="primary" routerLink="/owners/new">+ Nuevo Dueño</a>
      </mat-card-header>
      <mat-card-content>
        <table mat-table [dataSource]="owners" style="width:100%; margin-top:16px;">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Nombre</th>
            <td mat-cell *matCellDef="let o">{{o.firstName}} {{o.lastName}}</td>
          </ng-container>
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let o">{{o.email}}</td>
          </ng-container>
          <ng-container matColumnDef="phone">
            <th mat-header-cell *matHeaderCellDef>Teléfono</th>
            <td mat-cell *matCellDef="let o">{{o.phone}}</td>
          </ng-container>
          <ng-container matColumnDef="pets">
            <th mat-header-cell *matHeaderCellDef>Mascotas</th>
            <td mat-cell *matCellDef="let o">{{o.petsCount}}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let o">
              <a mat-icon-button color="primary" [routerLink]="['/owners/edit', o.id]">
                <mat-icon>edit</mat-icon>
              </a>
              <button mat-icon-button color="warn" (click)="delete(o.id)">
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
export class OwnerListComponent implements OnInit {
  owners: Owner[] = [];
  columns = ['name', 'email', 'phone', 'pets', 'actions'];

  constructor(private ownerService: OwnerService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this.ownerService.getAll().subscribe(data => this.owners = data);
  }

  delete(id: number) {
    if (confirm('¿Eliminar este dueño?')) {
      this.ownerService.delete(id).subscribe({
        next: () => { this.snackBar.open('Dueño eliminado', 'OK', { duration: 3000 }); this.load(); },
        error: (e) => this.snackBar.open(e.error?.message || 'Error al eliminar', 'OK', { duration: 3000 })
      });
    }
  }
}
