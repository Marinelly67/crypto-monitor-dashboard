// <!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->
// <!-- Nombre del Proyecto: Monitoreo de Criptomonedas --> 
// <!-- Descripción: Aplicación web para monitorear precios de criptomonedas en tiempo real. -->
// <!-- Desarrollador: Marinelly Rodriguez C.I.: 9826256 -->
// <!-- Unidad Curricular Programación III - Modulo 1 -->
// <!-- Sección Didactica 4 -->
// <!-- Sección 6A-6B -->  
// <!-- Fecha de Desarrollo: Febrero 2026 -->
// <!-- Nombre del archivo: highlight-change.directive.ts -->
// <!-- Página Principal de la Directiva de Resaltado de Cambios -->
//<!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->

// Importaciones necesarias para la directiva de resaltado de cambios
import { 
  Directive, 
  ElementRef, 
  Input, 
  OnChanges, 
  SimpleChanges,
  Renderer2,
  AfterViewInit
} from '@angular/core';

// Definición de la directiva de resaltado de cambios
@Directive({
  selector: '[appHighlightChange]',
  standalone: true
})
export class HighlightChangeDirective implements OnChanges, AfterViewInit {
  @Input() appHighlightChange: number = 0;
  @Input() changeType: 'price' | 'percent' = 'price';
  
  private previousValue: number | null = null;
  private originalBackgroundColor: string = '';
  private animationTimeout: any;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

// Guardar el color original del elemento después de que la vista se haya inicializado  
  ngAfterViewInit() {
    // Guardar color original
    const style = window.getComputedStyle(this.el.nativeElement);
    this.originalBackgroundColor = style.backgroundColor;
  }

  // Detectar cambios en el valor de entrada y aplicar el resaltado
  ngOnChanges(changes: SimpleChanges) {
    if (changes['appHighlightChange'] && !changes['appHighlightChange'].firstChange) {
      const oldValue = changes['appHighlightChange'].previousValue;
      const newValue = changes['appHighlightChange'].currentValue;
      this.previousValue = oldValue;
      
      if (oldValue !== null && newValue !== oldValue) {
        this.highlightChange(newValue, oldValue);
      }
    }
  }

  // Aplicar el resaltado de cambio
  private highlightChange(newValue: number, oldValue: number) {
    const isIncrease = newValue > oldValue;
    
    // Remover clases anteriores
    this.renderer.removeClass(this.el.nativeElement, 'price-up');
    this.renderer.removeClass(this.el.nativeElement, 'price-down');
    
    // Limpiar timeout anterior
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
    
    // Aplicar clase según el cambio
    if (isIncrease) {
      this.renderer.addClass(this.el.nativeElement, 'price-up');
    } else {
      this.renderer.addClass(this.el.nativeElement, 'price-down');
    }
    
    // Remover la clase después de 1 segundo
    this.animationTimeout = setTimeout(() => {
      this.renderer.removeClass(this.el.nativeElement, 'price-up');
      this.renderer.removeClass(this.el.nativeElement, 'price-down');
    }, 1000);
  }

  // Limpiar timeout al destruir la directiva
  ngOnDestroy() {
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
  }
}