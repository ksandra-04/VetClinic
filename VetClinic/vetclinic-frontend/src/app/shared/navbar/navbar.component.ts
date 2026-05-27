import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule],
  template: `
    <mat-toolbar class="vet-navbar">
      <span class="brand">🐾 VetClinic</span>
      <span style="flex:1"></span>
      <a mat-button class="nav-link" routerLink="/owners"        routerLinkActive="active-link">Dueños</a>
      <a mat-button class="nav-link" routerLink="/pets"          routerLinkActive="active-link">Mascotas</a>
      <a mat-button class="nav-link" routerLink="/veterinarians" routerLinkActive="active-link">Veterinarios</a>
      <a mat-button class="nav-link" routerLink="/appointments"  routerLinkActive="active-link">Citas</a>
    </mat-toolbar>
  `
})
export class NavbarComponent { }
