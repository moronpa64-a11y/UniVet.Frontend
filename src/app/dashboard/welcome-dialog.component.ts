import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-welcome-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <div class="dialog-content">
      <h2>Bienvenido</h2>
      <p>Este panel te permite administrar beneficiarios, revisar datos y navegar con Angular Material.</p>
      <button mat-flat-button color="primary" mat-dialog-close>Cerrar</button>
    </div>
  `,
  styles: [
    ".dialog-content { display: grid; gap: 1rem; padding: 1rem; }",
    "h2 { margin: 0; color: #0b2545; }",
    "p { margin: 0; color: #475569; }"
  ]
})
export class WelcomeDialogComponent {}
