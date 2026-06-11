import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../auth/auth.service';
import { UsuarioService } from '../../core/services/usuario.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatIconModule, MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly snackBar = inject(MatSnackBar);

  usuario: any = null;
  modoEdicion = false;
  guardando = false;

  form = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnInit(): void {
    this.usuario = this.authService.getCurrentUser();
    if (this.usuario) {
      this.form.patchValue({
        fullName: this.usuario.fullName,
        email: this.usuario.email
      });
      this.form.disable();
    }
  }

  activarEdicion(): void {
    this.modoEdicion = true;
    this.form.enable();
    this.form.get('email')?.disable();
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.form.patchValue({
      fullName: this.usuario.fullName
    });
    this.form.disable();
  }

  guardarCambios(): void {
    if (this.form.invalid || !this.usuario?.sub) return;

    this.guardando = true;
    const datos = {
      fullName: this.form.get('fullName')?.value,
      email: this.usuario.email,
      role: this.usuario.role,
      isActive: true
    } as any;

    this.usuarioService.actualizar(this.usuario.sub, datos).subscribe({
      next: () => {
        this.snackBar.open('Perfil actualizado correctamente', 'Cerrar', { duration: 3000 });
        this.modoEdicion = false;
        this.form.disable();
        this.guardando = false;
        this.usuario.fullName = datos.fullName;
      },
      error: () => {
        this.snackBar.open('Error al actualizar el perfil', 'Cerrar', { duration: 3000 });
        this.guardando = false;
      }
    });
  }

  getRoleBadgeClass(): string {
    const rol = (this.usuario?.role || this.usuario?.rol || '').toLowerCase();
    return `badge-${rol}`;
  }

  getRolLabel(): string {
    const rol = this.usuario?.role || this.usuario?.rol || 'Usuario';
    const labels: Record<string, string> = {
      ADMIN: 'Administrador',
      TEACHER: 'Docente',
      STUDENT: 'Estudiante',
      VETERINARIAN: 'Veterinario',
      USER: 'Usuario'
    };
    return labels[rol] || rol;
  }
}
