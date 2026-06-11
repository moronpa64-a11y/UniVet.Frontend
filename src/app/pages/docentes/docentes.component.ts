import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DocenteService } from '../../core/services/docente.service';
import { Docente } from '../../core/models/docente';

@Component({
  selector: 'app-docentes',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatTableModule, MatIconModule, MatSnackBarModule
  ],
  templateUrl: './docentes.component.html',
  styleUrls: ['./docentes.component.scss']
})
export class DocentesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly docenteService = inject(DocenteService);
  private readonly snackBar = inject(MatSnackBar);

  docentes: Docente[] = [];
  mostrarFormulario = false;
  modoEdicion = false;
  docenteEditando: Docente | null = null;
  loading = false;

  displayedColumns: string[] = ['nombre', 'email', 'especialidad', 'documento', 'acciones'];

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    documento: ['', [Validators.required]],
    especialidad: ['', [Validators.required]],
    telefono: ['']
  });

  ngOnInit(): void {
    this.cargarDocentes();
  }

  cargarDocentes(): void {
    this.loading = true;
    this.docenteService.listar().subscribe({
      next: (data) => {
        this.docentes = data;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error al cargar docentes', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  abrirFormulario(): void {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.form.reset();
  }

  editarDocente(docente: Docente): void {
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    this.docenteEditando = docente;
    this.form.patchValue(docente);
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
    const datosDocente: Docente = { ...this.form.value, estado: 'ACTIVO' } as Docente;

    const operacion = this.modoEdicion && this.docenteEditando?.id
      ? this.docenteService.actualizar(this.docenteEditando.id, datosDocente)
      : this.docenteService.crear(datosDocente);

    operacion.subscribe({
      next: () => {
        this.snackBar.open(this.modoEdicion ? 'Docente actualizado' : 'Docente creado', 'Cerrar', { duration: 3000 });
        this.cargarDocentes();
        this.cerrarFormulario();
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error al guardar docente', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  eliminarDocente(docente: Docente): void {
    if (!docente.id || !confirm(`¿Eliminar a ${docente.nombre}?`)) return;
    this.docenteService.eliminar(docente.id).subscribe({
      next: () => {
        this.snackBar.open('Docente eliminado', 'Cerrar', { duration: 2000 });
        this.cargarDocentes();
      },
      error: () => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 })
    });
  }
}
