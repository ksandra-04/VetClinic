import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'owners', pathMatch: 'full' },
  { path: 'owners', loadComponent: () => import('./pages/owners/owner-list/owner-list.component').then(m => m.OwnerListComponent) },
  { path: 'owners/new', loadComponent: () => import('./pages/owners/owner-form/owner-form.component').then(m => m.OwnerFormComponent) },
  { path: 'owners/edit/:id', loadComponent: () => import('./pages/owners/owner-form/owner-form.component').then(m => m.OwnerFormComponent) },
  { path: 'pets', loadComponent: () => import('./pages/pets/pet-list/pet-list.component').then(m => m.PetListComponent) },
  { path: 'pets/new', loadComponent: () => import('./pages/pets/pet-form/pet-form.component').then(m => m.PetFormComponent) },
  { path: 'pets/edit/:id', loadComponent: () => import('./pages/pets/pet-form/pet-form.component').then(m => m.PetFormComponent) },
  { path: 'veterinarians', loadComponent: () => import('./pages/veterinarians/veterinarian-list/veterinarian-list.component').then(m => m.VeterinarianListComponent) },
  { path: 'appointments', loadComponent: () => import('./pages/appointments/appointment-list/appointment-list.component').then(m => m.AppointmentListComponent) },
];
