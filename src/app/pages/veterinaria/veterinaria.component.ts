import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HistoriaClinicaService } from '../../core/services/historia-clinica.service';
import { HistoriaClinica } from '../../core/models/historia-clinica';

@Component({
  selector: 'app-veterinaria',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatIconModule, MatButtonModule, MatChipsModule,
    MatDividerModule, MatBadgeModule, MatTooltipModule, MatExpansionModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule,
    MatSnackBarModule, MatProgressSpinnerModule
  ],
  templateUrl: './veterinaria.component.html',
  styleUrls: ['./veterinaria.component.scss']
})
export class VeterinariaComponent implements OnInit {
  private readonly historiaService = inject(HistoriaClinicaService);
  private readonly snackBar = inject(MatSnackBar);

  registros: HistoriaClinica[] = [];
  loading = false;
  mostrarFormulario = false;
  modoEdicion = false;
  registroEditandoId: number | null = null;

  nuevoRegistro: Partial<HistoriaClinica> = {};
  especiesDisponibles = ['Perro', 'Gato', 'Ave', 'Conejo', 'Reptil', 'Otro'];

  ngOnInit(): void {
    this.cargarRegistros();
  }

  cargarRegistros(): void {
    this.loading = true;
    this.historiaService.listar().subscribe({
      next: (data) => {
        this.registros = data;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error al cargar registros veterinarios', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  abrirFormulario(): void {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.registroEditandoId = null;
    this.nuevoRegistro = { enRevision: false, dadoDeAlta: false, miligramos: 0 };
    setTimeout(() => document.querySelector('.formulario-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  editarRegistro(reg: HistoriaClinica): void {
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    this.registroEditandoId = reg.id ?? null;
    this.nuevoRegistro = { ...reg };
    setTimeout(() => document.querySelector('.formulario-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.modoEdicion = false;
    this.registroEditandoId = null;
    this.nuevoRegistro = {};
  }

  guardarRegistro(): void {
    const datos = this.nuevoRegistro as HistoriaClinica;

    if (this.modoEdicion && this.registroEditandoId !== null) {
      this.historiaService.actualizar(this.registroEditandoId, datos).subscribe({
        next: () => {
          this.snackBar.open('Registro actualizado', 'Cerrar', { duration: 2000 });
          this.cargarRegistros();
          this.cancelarFormulario();
        },
        error: () => this.snackBar.open('Error al actualizar', 'Cerrar', { duration: 3000 })
      });
    } else {
      const hoy = new Date();
      if (!datos.fecha) {
        datos.fecha = `${String(hoy.getDate()).padStart(2,'0')}/${String(hoy.getMonth()+1).padStart(2,'0')}/${hoy.getFullYear()}`;
      }
      this.historiaService.crear(datos).subscribe({
        next: () => {
          this.snackBar.open('Registro creado', 'Cerrar', { duration: 2000 });
          this.cargarRegistros();
          this.cancelarFormulario();
        },
        error: () => this.snackBar.open('Error al crear registro', 'Cerrar', { duration: 3000 })
      });
    }
  }

  eliminarRegistro(reg: HistoriaClinica): void {
    if (!reg.id) return;
    if (!confirm(`¿Eliminar el registro de ${reg.mascota} (${reg.usuario})?`)) return;
    this.historiaService.eliminar(reg.id).subscribe({
      next: () => {
        this.snackBar.open('Registro eliminado', 'Cerrar', { duration: 2000 });
        this.cargarRegistros();
      },
      error: () => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 })
    });
  }

  formularioValido(): boolean {
    return !!(
      this.nuevoRegistro.usuario?.trim() &&
      this.nuevoRegistro.mascota?.trim() &&
      this.nuevoRegistro.especie &&
      this.nuevoRegistro.padecimiento?.trim() &&
      this.nuevoRegistro.medicamento?.trim()
    );
  }

  getEspecieIcon(especie: string): string {
    switch (especie?.toLowerCase()) {
      case 'perro': return 'pets';
      case 'gato': return 'pets';
      case 'ave': return 'flutter_dash';
      default: return 'cruelty_free';
    }
  }

  totalEnRevision(): number { return this.registros.filter(r => r.enRevision).length; }
  totalDadosAlta(): number { return this.registros.filter(r => r.dadoDeAlta).length; }
}
