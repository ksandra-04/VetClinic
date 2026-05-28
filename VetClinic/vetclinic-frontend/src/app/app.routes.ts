import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent) },
  { path: 'owners', canActivate: [authGuard], loadComponent: () => import('./pages/owners/owner-list/owner-list.component').then(m => m.OwnerListComponent) },
  { path: 'owners/new', canActivate: [authGuard], loadComponent: () => import('./pages/owners/owner-form/owner-form.component').then(m => m.OwnerFormComponent) },
  { path: 'owners/edit/:id', canActivate: [authGuard], loadComponent: () => import('./pages/owners/owner-form/owner-form.component').then(m => m.OwnerFormComponent) },
  { path: 'pets', canActivate: [authGuard], loadComponent: () => import('./pages/pets/pet-list/pet-list.component').then(m => m.PetListComponent) },
  { path: 'pets/new', canActivate: [authGuard], loadComponent: () => import('./pages/pets/pet-form/pet-form.component').then(m => m.PetFormComponent) },
  { path: 'pets/edit/:id', canActivate: [authGuard], loadComponent: () => import('./pages/pets/pet-form/pet-form.component').then(m => m.PetFormComponent) },
  { path: 'veterinarians', canActivate: [authGuard], loadComponent: () => import('./pages/veterinarians/veterinarian-list/veterinarian-list.component').then(m => m.VeterinarianListComponent) },
  { path: 'appointments', canActivate: [authGuard], loadComponent: () => import('./pages/appointments/appointment-list/appointment-list.component').then(m => m.AppointmentListComponent) },
];
