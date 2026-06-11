import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from './auth.service';

interface DemoUser {
  label: string;
  email: string;
  password: string;
  role: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink, MatCardModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule,
    MatIconModule, MatTooltipModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  errorMessage = '';
  loading = false;
  showPassword = false;

  /**
   * Usuarios de demostración para pruebas rápidas
   */
  demoUsers: DemoUser[] = [
    { label: 'Administrador', email: 'admin@uniremington.edu.co', password: 'Admin2026*', role: 'ADMIN', icon: 'admin_panel_settings', color: '#ef4444' },
    { label: 'Docente', email: 'docente@uniremington.edu.co', password: 'Docente2026*', role: 'TEACHER', icon: 'school', color: '#3b82f6' },
    { label: 'Estudiante', email: 'estudiante@uniremington.edu.co', password: 'Estudiante2026*', role: 'STUDENT', icon: 'person', color: '#10b981' },
    { label: 'Veterinario', email: 'veterinario@uniremington.edu.co', password: 'Vet2026*', role: 'VETERINARIAN', icon: 'medical_services', color: '#8b5cf6' }
  ];

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  fillDemo(user: DemoUser): void {
    this.form.patchValue({
      email: user.email,
      password: user.password
    });
    this.snackBar.open(`Credenciales de ${user.label} cargadas`, 'Cerrar', { duration: 2000 });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.form.value as { email: string; password: string }).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('¡Bienvenido al portal!', 'Cerrar', { duration: 3000 });
        this.router.navigateByUrl('/inicio');
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message || 'Credenciales incorrectas. Verifica tu email y contraseña.';
        this.snackBar.open(this.errorMessage, 'Cerrar', { duration: 4000 });
      }
    });
  }
}
