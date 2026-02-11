// <!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->
// <!-- Nombre del Proyecto: Monitoreo de Criptomonedas --> 
//<!-- Descripción: Aplicación web para monitorear precios de criptomonedas en tiempo real. -->
// <!-- Desarrollador: Marinelly Rodriguez C.I.: 9826256 -->
// <!-- Unidad Curricular Programación III - Modulo 1 -->
// <!-- Sección Didactica 4 -->
// <!-- Sección 6A-6B -->  
// <!-- Fecha de Desarrollo: Febrero 2026 -->
// <!-- Nombre del archivo: crypto-card.component.ts -->
// <!-- Página Principal de la Tarjeta de Criptomoneda -->
// <!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->

// Importaciones necesarias para el componente de la tarjeta de criptomoneda
import { 
  Component, 
  Input, 
  ChangeDetectionStrategy,
  OnInit,
  signal,
  computed,
  inject 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CryptoAsset } from '../../../../shared/models/crypto.model';
import { HighlightChangeDirective } from '../../../../shared/directives/highlight-change.directive';
import { CryptoDataService } from '../../../../core/services/crypto-data.service';
import { WebWorkerService } from '../../../../core/services/web-worker.service';

// Definición del componente de la tarjeta de criptomoneda
@Component({
  selector: 'app-crypto-card',
  standalone: true,
  imports: [CommonModule, HighlightChangeDirective],
  templateUrl: './crypto-card.component.html',
  styleUrls: ['./crypto-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CryptoCardComponent implements OnInit {
  @Input({ required: true }) asset!: CryptoAsset;
  
  private cryptoDataService = inject(CryptoDataService);
  private workerService = inject(WebWorkerService);
  
  // Signals locales
  readonly movingAverage = signal<number>(0);
  readonly volatility = signal<number>(0);
  readonly hasAlert = signal<boolean>(false);
  
  // Computed para alerta activa
  readonly alertStatus = computed(() => {
    const alerts = this.cryptoDataService.userAlerts();
    const assetAlerts = alerts.filter(a => 
      a.symbol === this.asset.symbol && a.isActive
    );
    
    return assetAlerts.length > 0;
  });

  ngOnInit() {
    this.calculateMetrics();
    this.checkAlerts();
  }

  // Métodos privados para cálculos y verificación de alertas
  private async calculateMetrics() {
    if (this.asset.priceHistory.length >= 10) {
      const ma = await this.workerService.calculateMovingAverage(this.asset.priceHistory, 10);
      this.movingAverage.set(parseFloat(ma.toFixed(2)));
    }
    
    if (this.asset.priceHistory.length >= 20) {
      const vol = await this.workerService.calculateVolatility(this.asset.priceHistory);
      this.volatility.set(parseFloat(vol.toFixed(4)));
    }
  }

  private checkAlerts() {
    const alerts = this.cryptoDataService.userAlerts();
    const hasActiveAlert = alerts.some(alert => 
      alert.symbol === this.asset.symbol && 
      alert.isActive && 
      (
        (alert.type === 'above' && this.asset.currentPrice > alert.threshold) ||
        (alert.type === 'below' && this.asset.currentPrice < alert.threshold)
      )
    );
    
    this.hasAlert.set(hasActiveAlert);
  }

  getChangeColor(): string {
    if (this.asset.changePercent > 0) return 'text-green-400';
    if (this.asset.changePercent < 0) return 'text-red-400';
    return 'text-gray-400';
  }

getAbsoluteChange(changeAmount: number): number {
  return Math.abs(changeAmount);
}

  formatNumber(num: number): string {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  }
}