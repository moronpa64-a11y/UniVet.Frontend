import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { LoginCredentials, LoginResponse, RegisterCredentials } from './auth.models';
import { environment } from '../../environments/environment';
import { UserRole } from '../core/models/usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly tokenKey = 'app_jwt_token';

  constructor(private readonly http: HttpClient) {}

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      map((response) => {
        if (response?.token) {
          this.setToken(response.token);
        }
        return response;
      })
    );
  }

  register(credentials: RegisterCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, credentials).pipe(
      map((response) => {
        if (response?.token) {
          this.setToken(response.token);
        }
        return response;
      })
    );
  }

  recuperarPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/forgot-password`, { email });
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Descifra el JWT y extrae el payload
   */
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      // Reemplazar caracteres URL-safe base64
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch (e) {
      console.error('Error al descifrar JWT:', e);
      return null;
    }
  }

  /**
   * Obtiene el rol del usuario desde el JWT
   * Compatible con campos: role, rol, authorities
   */
  getUserRole(): UserRole | null {
    const token = this.getToken();
    if (!token) return null;
    
    const decoded = this.decodeToken(token);
    if (!decoded) return null;

    // Spring Boot suele enviar authorities como array
    if (decoded.authorities && Array.isArray(decoded.authorities)) {
      const auth = decoded.authorities[0];
      return (auth?.authority || auth) as UserRole;
    }
    
    return (decoded.role || decoded.rol) as UserRole;
  }

  /**
   * Obtiene los datos del usuario actual desde el JWT
   */
  getCurrentUser(): any {
    const token = this.getToken();
    if (!token) return null;
    
    return this.decodeToken(token);
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  /**
   * Verifica si el usuario tiene alguno de los roles especificados
   */
  hasAnyRole(roles: string[]): boolean {
    const userRole = this.getUserRole();
    if (!userRole) return false;
    return roles.includes(userRole);
  }

  /**
   * Verifica si el usuario es administrador
   */
  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  /**
   * Verifica si el usuario es docente
   */
  isTeacher(): boolean {
    return this.hasRole('TEACHER');
  }

  /**
   * Verifica si el usuario es estudiante
   */
  isStudent(): boolean {
    return this.hasRole('STUDENT');
  }

  /**
   * Verifica si el usuario es veterinario
   */
  isVeterinarian(): boolean {
    return this.hasRole('VETERINARIAN');
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
}
