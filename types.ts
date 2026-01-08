

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
  // Nuevos campos para deduplicación
  deduplicatePartners?: boolean;
  partnerMatchField?: 'vat' | 'email' | 'ref';
  updatePartnerData?: boolean;
  defaultCompanyId?: string;
}

export interface GeneratedFile {
  name: string;
  path: string;
  language: string;
  content: string;
}

export interface FiscalConfig {
  enableOss: boolean;
  validateVies: boolean;
  defaultFiscalPositionId: string;
}

// Added AppStatus enum to fix export error in GeneratorPage.tsx
export enum AppStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

// Added SimulationStep interface to fix export error in SimulatorPage.tsx
export interface SimulationStep {
  id: number;
  title: string;
  status: 'pending' | 'success' | 'error';
  details: string;
}
