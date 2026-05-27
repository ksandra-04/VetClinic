import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule],
  template: `
    <mat-toolbar color="primary">
      <span>🐾 VetClinic</span>
      <span style="flex: 1"></span>
      <a mat-button routerLink="/owners" routerLinkActive="active-link">Dueños</a>
      <a mat-button routerLink="/pets" routerLinkActive="active-link">Mascotas</a>
      <a mat-button routerLink="/veterinarians" routerLinkActive="active-link">Veterinarios</a>
      <a mat-button routerLink="/appointments" routerLinkActive="active-link">Citas</a>
    </mat-toolbar>
  `,
  styles: [`.active-link { background: rgba(255,255,255,0.2); border-radius: 4px; }`]
})
export class NavbarComponent { }
