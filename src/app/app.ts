import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './layout/sidebar.component';
import { FooterComponent } from './layout/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly router = inject(Router);

  get isAuthRoute(): boolean {
    const authRoutes = ['/login', '/crear-cuenta', '/recuperar-contrasena'];
    return authRoutes.includes(this.router.url);
  }
}
