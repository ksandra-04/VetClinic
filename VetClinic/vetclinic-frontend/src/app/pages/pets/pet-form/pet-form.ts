import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PetService } from '../../../core/services/pet.service';
import { OwnerService, Owner } from '../../../core/services/owner.service';

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatCardModule, MatSnackBarModule],
  template: `
    <mat-card style="margin: 20px; max-width: 500px;">
      <mat-card-header>
        <mat-card-title>{{ isEdit ? 'Editar' : 'Nueva' }} Mascota</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="submit()" style="display:flex; flex-direction:column; gap:12px; margin-top:16px;">
          <mat-form-field>
            <mat-label>Nombre</mat-label>
            <input matInput formControlName="name">
          </mat-form-field>
          <mat-form-field>
            <mat-label>Tipo</mat-label>
            <mat-select formControlName="type">
              <mat-option [value]="0">Perro</mat-option>
              <mat-option [value]="1">Gato</mat-option>
              <mat-option [value]="2">Ave</mat-option>
              <mat-option [value]="3">Conejo</mat-option>
              <mat-option [value]="4">Otro</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field>
            <mat-label>Raza</mat-label>
            <input matInput formControlName="breed">
          </mat-form-field>
          <mat-form-field>
            <mat-label>Fecha de nacimiento</mat-label>
            <input matInput type="date" formControlName="birthDate">
          </mat-form-field>
          <mat-form-field>
            <mat-label>Dueño</mat-label>
            <mat-select formControlName="ownerId">
              <mat-option *ngFor="let o of owners" [value]="o.id">
                {{o.firstName}} {{o.lastName}}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <div style="display:flex; gap:8px;">
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Guardar</button>
            <button mat-button type="button" (click)="router.navigate(['/pets'])">Cancelar</button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `
})
export class PetFormComponent implements OnInit {
  isEdit = false;
  id: number | null = null;
  owners: Owner[] = [];

  form = this.fb.group({
    name: ['', Validators.required],
    type: [0, Validators.required],
    breed: [''],
    birthDate: ['', Validators.required],
    ownerId: [null, Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private petService: PetService,
    private ownerService: OwnerService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.ownerService.getAll().subscribe(data => this.owners = data);
    this.id = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;
    this.isEdit = !!this.id;
    if (this.isEdit && this.id) {
      this.petService.getById(this.id).subscribe(p => {
        this.form.patchValue({ ...p, birthDate: p.birthDate.substring(0, 10) });
      });
    }
  }

  submit() {
    if (this.form.invalid) return;
    const dto = this.form.value as any;
    if (this.isEdit && this.id) {
      this.petService.update(this.id, dto).subscribe({
        next: () => { this.snackBar.open('Mascota actualizada', 'OK', { duration: 3000 }); this.router.navigate(['/pets']); },
        error: (e) => this.snackBar.open(e.error?.message || 'Error', 'OK', { duration: 3000 })
      });
    } else {
      this.petService.create(dto).subscribe({
        next: () => { this.snackBar.open('Mascota creada', 'OK', { duration: 3000 }); this.router.navigate(['/pets']); },
        error: (e) => this.snackBar.open(e.error?.message || 'Error', 'OK', { duration: 3000 })
      });
    }
  }
}
