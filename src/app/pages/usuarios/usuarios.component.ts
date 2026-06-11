import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario, UserRole, RoleLabels, RoleIcons } from '../../core/models/usuario';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatTableModule,
    MatIconModule, MatSnackBarModule, MatDialogModule, MatSlideToggleModule,
    MatTooltipModule
  ],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly usuarioService = inject(UsuarioService);
  private readonly snackBar = inject(MatSnackBar);

  usuarios: Usuario[] = [];
  mostrarFormulario = false;
  modoEdicion = false;
  usuarioEditando: Usuario | null = null;
  loading = false;

  displayedColumns: string[] = ['fullName', 'email', 'role', 'isActive', 'acciones'];

  // Roles con íconos y etiquetas
  roleOptions = [
    { value: 'ADMIN' as UserRole, label: 'Administrador', icon: 'admin_panel_settings' },
    { value: 'TEACHER' as UserRole, label: 'Docente', icon: 'school' },
    { value: 'STUDENT' as UserRole, label: 'Estudiante', icon: 'person' },
    { value: 'VETERINARIAN' as UserRole, label: 'Veterinario', icon: 'medical_services' },
    { value: 'USER' as UserRole, label: 'Asistente', icon: 'badge' }
  ];

  RoleLabels = RoleLabels;
  RoleIcons = RoleIcons;

  form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.minLength(6)]],
    role: ['STUDENT' as UserRole, [Validators.required]],
    dni: [''],
    faculty: ['']
  });

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.loading = true;
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error al cargar usuarios', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  abrirFormulario(): void {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.usuarioEditando = null;
    this.form.reset({ role: 'STUDENT' });
    this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
  }

  editarUsuario(usuario: Usuario): void {
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    this.usuarioEditando = usuario;
    this.form.patchValue({
      fullName: usuario.fullName,
      email: usuario.email,
      role: usuario.role,
      dni: usuario.dni,
      faculty: usuario.faculty
    });
    this.form.get('password')?.clearValidators();
    this.form.get('password')?.updateValueAndValidity();
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.form.reset();
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const datosUsuario: Usuario = {
      ...this.form.value,
      isActive: true
    } as Usuario;

    const operacion = this.modoEdicion && this.usuarioEditando?.id
      ? this.usuarioService.actualizar(this.usuarioEditando.id, datosUsuario)
      : this.usuarioService.crear(datosUsuario);

    operacion.subscribe({
      next: () => {
        this.snackBar.open(
          this.modoEdicion ? 'Usuario actualizado' : 'Usuario creado',
          'Cerrar',
          { duration: 3000 }
        );
        this.cargarUsuarios();
        this.cerrarFormulario();
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error al guardar usuario', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  cambiarEstado(usuario: Usuario): void {
    if (!usuario.id) return;
    const nuevoEstado = !usuario.isActive;

    this.usuarioService.cambiarEstado(usuario.id, nuevoEstado ? 'ACTIVO' : 'INACTIVO').subscribe({
      next: () => {
        this.snackBar.open(`Usuario ${nuevoEstado ? 'activado' : 'desactivado'}`, 'Cerrar', { duration: 2000 });
        this.cargarUsuarios();
      },
      error: () => {
        this.snackBar.open('Error al cambiar estado', 'Cerrar', { duration: 3000 });
      }
    });
  }

  eliminarUsuario(usuario: Usuario): void {
    if (!usuario.id) return;
    if (!confirm(`¿Eliminar a ${usuario.fullName}?`)) return;

    this.usuarioService.eliminar(usuario.id).subscribe({
      next: () => {
        this.snackBar.open('Usuario eliminado', 'Cerrar', { duration: 2000 });
        this.cargarUsuarios();
      },
      error: () => {
        this.snackBar.open('Error al eliminar usuario', 'Cerrar', { duration: 3000 });
      }
    });
  }

  getRoleIcon(role: UserRole): string {
    return RoleIcons[role] || 'person';
  }

  getRoleLabel(role: UserRole): string {
    return RoleLabels[role] || role;
  }
}
