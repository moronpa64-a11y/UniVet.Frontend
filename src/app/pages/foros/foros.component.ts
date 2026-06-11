import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ForoService } from '../../core/services/foro.service';
import { Foro } from '../../core/models/foro';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-foros',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatButtonModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatIconModule, MatDialogModule, MatSnackBarModule
  ],
  templateUrl: './foros.component.html',
  styleUrls: ['./foros.component.scss']
})
export class ForosComponent implements OnInit {
  private readonly foroService = inject(ForoService);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  foros: Foro[] = [];
  mostrarNuevoTema = false;
  temaSeleccionado: Foro | null = null;
  loading = false;

  nuevoTema = { titulo: '', contenido: '' };
  nuevaRespuesta = '';

  ngOnInit(): void {
    this.cargarForos();
  }

  cargarForos(): void {
    this.loading = true;
    this.foroService.listar().subscribe({
      next: (data) => {
        this.foros = data;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error al cargar foros', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  abrirNuevoTema(): void {
    this.mostrarNuevoTema = true;
  }

  cerrarNuevoTema(): void {
    this.mostrarNuevoTema = false;
    this.nuevoTema = { titulo: '', contenido: '' };
  }

  guardarNuevoTema(): void {
    if (!this.nuevoTema.titulo || !this.nuevoTema.contenido) {
      this.snackBar.open('Completa todos los campos', 'Cerrar', { duration: 2000 });
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    const datosForo: Foro = {
      titulo: this.nuevoTema.titulo,
      contenido: this.nuevoTema.contenido,
      autor: currentUser?.fullName || currentUser?.sub || 'Usuario',
      email: currentUser?.email || 'email@ejemplo.com',
      fecha: new Date().toISOString(),
      respuestas: []
    };

    this.foroService.crear(datosForo).subscribe({
      next: () => {
        this.snackBar.open('Tema creado', 'Cerrar', { duration: 2000 });
        this.cargarForos();
        this.cerrarNuevoTema();
      },
      error: () => this.snackBar.open('Error al crear tema', 'Cerrar', { duration: 3000 })
    });
  }

  verTema(foro: Foro): void {
    this.temaSeleccionado = foro;
  }

  cerrarTema(): void {
    this.temaSeleccionado = null;
    this.nuevaRespuesta = '';
  }

  enviarRespuesta(): void {
    if (!this.nuevaRespuesta.trim() || !this.temaSeleccionado?.id) return;

    const currentUser = this.authService.getCurrentUser();
    const respuesta = {
      autor: currentUser?.fullName || currentUser?.sub || 'Usuario',
      contenido: this.nuevaRespuesta,
      fecha: new Date().toISOString()
    };

    this.foroService.agregarRespuesta(this.temaSeleccionado.id, respuesta).subscribe({
      next: () => {
        this.snackBar.open('Respuesta enviada', 'Cerrar', { duration: 2000 });
        this.nuevaRespuesta = '';
        this.cargarForos();
      },
      error: () => this.snackBar.open('Error al enviar respuesta', 'Cerrar', { duration: 3000 })
    });
  }
}
