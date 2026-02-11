// <!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->
// <!-- Nombre del Proyecto: Monitoreo de Criptomonedas --> 
// <!-- Descripción: Aplicación web para monitorear precios de criptomonedas en tiempo real. -->
// <!-- Desarrollador: Marinelly Rodriguez C.I.: 9826256 -->
// <!-- Unidad Curricular Programación III - Modulo 1 -->
// <!-- Sección Didactica 4 -->
// <!-- Sección 6A-6B -->  
// <!-- Fecha de Desarrollo: Febrero 2026 -->
// <!-- Nombre del archivo: app.routes.ts -->
// <!-- Página Principal de la Aplicación de Monitoreo de Criptomonedas -->
// <!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->

// importa la clase Routes del módulo @angular/router para definir las rutas de la aplicación
import { Routes } from '@angular/router';

// define las rutas de la aplicación
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./features/dashboard/containers/dashboard-container.component')
        .then(m => m.DashboardContainerComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

