// <!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->
// <!-- Nombre del Proyecto: Monitoreo de Criptomonedas --> 
// <!-- Descripción: Aplicación web para monitorear precios de criptomonedas en tiempo real. -->
// <!-- Desarrollador: Marinelly Rodriguez C.I.: 9826256 -->
// <!-- Unidad Curricular Programación III - Modulo 1 -->
// <!-- Sección Didactica 4 -->
// <!-- Sección 6A-6B -->  
// <!-- Fecha de Desarrollo: Febrero 2026 -->
// <!-- Nombre del archivo: calculations.worker.ts -->
// <!-- Página Principal de los cálculos de Web Workers -->
// <!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->

/// <reference lib="webworker" />

// Configuración del worker
addEventListener('message', ({ data }) => {
  switch (data.type) {
    case 'CALCULATE_MOVING_AVERAGE':
      const maResult = calculateMovingAverage(data.payload.prices, data.payload.period);
      postMessage({
        type: 'MOVING_AVERAGE_RESULT',
        payload: {
          symbol: data.payload.symbol,
          value: maResult,
          period: data.payload.period
        }
      });
      break;

    // Cálculo de volatilidad usando la desviación estándar de los precios  
    case 'CALCULATE_VOLATILITY':
      const volResult = calculateVolatility(data.payload.prices);
      postMessage({
        type: 'VOLATILITY_RESULT',
        payload: {
          symbol: data.payload.symbol,
          value: volResult,
          period: 20 // último período
        }
      });
      break;

    // Cálculo del RSI (Relative Strength Index) para evaluar la fuerza de la tendencia  
    case 'CALCULATE_ALL':
      const allResults = {
        movingAverage: calculateMovingAverage(data.payload.prices, 10),
        volatility: calculateVolatility(data.payload.prices),
        rsi: calculateRSI(data.payload.prices, 14)
      };
      postMessage({
        type: 'ALL_CALCULATIONS_RESULT',
        payload: {
          symbol: data.payload.symbol,
          ...allResults
        }
      });
      break;
  }
});

// Funciones de cálculo
function calculateMovingAverage(prices: number[], period: number): number {
  if (prices.length < period) return 0;
  const slice = prices.slice(-period);
  const sum = slice.reduce((a, b) => a + b, 0);
  return sum / period;
}

// Funciones de cálculo de volatilidad usando la desviación estándar de los precios
function calculateVolatility(prices: number[], period: number = 20): number {
  if (prices.length < period) return 0;
  const slice = prices.slice(-period);
  const mean = slice.reduce((a, b) => a + b, 0) / slice.length;
  const squaredDiffs = slice.map(price => Math.pow(price - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / slice.length;
  return Math.sqrt(variance);
}

// Función de cálculo del RSI (Relative Strength Index) para evaluar la fuerza de la tendencia
function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 50;
  
  let gains = 0;
  let losses = 0;
  
  for (let i = 1; i <= period; i++) {
    const difference = prices[prices.length - i] - prices[prices.length - i - 1];
    if (difference >= 0) {
      gains += difference;
    } else {
      losses += Math.abs(difference);
    }
  }
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  
  if (avgLoss === 0) return 100;
  
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}