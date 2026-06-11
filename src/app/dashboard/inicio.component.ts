import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { AuthService } from '../auth/auth.service';
import { RoleLabels, UserRole } from '../core/models/usuario';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule, MatIconModule, MatDialogModule, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  private readonly authService = inject(AuthService);

  // Estadísticas
  totalBeneficiarios = 450;
  totalServicios = 28;
  coberturaTerritorial = '15 municipios';
  totalMascotas = 87;
  totalIntervenciones = 142;

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get isAdmin(): boolean {
    return this.authService.hasRole('ADMIN');
  }

  get isTeacher(): boolean {
    return this.authService.hasRole('TEACHER');
  }

  get isStudent(): boolean {
    return this.authService.hasRole('STUDENT');
  }

  get isVeterinarian(): boolean {
    return this.authService.hasRole('VETERINARIAN');
  }

  get currentUser(): any {
    return this.authService.getCurrentUser();
  }

  get userRoleLabel(): string {
    const role = this.authService.getUserRole() as UserRole;
    return role ? RoleLabels[role] : '';
  }

  get welcomeMessage(): string {
    if (!this.isAuthenticated) return 'Bienvenido al Portal Institucional';
    const name = this.currentUser?.fullName || this.currentUser?.full_name || this.currentUser?.email?.split('@')[0] || 'Usuario';
    return `¡Bienvenido, ${name}!`;
  }

  // Datos para gráficos (solo ADMIN)
  serviciosChartData = {
    labels: ['Veterinaria', 'Salud', 'Educación', 'Social'],
    datasets: [{ 
      data: [35, 25, 22, 18], 
      label: 'Servicios',
      backgroundColor: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b']
    }]
  };
  serviciosChartType = 'bar' as const;

  coberturaChartData = {
    labels: ['Norte', 'Sur', 'Este', 'Oeste', 'Centro'],
    datasets: [{ 
      data: [14, 11, 10, 9, 8], 
      label: 'Municipios',
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true
    }]
  };
  coberturaChartType = 'line' as const;

  intervencionesChartData = {
    labels: ['Atendidos', 'En Espera', 'En Triaje'],
    datasets: [{
      data: [98, 32, 12],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
    }]
  };
  intervencionesChartType = 'doughnut' as const;

  ngOnInit(): void {
    // Cargar datos si es necesario
  }
}
