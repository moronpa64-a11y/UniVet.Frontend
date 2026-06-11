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
import { NoticiaService } from '../../core/services/noticia.service';
import { Noticia } from '../../core/models/noticia';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatSnackBarModule
  ],
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.scss']
})
export class NoticiasComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly noticiaService = inject(NoticiaService);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  noticias: Noticia[] = [];
  mostrarFormulario = false;
  modoEdicion = false;
  noticiaEditando: Noticia | null = null;
  loading = false;

  form = this.fb.group({
    titulo: ['', [Validators.required]],
    contenido: ['', [Validators.required]],
    categoria: ['General', [Validators.required]],
    imagenUrl: ['', [Validators.required]]
  });

  categorias = ['General', 'Educación', 'Salud', 'Comunidad', 'Veterinaria', 'Social'];

  get isAdmin(): boolean {
    return this.authService.hasAnyRole(['ADMIN', 'TEACHER']);
  }

  ngOnInit(): void {
    this.cargarNoticias();
  }

  cargarNoticias(): void {
    this.loading = true;
    this.noticiaService.listar().subscribe({
      next: (data) => {
        this.noticias = data;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error al cargar noticias', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  abrirFormulario(): void {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.form.reset({ categoria: 'General' });
  }

  editarNoticia(noticia: Noticia): void {
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    this.noticiaEditando = noticia;
    this.form.patchValue(noticia);
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
    const currentUser = this.authService.getCurrentUser();
    const datosNoticia: Noticia = {
      ...this.form.value,
      autor: currentUser?.email || 'Administrador'
    } as Noticia;

    const operacion = this.modoEdicion && this.noticiaEditando?.id
      ? this.noticiaService.actualizar(this.noticiaEditando.id, datosNoticia)
      : this.noticiaService.crear(datosNoticia);

    operacion.subscribe({
      next: () => {
        this.snackBar.open(this.modoEdicion ? 'Noticia actualizada' : 'Noticia publicada', 'Cerrar', { duration: 3000 });
        this.cargarNoticias();
        this.cerrarFormulario();
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error al guardar noticia', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  eliminarNoticia(noticia: Noticia): void {
    if (!noticia.id || !confirm(`¿Eliminar noticia "${noticia.titulo}"?`)) return;
    this.noticiaService.eliminar(noticia.id).subscribe({
      next: () => {
        this.snackBar.open('Noticia eliminada', 'Cerrar', { duration: 2000 });
        this.cargarNoticias();
      },
      error: () => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 })
    });
  }
}
