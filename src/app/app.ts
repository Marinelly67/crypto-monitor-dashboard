// <!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->
// <!-- Nombre del Proyecto: Monitoreo de Criptomonedas --> 
// <!-- Descripción: Aplicación web para monitorear precios de criptomonedas en tiempo real. -->
// <!-- Desarrollador: Marinelly Rodriguez C.I.: 9826256 -->
// <!-- Unidad Curricular Programación III - Modulo 1 -->
// <!-- Sección Didactica 4 -->
// <!-- Sección 6A-6B -->  
// <!-- Fecha de Desarrollo: Febrero 2026 -->
// <!-- Nombre del archivo: app.ts -->
// <!-- Página Principal de la configuración de la aplicación -->
// <!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->

// Sección para la importa los módulos necesarios para la aplicación
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Sección para la definición del componente principal de la aplicación
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('crypto-monitor-dashboard');
}
