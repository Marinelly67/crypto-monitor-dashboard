// <!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->
// <!-- Nombre del Proyecto: Monitoreo de Criptomonedas --> 
// <!-- Descripción: Aplicación web para monitorear precios de criptomonedas en tiempo real. -->
// <!-- Desarrollador: Marinelly Rodriguez C.I.: 9826256 -->
// <!-- Unidad Curricular Programación III - Modulo 1 -->
// <!-- Sección Didactica 4 -->
// <!-- Sección 6A-6B -->  
// <!-- Fecha de Desarrollo: Febrero 2026 -->
// <!-- Nombre del archivo: alert-config.component.ts -->
// <!-- Página Principal de la Configuración de Alertas -->
// <!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->

// Importaciones necesarias para el componente de configuración de alertas
import { 
  Component, 
  signal, 
  computed, 
  inject,
  ChangeDetectionStrategy 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CryptoDataService } from '../../../../core/services/crypto-data.service';
import { CryptoAsset, AlertThreshold } from '../../../../shared/models/crypto.model';

// Componente de configuración de alertas para criptomonedas
@Component({
  selector: 'app-alert-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alert-config.component.html',
  styleUrls: ['./alert-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

// Clase principal del componente de configuración de alertas
export class AlertConfigComponent {
  private cryptoDataService = inject(CryptoDataService);
  
  // Signals
  readonly assets = computed(() => this.cryptoDataService.cryptoAssets());
  readonly alerts = computed(() => this.cryptoDataService.userAlerts());
  
  // Form state
  readonly selectedSymbol = signal<string>('BTC');
  readonly thresholdValue = signal<number>(0);
  readonly alertType = signal<'above' | 'below'>('above');
  readonly isActive = signal<boolean>(true);

  getAssetColor(symbol: string): string {
    const asset = this.assets().find(a => a.symbol === symbol);
    return asset?.color || '#475569';
  }

  addAlert() {
    if (!this.thresholdValue()) {
      alert('Please enter a threshold value');
      return;
    }

    this.cryptoDataService.addAlert({
      symbol: this.selectedSymbol(),
      threshold: this.thresholdValue(),
      type: this.alertType(),
      isActive: this.isActive()
    });

    // Reset form
    this.thresholdValue.set(0);
  }

  removeAlert(alertId: string) {
    this.cryptoDataService.removeAlert(alertId);
  }

  toggleAlert(alertId: string, isActive: boolean) {
    this.cryptoDataService.updateAlert(alertId, { isActive });
  }
}