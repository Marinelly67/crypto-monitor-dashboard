
import { Component } from '@angular/core';
import { DashboardContainerComponent } from './features/dashboard/containers/dashboard-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardContainerComponent],
  template: `
    <!-- SOLO tu dashboard - NADA MÁS -->
    <app-dashboard-container></app-dashboard-container>
  `
})
export class AppComponent {
  title = 'UNETI - Dashboard de Criptomonedas';
}

