// <!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->
// <!-- Nombre del Proyecto: Monitoreo de Criptomonedas --> 
// <!-- Descripción: Aplicación web para monitorear precios de criptomonedas en tiempo real. -->
// <!-- Desarrollador: Marinelly Rodriguez C.I.: 9826256 -->
// <!-- Unidad Curricular Programación III - Modulo 1 -->
// <!-- Sección Didactica 4 -->
// <!-- Sección 6A-6B -->  
// <!-- Fecha de Desarrollo: Febrero 2026 -->
// <!-- Nombre del archivo: market-summary.component.ts -->
// <!-- Página Principal del Resumen del Mercado -->
// <!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->


// Importaciones necesarias para el componente de resumen del mercado
import { 
  Component, 
  computed, 
  inject,
  ChangeDetectionStrategy 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CryptoDataService } from '../../../../core/services/crypto-data.service';

// Definición del componente de resumen del mercado
@Component({
  selector: 'app-market-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './market-summary.component.html',
  styleUrls: ['./market-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketSummaryComponent {
  private cryptoDataService = inject(CryptoDataService);
  
  // Computed values
  readonly totalMarketCap = computed(() => this.cryptoDataService.totalMarketCap());
  readonly topGainers = computed(() => this.cryptoDataService.topGainers());
  readonly topLosers = computed(() => this.cryptoDataService.topLosers());
  readonly assetsWithAlerts = computed(() => this.cryptoDataService.assetsWithAlerts());
  readonly totalAssets = computed(() => this.cryptoDataService.cryptoAssets().length);
  
  readonly marketSentiment = computed(() => {
    const assets = this.cryptoDataService.cryptoAssets();
    const positive = assets.filter(a => a.changePercent > 0).length;
    const negative = assets.filter(a => a.changePercent < 0).length;
    
    if (positive > negative) return 'bullish';
    if (negative > positive) return 'bearish';
    return 'neutral';
  });
  
  // Método para obtener el color del sentimiento del mercado
  getSentimentColor(): string {
    switch (this.marketSentiment()) {
      case 'bullish': return 'text-green-400';
      case 'bearish': return 'text-red-400';
      default: return 'text-gray-400';
    }
  }
  
  // Método para obtener el ícono de sentimiento del mercado
  getSentimentIcon(): string {
    switch (this.marketSentiment()) {
      case 'bullish': return '📈';
      case 'bearish': return '📉';
      default: return '➡️';
    }
  }
  
  // Método para formatear el número
  formatNumber(num: number): string {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
  }
}