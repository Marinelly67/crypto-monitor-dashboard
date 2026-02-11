// <!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->
// <!-- Nombre del Proyecto: Monitoreo de Criptomonedas --> 
// <!-- Descripción: Aplicación web para monitorear precios de criptomonedas en tiempo real. -->
// <!-- Desarrollador: Marinelly Rodriguez C.I.: 9826256 -->
// <!-- Unidad Curricular Programación III - Modulo 1 -->
// <!-- Sección Didactica 4 -->
// <!-- Sección 6A-6B -->  
// <!-- Fecha de Desarrollo: Febrero 2026 -->
// <!-- Nombre del archivo: dashboard-container.component.ts -->
// <!-- Página Principal del Contenedor del Dashboard -->
// <!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->

// Importaciones necesarias para el componente del Dashboard
import { 
  Component, 
  signal, 
  computed, 
  inject,
  OnInit,
  ChangeDetectionStrategy 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CryptoDataService } from '../../../core/services/crypto-data.service';
import { CryptoCardComponent } from '../components/crypto-card/crypto-card.component';
import { AlertConfigComponent } from '../components/alert-config/alert-config.component';
import { MarketSummaryComponent } from '../components/market-summary/market-summary.component';

// Definición del componente del Dashboard
@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [
    CommonModule,
    CryptoCardComponent,
    AlertConfigComponent,
    MarketSummaryComponent
  ],
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardContainerComponent implements OnInit {
  private cryptoDataService = inject(CryptoDataService);
  
  // Signals
  readonly cryptoAssets = computed(() => this.cryptoDataService.cryptoAssets());
  readonly filterText = signal<string>('');
  readonly sortBy = signal<'name' | 'price' | 'change'>('name');
  readonly sortDirection = signal<'asc' | 'desc'>('asc');
  
  // Computed filtered and sorted assets
  readonly filteredAssets = computed(() => {
    let assets = [...this.cryptoAssets()];
    
    // Filter by text
    if (this.filterText()) {
      const searchText = this.filterText().toLowerCase();
      assets = assets.filter(asset => 
        asset.name.toLowerCase().includes(searchText) ||
        asset.symbol.toLowerCase().includes(searchText)
      );
    }
    
    // Sort
    assets.sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortBy()) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.currentPrice - b.currentPrice;
          break;
        case 'change':
          comparison = a.changePercent - b.changePercent;
          break;
      }
      
      return this.sortDirection() === 'asc' ? comparison : -comparison;
    });
    
    return assets;
  });
  
  // Lifecycle hook
  ngOnInit() {
    console.log('Dashboard initialized with', this.cryptoAssets().length, 'assets');
  }
  
  // Methods to update signals
  updateFilter(text: string) {
    this.filterText.set(text);
  }
  
  //  Toggle sorting field and direction
  updateSort(field: 'name' | 'price' | 'change') {
    if (this.sortBy() === field) {
      // Toggle direction if same field
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to asc
      this.sortBy.set(field);
      this.sortDirection.set('asc');
    }
  }
  
  // Get icon for sorting
  getSortIcon(field: 'name' | 'price' | 'change'): string {
    if (this.sortBy() !== field) return '↕️';
    return this.sortDirection() === 'asc' ? '↑' : '↓';
  }
  
  // Refresh data from API
  refreshData() {
    // En un caso real, aquí llamaríamos al servicio para refrescar datos
    console.log('Refresh data');
  }
}