
export type MarketplaceType = 'mirakl' | 'temu';
export type EnvironmentMode = 'production' | 'sandbox';

export interface CarrierMapping {
  mirakl_code: string;
  odoo_delivery_method_id: string;
}

export interface TaxMapping {
  marketplace_tax_code: string;
  odoo_tax_id: string;
}

export interface SpanishFiscalConfig {
  enableSii: boolean;
  enableVerifactu: boolean;
  enableFacturae: boolean;
  enableFace: boolean;
  defaultTaxType: 'iva' | 'iva_re';
  fallbackNif?: string; 
  autoSimplified?: boolean;
  validateVies: boolean;
  defaultFiscalPositionId?: string;
}

export interface MarketplaceConfig {
  id: string;
  name: string;
  type: MarketplaceType;
  environment: EnvironmentMode;
  apiKey?: string;
  shopId?: string;
  appKey?: string;
  appSecret?: string;
  baseUrl: string;
  // Test credentials
  testApiKey?: string;
  testBaseUrl?: string;
  testShopId?: string;
  
  paymentJournalId: string;
  paymentMethodId: string;
  carrierMappings: CarrierMapping[];
  taxMappings: TaxMapping[];
  shippingProductId: string;
  productMatchField: 'sku' | 'ean' | 'default_code' | 'barcode' | 'id';
  active: boolean;
  spanishFiscal: SpanishFiscalConfig;
  autoConfirm?: boolean;
  createInvoice?: boolean;
  syncTracking?: boolean;
}

export type OrderStatus = 'pending' | 'ready' | 'shipped' | 'cancelled';

export interface Order {
  id: string;
  marketplaceId: string;
  externalReference: string;
  transactionRef: string; // Nuevo: Referencia de transacción de pago
  paymentMethod: string;  // Nuevo: Método de pago detectado
  customerName: string;
  nif?: string;
  date: string;
  total: number;
  status: OrderStatus;
  paymentStatus: 'paid' | 'pending'; // Nuevo: Estado financiero
  hasInvoice: boolean;
  hasLabel: boolean;
}

export interface FiscalConfig {
  enableOss: boolean;
  validateVies: boolean;
  defaultFiscalPositionId: string;
}

export interface GeneratedFile {
  name: string;
  path: string;
  language: string;
  content: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface SimulationStep {
  id: number;
  title: string;
  status: 'pending' | 'success' | 'error';
  details: string;
}
