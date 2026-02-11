// <!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->
// <!-- Nombre del Proyecto: Monitoreo de Criptomonedas --> 
// <!-- Descripción: Aplicación web para monitorear precios de criptomonedas en tiempo real. -->
// <!-- Desarrollador: Marinelly Rodriguez C.I.: 9826256 -->
// <!-- Unidad Curricular Programación III - Modulo 1 -->
// <!-- Sección Didactica 4 -->
// <!-- Sección 6A-6B -->  
// <!-- Fecha de Desarrollo: Febrero 2026 -->
// <!-- Nombre del archivo: app.routes.ts -->
// <!-- Página Principal de los servicios de datos de criptomonedas -->
// <!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->


// Sección para la importa los módulos necesarios para la aplicación
import { Injectable, signal, computed, inject } from '@angular/core';
import { interval } from 'rxjs';
import { CryptoAsset, AlertThreshold } from '../../shared/models/crypto.model';
import { WebWorkerService } from './web-worker.service';

// Sección para la definición del servicio de datos de criptomonedas
@Injectable({
  providedIn: 'root'
})

// Servicio para manejar los datos de criptomonedas, incluyendo precios, alertas y métricas
export class CryptoDataService {
  private workerService = inject(WebWorkerService);
  
  // Signals para el estado
  readonly cryptoAssets = signal<CryptoAsset[]>(this.initializeAssets());
  readonly userAlerts = signal<AlertThreshold[]>([]);
  readonly updateInterval = signal(200); // ms
  
  // Computed values
  readonly topGainers = computed(() => {
    return this.cryptoAssets()
      .filter(asset => asset.changePercent > 0)
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, 3);
  });
  
  readonly topLosers = computed(() => {
    return this.cryptoAssets()
      .filter(asset => asset.changePercent < 0)
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, 3);
  });
  
  readonly totalMarketCap = computed(() => {
    return this.cryptoAssets().reduce((sum, asset) => sum + asset.marketCap, 0);
  });
  
  readonly assetsWithAlerts = computed(() => {
    const alerts = this.userAlerts();
    return this.cryptoAssets().filter(asset => {
      const alert = alerts.find(a => a.symbol === asset.symbol && a.isActive);
      if (!alert) return false;
      
      return alert.type === 'above' 
        ? asset.currentPrice > alert.threshold
        : asset.currentPrice < alert.threshold;
    });
  });

  // Método para inicializar los datos de las criptomonedas con valores simulados
  private initializeAssets(): CryptoAsset[] {
    const assets = [
      {
        id: '1',
        symbol: 'BTC',
        name: 'Bitcoin',
        currentPrice: 45000,
        previousPrice: 44800,
        changePercent: 0.45,
        changeAmount: 200,
        marketCap: 880000000000,
        volume24h: 25000000000,
        lastUpdated: new Date(),
        priceHistory: Array.from({length: 50}, (_, i) => 44000 + Math.random() * 2000),
        color: '#f7931a'
      },
      {
        id: '2',
        symbol: 'ETH',
        name: 'Ethereum',
        currentPrice: 2400,
        previousPrice: 2380,
        changePercent: 0.84,
        changeAmount: 20,
        marketCap: 288000000000,
        volume24h: 12000000000,
        lastUpdated: new Date(),
        priceHistory: Array.from({length: 50}, (_, i) => 2300 + Math.random() * 200),
        color: '#627eea'
      },
      {
        id: '3',
        symbol: 'SOL',
        name: 'Solana',
        currentPrice: 95,
        previousPrice: 94.5,
        changePercent: 0.53,
        changeAmount: 0.5,
        marketCap: 41000000000,
        volume24h: 3500000000,
        lastUpdated: new Date(),
        priceHistory: Array.from({length: 50}, (_, i) => 90 + Math.random() * 10),
        color: '#00ffa3'
      },
      {
        id: '4',
        symbol: 'ADA',
        name: 'Cardano',
        currentPrice: 0.48,
        previousPrice: 0.475,
        changePercent: 1.05,
        changeAmount: 0.005,
        marketCap: 17000000000,
        volume24h: 450000000,
        lastUpdated: new Date(),
        priceHistory: Array.from({length: 50}, (_, i) => 0.45 + Math.random() * 0.1),
        color: '#0033ad'
      },
      {
        id: '5',
        symbol: 'DOT',
        name: 'Polkadot',
        currentPrice: 7.2,
        previousPrice: 7.15,
        changePercent: 0.7,
        changeAmount: 0.05,
        marketCap: 9200000000,
        volume24h: 280000000,
        lastUpdated: new Date(),
        priceHistory: Array.from({length: 50}, (_, i) => 7 + Math.random() * 0.5),
        color: '#e6007a'
      },
      {
        id: '6',
        symbol: 'XRP',
        name: 'Ripple',
        currentPrice: 0.62,
        previousPrice: 0.615,
        changePercent: 0.81,
        changeAmount: 0.005,
        marketCap: 33600000000,
        volume24h: 1200000000,
        lastUpdated: new Date(),
        priceHistory: Array.from({length: 50}, (_, i) => 0.6 + Math.random() * 0.05),
        color: '#23292f'
      }
    ];
    
    return assets;
  }

  constructor() {
    // Simular actualizaciones en tiempo real
    this.startPriceUpdates();
  }

  private startPriceUpdates() {
    interval(this.updateInterval()).subscribe(() => {
      const updatedAssets = this.cryptoAssets().map(asset => {
        const fluctuation = (Math.random() - 0.5) * 0.02; // +/- 1%
        const newPrice = asset.currentPrice * (1 + fluctuation);
        const changeAmount = newPrice - asset.currentPrice;
        const changePercent = (changeAmount / asset.currentPrice) * 100;
        
        // Actualizar historial de precios
        const updatedHistory = [...asset.priceHistory.slice(1), newPrice];
        
        // Calcular métricas en el worker
        this.calculateMetrics(asset.symbol, updatedHistory);
        
        return {
          ...asset,
          previousPrice: asset.currentPrice,
          currentPrice: parseFloat(newPrice.toFixed(2)),
          changeAmount: parseFloat(changeAmount.toFixed(2)),
          changePercent: parseFloat(changePercent.toFixed(2)),
          priceHistory: updatedHistory,
          lastUpdated: new Date()
        };
      });
      
      this.cryptoAssets.set(updatedAssets);
    });
  }

  // Método para calcular métricas como media móvil y volatilidad usando Web Workers
  private async calculateMetrics(symbol: string, priceHistory: number[]) {
    try {
      const [movingAvg, volatility] = await Promise.all([
        this.workerService.calculateMovingAverage(priceHistory, 10),
        this.workerService.calculateVolatility(priceHistory)
      ]);
      
      console.log(`${symbol} - MA: ${movingAvg.toFixed(2)}, Vol: ${volatility.toFixed(4)}`);
    } catch (error) {
      console.error('Error calculando métricas:', error);
    }
  }

  // Métodos para manejar alertas de usuario
  addAlert(alert: Omit<AlertThreshold, 'id'>) {
    const newAlert: AlertThreshold = {
      ...alert,
      id: Date.now().toString(),
      isActive: true
    };
    
    this.userAlerts.update(alerts => [...alerts, newAlert]);
  }

  removeAlert(alertId: string) {
    this.userAlerts.update(alerts => alerts.filter(a => a.id !== alertId));
  }

  updateAlert(alertId: string, updates: Partial<AlertThreshold>) {
    this.userAlerts.update(alerts =>
      alerts.map(alert => 
        alert.id === alertId ? { ...alert, ...updates } : alert
      )
    );
  }

  getAssetBySymbol(symbol: string) {
    return this.cryptoAssets().find(asset => asset.symbol === symbol);
  }
}