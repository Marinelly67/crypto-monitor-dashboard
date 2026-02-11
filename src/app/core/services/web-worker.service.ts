// <!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->
// <!-- Nombre del Proyecto: Monitoreo de Criptomonedas --> 
// <!-- Descripción: Aplicación web para monitorear precios de criptomonedas en tiempo real. -->
// <!-- Desarrollador: Marinelly Rodriguez C.I.: 9826256 -->
// <!-- Unidad Curricular Programación III - Modulo 1 -->
// <!-- Sección Didactica 4 -->
// <!-- Sección 6A-6B -->  
// <!-- Fecha de Desarrollo: Febrero 2026 -->
// <!-- Nombre del archivo: web-worker.service.ts -->
// <!-- Página Principal de los servicios de Web Workers -->
// <!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->

// Sección para la importa los módulos necesarios para la aplicación
import { Injectable } from '@angular/core';


// Sección para la definición del servicio de Web Workers
@Injectable({
  providedIn: 'root'
})

// Servicio para manejar cálculos intensivos usando Web Workers, como media móvil y volatilidad de precios de criptomonedas  
export class WebWorkerService {
  private worker: Worker | undefined;

  // Constructor para inicializar el Web Worker
  constructor() {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(
        new URL('../workers/calculations.worker', import.meta.url),
        { type: 'module' }
      );
    } else {
      console.warn('Web Workers no están soportados en este navegador');
    }
  }

  // Métodos para calcular media móvil y volatilidad usando Web Workers
  calculateMovingAverage(prices: number[], period: number = 10): Promise<number> {
    return new Promise((resolve) => {
      if (!this.worker) {
        resolve(this.fallbackMovingAverage(prices, period));
        return;
      }

      const messageHandler = (event: MessageEvent) => {
        if (event.data.type === 'MOVING_AVERAGE_RESULT') {
          this.worker?.removeEventListener('message', messageHandler);
          resolve(event.data.payload.value);
        }
      };

      this.worker.addEventListener('message', messageHandler);
      this.worker.postMessage({
        type: 'CALCULATE_MOVING_AVERAGE',
        payload: { prices, period }
      });
    });
  }

  // Método para calcular volatilidad usando Web Workers
  calculateVolatility(prices: number[]): Promise<number> {
    return new Promise((resolve) => {
      if (!this.worker) {
        resolve(this.fallbackVolatility(prices));
        return;
      }

      const messageHandler = (event: MessageEvent) => {
        if (event.data.type === 'VOLATILITY_RESULT') {
          this.worker?.removeEventListener('message', messageHandler);
          resolve(event.data.payload.value);
        }
      };

      this.worker.addEventListener('message', messageHandler);
      this.worker.postMessage({
        type: 'CALCULATE_VOLATILITY',
        payload: { prices }
      });
    });
  }

  // Fallback si no hay Web Worker
  private fallbackMovingAverage(prices: number[], period: number): number {
    if (prices.length < period) return 0;
    const slice = prices.slice(-period);
    return slice.reduce((a, b) => a + b, 0) / period;
  }

  // Fallback si no hay Web Worker
  private fallbackVolatility(prices: number[]): number {
    if (prices.length < 20) return 0;
    const slice = prices.slice(-20);
    const mean = slice.reduce((a, b) => a + b, 0) / slice.length;
    const squaredDiffs = slice.map(price => Math.pow(price - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / slice.length;
    return Math.sqrt(variance);
  }

  // Método para limpiar el Web Worker al destruir el servicio  
  destroy() {
    this.worker?.terminate();
  }
}