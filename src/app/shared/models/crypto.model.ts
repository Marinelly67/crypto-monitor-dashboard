export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  previousPrice: number;
  changePercent: number;
  changeAmount: number;
  marketCap: number;
  volume24h: number;
  lastUpdated: Date;
  priceHistory: number[];
  color: string;
}

export interface AlertThreshold {
  id: string;
  symbol: string;
  threshold: number;
  type: 'above' | 'below';
  isActive: boolean;
}

export interface PriceUpdate {
  symbol: string;
  price: number;
  timestamp: Date;
}

export interface MovingAverageResult {
  symbol: string;
  value: number;
  period: number;
}

export interface VolatilityResult {
  symbol: string;
  value: number;
  period: number;
}