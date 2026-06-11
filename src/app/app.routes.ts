import { Routes } from '@angular/router';
import { InicioComponent } from './dashboard/inicio.component';
import { LoginComponent } from './auth/login.component';
import { RecuperarPasswordComponent } from './auth/recuperar-password.component';
import { RegistroComponent } from './auth/registro.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { DocentesComponent } from './pages/docentes/docentes.component';
import { EstudiantesComponent } from './pages/estudiantes/estudiantes.component';
import { EventosComponent } from './pages/eventos/eventos.component';
import { NoticiasComponent } from './pages/noticias/noticias.component';
import { ForosComponent } from './pages/foros/foros.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { VeterinariaComponent } from './pages/veterinaria/veterinaria.component';
import { BeneficiarioComponent } from './beneficiarios/beneficiario.component';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },

  { path: 'login', component: LoginComponent },
  { path: 'crear-cuenta', component: RegistroComponent },
  { path: 'recuperar-contrasena', component: RecuperarPasswordComponent },

  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'VETERINARIAN'] }
  },
  {
    path: 'veterinaria',
    component: VeterinariaComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'VETERINARIAN'] }
  },
  {
    path: 'beneficiarios',
    component: BeneficiarioComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'TEACHER', 'VETERINARIAN'] }
  },
  {
    path: 'docentes',
    component: DocentesComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'TEACHER'] }
  },
  {
    path: 'estudiantes',
    component: EstudiantesComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'TEACHER'] }
  },
  {
    path: 'eventos',
    component: EventosComponent,
    canActivate: [authGuard]
  },
  {
    path: 'noticias',
    component: NoticiasComponent
  },
  {
    path: 'foros',
    component: ForosComponent
  },
  {
    path: 'perfil',
    component: PerfilComponent,
    canActivate: [authGuard]
  },

  { path: '**', redirectTo: 'inicio' }
];
