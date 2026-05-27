import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PetService } from '../../../core/services/pet.service';
import { OwnerService, Owner } from '../../../core/services/owner.service';

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatSnackBarModule],
  template: `
    <div class="form-container">
      <div class="form-card">
        <h2>{{ isEdit ? '✏️ Editar' : '➕ Nueva' }} Mascota</h2>
        <form [formGroup]="form" (ngSubmit)="submit()" class="form-fields">
          <mat-form-field appearance="outline">
            <mat-label>Nombre</mat-label>
            <input matInput formControlName="name">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Tipo</mat-label>
            <mat-select formControlName="type">
              <mat-option [value]="0">🐶 Perro</mat-option>
              <mat-option [value]="1">🐱 Gato</mat-option>
              <mat-option [value]="2">🐦 Ave</mat-option>
              <mat-option [value]="3">🐰 Conejo</mat-option>
              <mat-option [value]="4">🐾 Otro</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Raza</mat-label>
            <input matInput formControlName="breed">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Fecha de nacimiento</mat-label>
            <input matInput type="date" formControlName="birthDate">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Dueño</mat-label>
            <mat-select formControlName="ownerId">
              <mat-option *ngFor="let o of owners" [value]="o.id">
                {{o.firstName}} {{o.lastName}}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <div class="form-actions">
            <button mat-raised-button class="btn-primary" type="submit" [disabled]="form.invalid">Guardar</button>
            <button mat-button class="btn-cancel" type="button" (click)="router.navigate(['/pets'])">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class PetFormComponent implements OnInit {
  isEdit = false;
  id: number | null = null;
  owners: Owner[] = [];
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private petService: PetService,
    private ownerService: OwnerService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      type: [0, Validators.required],
      breed: [''],
      birthDate: ['', Validators.required],
      ownerId: [null as number | null, Validators.required]
    });

    this.ownerService.getAll().subscribe(data => this.owners = data);
    this.id = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;
    this.isEdit = !!this.id;

    if (this.isEdit && this.id) {
      this.petService.getById(this.id).subscribe(p => {
        this.form.patchValue({
          name: p.name,
          type: p.type,
          breed: p.breed,
          birthDate: p.birthDate.substring(0, 10),
          ownerId: p.ownerId
        });
      });
    }
  }

  submit() {
    if (this.form.invalid) return;
    const dto = this.form.value as any;
    if (this.isEdit && this.id) {
      this.petService.update(this.id, dto).subscribe({
        next: () => { this.snackBar.open('Mascota actualizada', 'OK', { duration: 3000 }); this.router.navigate(['/pets']); },
        error: (e: any) => this.snackBar.open(e.error?.message || 'Error', 'OK', { duration: 3000 })
      });
    } else {
      this.petService.create(dto).subscribe({
        next: () => { this.snackBar.open('Mascota creada', 'OK', { duration: 3000 }); this.router.navigate(['/pets']); },
        error: (e: any) => this.snackBar.open(e.error?.message || 'Error', 'OK', { duration: 3000 })
      });
    }
  }
}
