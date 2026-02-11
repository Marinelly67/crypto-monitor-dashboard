// <!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->
// <!-- Nombre del Proyecto: Monitoreo de Criptomonedas --> 
// <!-- Descripción: Aplicación web para monitorear precios de criptomonedas en tiempo real. -->
// <!-- Desarrollador: Marinelly Rodriguez C.I.: 9826256 -->
// <!-- Unidad Curricular Programación III - Modulo 1 -->
// <!-- Sección Didactica 4 -->
// <!-- Sección 6A-6B -->  
// <!-- Fecha de Desarrollo: Febrero 2026 -->
// <!-- Nombre del archivo: app.routes.ts -->
// <!-- Página Principal de la configuración de la aplicación -->
// <!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->

// Sección para la importa los módulos necesarios para la aplicación
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// Sección para la definición de la configuración de la aplicación
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};

