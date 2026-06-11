import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EstudianteService } from '../../core/services/estudiante.service';
import { Estudiante } from '../../core/models/estudiante';

@Component({
  selector: 'app-estudiantes',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatTableModule, MatIconModule,
    MatSelectModule, MatSnackBarModule
  ],
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.scss']
})
export class EstudiantesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly estudianteService = inject(EstudianteService);
  private readonly snackBar = inject(MatSnackBar);

  estudiantes: Estudiante[] = [];
  mostrarFormulario = false;
  modoEdicion = false;
  estudianteEditando: Estudiante | null = null;
  loading = false;

  displayedColumns: string[] = ['nombre', 'email', 'programa', 'semestre', 'documento', 'acciones'];

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    documento: ['', [Validators.required]],
    programa: ['', [Validators.required]],
    semestre: [1, [Validators.min(1), Validators.max(12)]],
    telefono: ['']
  });

  programas = [
    'Administración de Empresas',
    'Contaduría Pública',
    'Derecho',
    'Ingeniería de Sistemas',
    'Medicina Veterinaria',
    'Psicología',
    'Trabajo Social'
  ];

  ngOnInit(): void {
    this.cargarEstudiantes();
  }

  cargarEstudiantes(): void {
    this.loading = true;
    this.estudianteService.listar().subscribe({
      next: (data) => {
        this.estudiantes = data;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error al cargar estudiantes', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  abrirFormulario(): void {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.form.reset({ semestre: 1 });
  }

  editarEstudiante(estudiante: Estudiante): void {
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    this.estudianteEditando = estudiante;
    this.form.patchValue({
      nombre: estudiante.nombre,
      email: estudiante.email,
      documento: estudiante.documento,
      programa: estudiante.programa,
      semestre: estudiante.semestre,
      telefono: estudiante.telefono
    });
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
    const datosEstudiante: Estudiante = { 
      ...this.form.value, 
      estado: 'ACTIVO' 
    } as Estudiante;

    const operacion = this.modoEdicion && this.estudianteEditando?.id
      ? this.estudianteService.actualizar(this.estudianteEditando.id, datosEstudiante)
      : this.estudianteService.crear(datosEstudiante);

    operacion.subscribe({
      next: () => {
        this.snackBar.open(
          this.modoEdicion ? 'Estudiante actualizado' : 'Estudiante creado',
          'Cerrar',
          { duration: 3000 }
        );
        this.cargarEstudiantes();
        this.cerrarFormulario();
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error al guardar estudiante', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  eliminarEstudiante(estudiante: Estudiante): void {
    if (!estudiante.id) return;
    
    if (!confirm(`¿Eliminar a ${estudiante.nombre}?`)) return;

    this.estudianteService.eliminar(estudiante.id).subscribe({
      next: () => {
        this.snackBar.open('Estudiante eliminado', 'Cerrar', { duration: 2000 });
        this.cargarEstudiantes();
      },
      error: () => {
        this.snackBar.open('Error al eliminar estudiante', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
