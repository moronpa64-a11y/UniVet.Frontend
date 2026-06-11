import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../auth/auth.service';
import { RoleLabels, RoleIcons, UserRole } from '../core/models/usuario';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles: string[]; // [] = público | lista = roles permitidos
  badge?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatListModule, MatIconModule, MatButtonModule, MatDividerModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  /**
   * Menú con íconos representativos para cada sección
   */
  menuItems: MenuItem[] = [
    { label: 'Inicio', icon: 'dashboard', route: '/inicio', roles: [] },
    { label: 'Usuarios', icon: 'manage_accounts', route: '/usuarios', roles: ['ADMIN', 'VETERINARIAN'] },
    { label: 'Veterinaria', icon: 'medical_services', route: '/veterinaria', roles: ['ADMIN', 'VETERINARIAN'] },
    { label: 'Docentes', icon: 'school', route: '/docentes', roles: ['ADMIN', 'TEACHER'] },
    { label: 'Estudiantes', icon: 'groups', route: '/estudiantes', roles: ['ADMIN', 'TEACHER'] },
    { label: 'Eventos', icon: 'event_available', route: '/eventos', roles: ['ADMIN', 'TEACHER', 'STUDENT', 'VETERINARIAN'] },
    { label: 'Noticias', icon: 'campaign', route: '/noticias', roles: [] },
    { label: 'Foros', icon: 'forum', route: '/foros', roles: [] },
    { label: 'Perfil', icon: 'account_circle', route: '/perfil', roles: ['ADMIN', 'TEACHER', 'STUDENT', 'VETERINARIAN', 'USER'] }
  ];

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get currentUser(): any {
    return this.authService.getCurrentUser();
  }

  get userRole(): UserRole | null {
    return (this.authService.getUserRole() as UserRole) || null;
  }

  get userRoleLabel(): string {
    const role = this.userRole;
    return role ? RoleLabels[role] : 'Usuario';
  }

  get userRoleIcon(): string {
    const role = this.userRole;
    return role ? RoleIcons[role] : 'person';
  }

  canShowItem(item: MenuItem): boolean {
    // Si no requiere roles → es público (todos lo ven)
    if (item.roles.length === 0) return true;
    
    // Si requiere roles → debe estar autenticado y tener el rol
    if (!this.isAuthenticated) return false;
    return this.authService.hasAnyRole(item.roles);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  goToLogin(): void {
    this.router.navigateByUrl('/login');
  }
}
