import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Owner, OwnerService } from '../../../core/services/owner.service';

@Component({
  selector: 'app-owner-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatSnackBarModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">👤 Dueños</h1>
        <a mat-raised-button class="btn-primary" routerLink="/owners/new">+ Nuevo Dueño</a>
      </div>

      <div class="vet-card">
        <table class="vet-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Mascotas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let o of owners">
              <td><strong>{{o.firstName}} {{o.lastName}}</strong></td>
              <td>{{o.email}}</td>
              <td>{{o.phone}}</td>
              <td style="color:#6b7280">{{o.address}}</td>
              <td>
                <span class="badge badge-pet">{{o.petsCount}} mascota{{o.petsCount !== 1 ? 's' : ''}}</span>
              </td>
              <td>
                <a mat-icon-button color="primary" [routerLink]="['/owners/edit', o.id]" title="Editar">
                  <mat-icon>edit</mat-icon>
                </a>
                <button mat-icon-button color="warn" (click)="delete(o.id)" title="Eliminar">
                  <mat-icon>delete_outline</mat-icon>
                </button>
              </td>
            </tr>
            <tr *ngIf="owners.length === 0">
              <td colspan="6" class="empty-state">No hay dueños registrados</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class OwnerListComponent implements OnInit {
  owners: Owner[] = [];

  constructor(private ownerService: OwnerService, private snackBar: MatSnackBar) { }

  ngOnInit() { this.load(); }

  load() { this.ownerService.getAll().subscribe(data => this.owners = data); }

  delete(id: number) {
    if (confirm('¿Eliminar este dueño?')) {
      this.ownerService.delete(id).subscribe({
        next: () => { this.snackBar.open('Dueño eliminado', 'OK', { duration: 3000 }); this.load(); },
        error: (e) => this.snackBar.open(e.error?.message || 'Error al eliminar', 'OK', { duration: 3000 })
      });
    }
  }
}
