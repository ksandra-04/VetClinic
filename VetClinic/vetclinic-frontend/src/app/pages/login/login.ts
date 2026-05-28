import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule],
  template: `
    <div style="height:100vh; display:flex; align-items:center; justify-content:center; background:#f0f4f8;">
      <div class="form-card" style="width:360px;">
        <div style="text-align:center; margin-bottom:24px;">
          <div style="font-size:3rem;">🐾</div>
          <h2 style="margin:8px 0 4px; color:#1a237e; font-weight:700;">VetClinic</h2>
          <p style="color:#6b7280; margin:0; font-size:0.9rem;">Ingresa tus credenciales</p>
        </div>
        <div class="form-fields">
          <mat-form-field appearance="outline" style="width:100%">
            <mat-label>Usuario</mat-label>
            <input matInput [(ngModel)]="username">
          </mat-form-field>
          <mat-form-field appearance="outline" style="width:100%">
            <mat-label>Contraseña</mat-label>
            <input matInput type="password" [(ngModel)]="password">
          </mat-form-field>
          <button mat-raised-button class="btn-primary" style="width:100%; margin-top:8px;"
            (click)="login()" [disabled]="!username || !password">
            Ingresar
          </button>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.router.navigate(['/owners']);
      },
      error: () => this.snackBar.open('Usuario o contraseña incorrectos', 'OK', { duration: 3000 })
    });
  }
}
