import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EventoService } from '../../core/services/evento.service';
import { Evento } from '../../core/models/evento';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatSnackBarModule
  ],
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly eventoService = inject(EventoService);
  private readonly snackBar = inject(MatSnackBar);

  eventos: Evento[] = [];
  mostrarFormulario = false;
  modoEdicion = false;
  eventoEditando: Evento | null = null;
  loading = false;

  form = this.fb.group({
    titulo: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    fecha: ['', [Validators.required]],
    lugar: ['', [Validators.required]],
    organizador: [''],
    tipo: ['Brigada', [Validators.required]],
    imagenUrl: ['']
  });

  tipos = ['Brigada', 'Jornada', 'Taller', 'Conferencia', 'Actividad Comunitaria'];

  ngOnInit(): void {
    this.cargarEventos();
  }

  cargarEventos(): void {
    this.loading = true;
    this.eventoService.listar().subscribe({
      next: (data) => {
        this.eventos = data;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error al cargar eventos', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  abrirFormulario(): void {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.form.reset({ tipo: 'Brigada' });
  }

  editarEvento(evento: Evento): void {
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    this.eventoEditando = evento;
    this.form.patchValue(evento);
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
    const datosEvento: Evento = { ...this.form.value, estado: 'PROGRAMADO' } as Evento;

    const operacion = this.modoEdicion && this.eventoEditando?.id
      ? this.eventoService.actualizar(this.eventoEditando.id, datosEvento)
      : this.eventoService.crear(datosEvento);

    operacion.subscribe({
      next: () => {
        this.snackBar.open(this.modoEdicion ? 'Evento actualizado' : 'Evento creado', 'Cerrar', { duration: 3000 });
        this.cargarEventos();
        this.cerrarFormulario();
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error al guardar evento', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  eliminarEvento(evento: Evento): void {
    if (!evento.id || !confirm(`¿Eliminar evento "${evento.titulo}"?`)) return;
    this.eventoService.eliminar(evento.id).subscribe({
      next: () => {
        this.snackBar.open('Evento eliminado', 'Cerrar', { duration: 2000 });
        this.cargarEventos();
      },
      error: () => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 })
    });
  }
}
