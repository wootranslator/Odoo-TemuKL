
import React, { useState } from 'react';
import { MarketplaceConfig, Order, OrderStatus, MarketplaceType, EnvironmentMode, CarrierMapping, TaxMapping } from './types';
import { 
  LayoutGrid, ShoppingCart, 
  Save, Plus, ChevronRight, 
  ArrowLeft, Layers, CheckCircle, 
  FileText, ShieldCheck, Lock, 
  Database, Scale, Cpu, Truck, 
  RefreshCw, Download, Filter, 
  MoreHorizontal, AlertCircle, 
  Link, Wifi, Trash2, Tag, 
  Settings2, Box, Globe, ClipboardList,
  FlaskConical, Github, Power,
  CreditCard, Receipt, Wallet, 
  ExternalLink, Code2
} from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'connections' | 'orders'>('connections');
  const [formTab, setFormTab] = useState<'creds' | 'mappings' | 'fiscal'>('creds');
  const [view, setView] = useState<'list' | 'form'>('list');
  const [selectedMarketplace, setSelectedMarketplace] = useState<MarketplaceConfig | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [linkStatus, setLinkStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const [marketplaces, setMarketplaces] = useState<MarketplaceConfig[]>([
    {
      id: '1',
      name: 'Carrefour ES (Mirakl Instance)',
      type: 'mirakl',
      environment: 'production',
      apiKey: 'AK_83729...',
      shopId: 'SH-4421',
      baseUrl: 'https://carrefour-prod.mirakl.net/api',
      paymentJournalId: '12',
      paymentMethodId: 'Marketplace Wallet',
      productMatchField: 'sku',
      shippingProductId: 'ENV_MIRAKL',
      carrierMappings: [{ mirakl_code: 'CORREOS', odoo_delivery_method_id: 'Correos Express 24h' }],
      taxMappings: [{ marketplace_tax_code: '21', odoo_tax_id: 'IVA 21% Soportado' }],
      active: true,
      spanishFiscal: {
        enableSii: true,
        enableVerifactu: true,
        enableFacturae: true,
        enableFace: false,
        defaultTaxType: 'iva',
        fallbackNif: '99999999R',
        autoSimplified: true,
        validateVies: true,
        defaultFiscalPositionId: 'Régimen Nacional'
      }
    }
  ]);

  const [orders] = useState<Order[]>([
    { 
      id: '101', 
      marketplaceId: '1', 
      externalReference: 'CF-2025-001', 
      transactionRef: 'TRX_882937_P', 
      paymentMethod: 'Credit Card (Stripe)',
      customerName: 'Juan Pérez García', 
      nif: '12345678X', 
      date: '2025-06-15', 
      total: 89.90, 
      status: 'ready', 
      paymentStatus: 'paid',
      hasInvoice: true, 
      hasLabel: false 
    },
    { 
      id: '102', 
      marketplaceId: '1', 
      externalReference: 'TM-992384-Z', 
      transactionRef: 'T_PY_9901', 
      paymentMethod: 'Temu Pay',
      customerName: 'Ana Smith', 
      date: '2025-06-16', 
      total: 12.50, 
      status: 'pending', 
      paymentStatus: 'paid',
      hasInvoice: false, 
      hasLabel: true 
    },
  ]);

  const createNew = () => {
    const newMp: MarketplaceConfig = {
      id: '', 
      name: 'Nuevo Marketplace',
      type: 'mirakl',
      environment: 'sandbox',
      baseUrl: 'https://',
      paymentJournalId: '',
      paymentMethodId: 'Manual',
      productMatchField: 'sku',
      shippingProductId: '',
      carrierMappings: [],
      taxMappings: [],
      active: true,
      spanishFiscal: {
        enableSii: true,
        enableVerifactu: true,
        enableFacturae: false,
        enableFace: false,
        defaultTaxType: 'iva',
        fallbackNif: '99999999R',
        autoSimplified: true,
        validateVies: true
      }
    };
    setSelectedMarketplace(newMp);
    setLinkStatus('idle');
    setFormTab('creds');
    setView('form');
  };

  const handleLinkAccount = () => {
    if (!selectedMarketplace) return;
    setIsLinking(true);
    setLinkStatus('idle');
    setTimeout(() => {
      setIsLinking(false);
      setLinkStatus('success');
    }, 1500);
  };

  const saveForm = () => {
    if (!selectedMarketplace) return;
    const isNew = selectedMarketplace.id === '';
    const finalId = isNew ? Math.random().toString(36).substr(2, 9) : selectedMarketplace.id;
    setMarketplaces(prev => {
      if (isNew) return [...prev, { ...selectedMarketplace, id: finalId }];
      return prev.map(m => m.id === selectedMarketplace.id ? selectedMarketplace : m);
    });
    setView('list');
  };

  const isSandbox = selectedMarketplace?.environment === 'sandbox';

  return (
    <div className="flex flex-col h-screen bg-[#F1F4F8] font-sans text-[13px] overflow-hidden">
      {/* Odoo 18 Navbar */}
      <nav className="h-11 bg-[#714B67] text-white flex items-center justify-between px-3 z-50 shadow-md shrink-0">
        <div className="flex items-center space-x-1 h-full">
          <div className="hover:bg-black/10 h-8 w-8 flex items-center justify-center rounded transition-all cursor-pointer">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <div className="font-semibold text-sm tracking-tight px-3 border-r border-white/20 mr-2 ml-1">Marketplace Sync</div>
          <div className="flex items-center h-full space-x-1">
            <button onClick={() => { setActiveTab('connections'); setView('list'); }} className={`px-3 py-1 rounded text-xs transition-all ${activeTab === 'connections' ? 'bg-white/20 font-bold' : 'hover:bg-white/10 opacity-80'}`}>Conexiones</button>
            <button onClick={() => { setActiveTab('orders'); setView('list'); }} className={`px-3 py-1 rounded text-xs transition-all ${activeTab === 'orders' ? 'bg-white/20 font-bold' : 'hover:bg-white/10 opacity-80'}`}>Pedidos</button>
          </div>
        </div>
        <div className="flex items-center space-x-3">
           <button className="flex items-center gap-1.5 bg-[#875A7B] hover:bg-white/20 px-3 py-1 rounded text-[10px] font-bold transition-all border border-white/10">
              <Github className="w-3.5 h-3.5" /> Vincular GitHub
           </button>
          <div className="w-7 h-7 bg-[#4E3447] rounded-full flex items-center justify-center text-[10px] font-bold shadow-inner">OD</div>
        </div>
      </nav>

      {/* Control Panel (Breadcrumbs + Buttons) */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex flex-col md:flex-row md:items-center justify-between z-40 shrink-0 shadow-sm">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center text-[10px] text-gray-400 space-x-1 uppercase tracking-wider font-bold">
            <span className="hover:text-[#714B67] cursor-pointer" onClick={() => setView('list')}>{activeTab === 'connections' ? 'Canales de Venta' : 'Órdenes de Venta'}</span>
            {view === 'form' && <><ChevronRight className="w-2.5 h-2.5 opacity-50" /><span className="text-[#714B67]">{selectedMarketplace?.name}</span></>}
          </div>
          <div className="flex items-center space-x-2 mt-0.5">
            {view === 'list' ? (
              <button onClick={activeTab === 'connections' ? createNew : () => setIsSyncing(true)} className="bg-[#714B67] hover:bg-[#5E3F56] text-white px-4 py-1.5 rounded-md font-semibold text-xs transition-all shadow flex items-center gap-2">
                {activeTab === 'connections' ? <Plus className="w-4 h-4" /> : <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />}
                {activeTab === 'connections' ? 'Nuevo' : 'Sincronizar'}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={saveForm} className="bg-[#714B67] text-white px-4 py-1.5 rounded-md font-semibold text-xs shadow-sm flex items-center gap-2">Guardar</button>
                <button onClick={() => setView('list')} className="bg-white border border-gray-300 text-gray-700 px-4 py-1.5 rounded-md font-semibold text-xs hover:bg-gray-50 transition-all flex items-center gap-2">Descartar</button>
              </div>
            )}
          </div>
        </div>
        
        {view === 'form' && selectedMarketplace && (
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg border border-gray-200 mt-2 md:mt-0">
             <button 
                onClick={() => setSelectedMarketplace({...selectedMarketplace, environment: 'sandbox'})}
                className={`px-3 py-1 rounded text-[9px] font-bold uppercase transition-all ${isSandbox ? 'bg-orange-500 text-white shadow' : 'text-gray-500 hover:text-gray-800'}`}
             >
                <FlaskConical className="w-3 h-3 inline mr-1" /> Sandbox
             </button>
             <button 
                onClick={() => setSelectedMarketplace({...selectedMarketplace, environment: 'production'})}
                className={`px-3 py-1 rounded text-[9px] font-bold uppercase transition-all ${!isSandbox ? 'bg-emerald-600 text-white shadow' : 'text-gray-500 hover:text-gray-800'}`}
             >
                <Power className="w-3 h-3 inline mr-1" /> Prod
             </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 overflow-auto custom-scrollbar transition-all duration-300 ${view === 'form' ? 'bg-white p-6' : 'bg-[#F1F4F8] p-4'}`}>
        {activeTab === 'connections' && view === 'list' && (
          <div className="max-w-6xl mx-auto space-y-4">
             <div className="bg-white rounded-lg border border-gray-200 overflow-hidden odoo-sheet">
                <table className="w-full text-left text-xs">
                   <thead>
                      <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                         <th className="px-6 py-3">Referencia</th>
                         <th className="px-6 py-3">Plataforma</th>
                         <th className="px-6 py-3">Modo</th>
                         <th className="px-6 py-3">Estado</th>
                         <th className="px-6 py-3 text-right">Shop ID</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {marketplaces.map(mp => (
                        <tr key={mp.id} onClick={() => { setSelectedMarketplace(mp); setView('form'); }} className="hover:bg-blue-50/50 cursor-pointer transition-colors group">
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                 <div className={`w-8 h-8 rounded flex items-center justify-center ${mp.type === 'temu' ? 'bg-orange-100 text-orange-600' : 'bg-[#714B67]/10 text-[#714B67]'}`}>
                                    {mp.type === 'temu' ? <Cpu className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                                 </div>
                                 <span className="font-bold text-gray-900">{mp.name}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4 uppercase font-bold text-[10px] text-gray-400">{mp.type} System</td>
                           <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${mp.environment === 'sandbox' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                 {mp.environment}
                              </span>
                           </td>
                           <td className="px-6 py-4"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Activo</span></td>
                           <td className="px-6 py-4 text-right font-mono text-gray-500">{mp.shopId || '--'}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'connections' && view === 'form' && selectedMarketplace && (
          <div className="max-w-5xl mx-auto odoo-sheet bg-white rounded shadow-lg border border-gray-200 mb-10">
             {/* Odoo Native Form Header */}
             <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                <div className="space-y-1">
                   <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{selectedMarketplace.name || 'Nuevo Marketplace'}</h1>
                   <div className="flex gap-2">
                      <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-gray-200">Localización ES</span>
                      {isSandbox && <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-orange-200 animate-pulse">Entorno Sandbox</span>}
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <button className="flex items-center gap-2 text-[#714B67] hover:bg-[#714B67]/5 px-3 py-1.5 rounded transition-all">
                      <Code2 className="w-4 h-4" /> Ver XML Heredado
                   </button>
                </div>
             </div>

             {/* Form Tabs */}
             <div className="flex bg-gray-50/50 border-b border-gray-100 overflow-x-auto">
                <button onClick={() => setFormTab('creds')} className={`px-8 py-3 text-[11px] font-bold uppercase tracking-wider transition-all border-b-2 ${formTab === 'creds' ? 'border-[#714B67] text-[#714B67] bg-white' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Conexión API</button>
                <button onClick={() => setFormTab('mappings')} className={`px-8 py-3 text-[11px] font-bold uppercase tracking-wider transition-all border-b-2 ${formTab === 'mappings' ? 'border-[#714B67] text-[#714B67] bg-white' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Mapeos Odoo</button>
                <button onClick={() => setFormTab('fiscal')} className={`px-8 py-3 text-[11px] font-bold uppercase tracking-wider transition-all border-b-2 ${formTab === 'fiscal' ? 'border-[#714B67] text-[#714B67] bg-white' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Localización / SII</button>
             </div>

             <div className="p-10">
                {formTab === 'creds' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                     <div className="space-y-8">
                        <SectionHeader title="Parámetros de Acceso" />
                        <div className="space-y-5">
                           <FormField label="Plataforma de Mercado">
                              <select className="odoo-input" value={selectedMarketplace.type} onChange={e => setSelectedMarketplace({...selectedMarketplace, type: e.target.value as any})}>
                                 <option value="mirakl">Mirakl Marketplace (Generic)</option>
                                 <option value="temu">Temu Partner API</option>
                              </select>
                           </FormField>
                           <FormField label="API Base URL (Endpoint)">
                              <input className="odoo-input" value={isSandbox ? selectedMarketplace.testBaseUrl : selectedMarketplace.baseUrl} placeholder="https://..." />
                           </FormField>
                           <div className="grid grid-cols-2 gap-4">
                              <FormField label="Shop ID / App Key"><input className="odoo-input" value={isSandbox ? selectedMarketplace.testShopId : selectedMarketplace.shopId} /></FormField>
                              <FormField label="API Secret Key"><input type="password" className="odoo-input" value={isSandbox ? selectedMarketplace.testApiKey : selectedMarketplace.apiKey} /></FormField>
                           </div>
                        </div>
                     </div>
                     <div className="bg-[#F8F9FA] rounded-xl p-8 border border-gray-100 flex flex-col justify-center items-center text-center space-y-6">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${linkStatus === 'success' ? 'bg-emerald-600 shadow-lg shadow-emerald-100' : 'bg-white border-2 border-dashed border-gray-300'}`}>
                           {isLinking ? <RefreshCw className="w-8 h-8 animate-spin text-[#714B67]" /> : linkStatus === 'success' ? <CheckCircle className="w-9 h-9 text-white" /> : <Wifi className="w-8 h-8 text-gray-200" />}
                        </div>
                        <div className="space-y-1">
                           <p className="font-bold text-gray-900 uppercase text-[11px]">Validación de Vínculo</p>
                           <p className="text-[10px] text-gray-400 max-w-xs leading-relaxed">Se realizará un ping al endpoint para validar que las cabeceras de autorización son correctas en Odoo.</p>
                        </div>
                        <button onClick={handleLinkAccount} disabled={isLinking} className="w-full bg-white border border-gray-200 hover:border-[#714B67] py-2.5 rounded-md font-bold text-[10px] uppercase tracking-widest transition-all">Test de Conexión</button>
                     </div>
                  </div>
                )}

                {formTab === 'mappings' && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-12">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div className="space-y-6">
                           <SectionHeader title="Mapeo Logístico" />
                           <div className="space-y-2">
                              {selectedMarketplace.carrierMappings.map((m, i) => (
                                 <div key={i} className="flex gap-2 items-end bg-gray-50 p-3 rounded-lg border border-gray-100 group">
                                    <div className="flex-1">
                                       <label className="text-[9px] font-bold text-gray-400 uppercase">Cód. Marketplace</label>
                                       <input className="odoo-input-sm" value={m.mirakl_code} />
                                    </div>
                                    <div className="flex-1">
                                       <label className="text-[9px] font-bold text-gray-400 uppercase">Método de Odoo</label>
                                       <input className="odoo-input-sm" value={m.odoo_delivery_method_id} />
                                    </div>
                                    <button className="p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                                 </div>
                              ))}
                              <button className="w-full py-2 bg-white border-2 border-dashed border-gray-100 text-[10px] font-bold text-gray-400 uppercase hover:text-[#714B67] hover:border-[#714B67] transition-all rounded-lg"><Plus className="w-3 h-3 inline mr-1" /> Añadir Transportista</button>
                           </div>
                        </div>
                        <div className="space-y-6">
                           <SectionHeader title="Parámetros de Venta" />
                           <div className="space-y-5 bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                              <FormField label="Identificación de Producto">
                                 <select className="odoo-input" value={selectedMarketplace.productMatchField}>
                                    <option value="sku">Referencia Interna (default_code)</option>
                                    <option value="ean">EAN / Código de Barras (barcode)</option>
                                    <option value="id">ID Interno Odoo</option>
                                 </select>
                              </FormField>
                              <FormField label="Costes de Envío (Producto)">
                                 <input className="odoo-input" value={selectedMarketplace.shippingProductId} placeholder="PORTES_MK" />
                              </FormField>
                           </div>
                        </div>
                     </div>
                  </div>
                )}

                {formTab === 'fiscal' && (
                  <div className="animate-in fade-in slide-in-from-left-4 duration-300 space-y-12">
                     <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                        <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center justify-between">
                           <SectionHeader title="Configuración de Tesorería y SII" />
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                           <div className="space-y-6">
                              <FormField label="Diario de Cobros (Odoo Journal)">
                                 <input className="odoo-input" value={selectedMarketplace.paymentJournalId} placeholder="Elegir Diario Contable..." />
                              </FormField>
                              <div className="pt-2">
                                 <ToggleItem label="Conciliación Automática" desc="Marcar como pagado al recibir Ref. de Transacción." checked={true} />
                                 <div className="mt-4">
                                    <ToggleItem label="Informar SII AEAT" desc="Registrar facturas automáticamente en la AEAT." checked={selectedMarketplace.spanishFiscal.enableSii} />
                                 </div>
                              </div>
                           </div>
                           <div className="space-y-6">
                              <FormField label="NIF Genérico (Ventas Simplificadas)">
                                 <input className="odoo-input" value={selectedMarketplace.spanishFiscal.fallbackNif} placeholder="99999999R" />
                              </FormField>
                              <div className="pt-2">
                                 <ToggleItem label="Generar Factura Borrador" desc="Crear factura al confirmar la Orden de Venta." checked={true} />
                                 <div className="mt-4">
                                    <ToggleItem label="Verifactu Activo" desc="Certificación de integridad tributaria Odoo 18." checked={selectedMarketplace.spanishFiscal.enableVerifactu} />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                )}
             </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="max-w-[1500px] mx-auto space-y-6">
             <div className="flex justify-between items-center bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-6 divide-x divide-gray-100">
                   <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Sincronizado</p>
                      <p className="text-2xl font-bold text-gray-900 tracking-tight">2.430,45 €</p>
                   </div>
                   <div className="pl-6">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pendientes</p>
                      <p className="text-2xl font-bold text-orange-500 tracking-tight">12</p>
                   </div>
                   <div className="pl-6">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fallos Conciliación</p>
                      <p className="text-2xl font-bold text-red-500 tracking-tight">0</p>
                   </div>
                </div>
                <div className="flex gap-2">
                   <button className="btn-secondary"><Filter className="w-3.5 h-3.5" /> Agrupar</button>
                   <button className="btn-secondary"><Download className="w-3.5 h-3.5" /> Descargar</button>
                </div>
             </div>

             <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                   <thead>
                      <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                         <th className="px-8 py-4">Ref. Marketplace</th>
                         <th className="px-8 py-4">Transacción / Pago</th>
                         <th className="px-8 py-4">Cliente / NIF</th>
                         <th className="px-8 py-4 text-right">Total Pedido</th>
                         <th className="px-8 py-4 text-center">Estado Contable</th>
                         <th className="px-8 py-4 text-center">Odoo</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                      {orders.map(o => (
                        <tr key={o.id} className="hover:bg-blue-50/50 transition-colors cursor-pointer">
                           <td className="px-8 py-5 font-bold text-[#714B67]">{o.externalReference}</td>
                           <td className="px-8 py-5">
                              <div className="flex items-center gap-2">
                                 <Wallet className="w-3.5 h-3.5 text-gray-400" />
                                 <div>
                                    <p className="font-bold text-gray-800">{o.transactionRef}</p>
                                    <p className="text-[9px] text-gray-400 uppercase">{o.paymentMethod}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-5">
                              <p className="font-bold text-gray-700">{o.customerName}</p>
                              <p className="text-[9px] text-gray-400 font-bold tracking-widest">{o.nif || 'CONSUMIDOR FINAL'}</p>
                           </td>
                           <td className="px-8 py-5 text-right font-bold text-sm text-gray-900">{o.total.toFixed(2)} €</td>
                           <td className="px-8 py-5 text-center">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${o.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                 {o.paymentStatus === 'paid' ? 'Conciliado' : 'Pendiente'}
                              </span>
                           </td>
                           <td className="px-8 py-5 text-center flex justify-center gap-1.5">
                              <button className="p-2 text-gray-400 hover:text-[#714B67] hover:bg-white rounded transition-all"><ExternalLink className="w-4 h-4" /></button>
                              <button className="p-2 text-gray-400 hover:text-[#714B67] hover:bg-white rounded transition-all"><FileText className="w-4 h-4" /></button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}
      </div>

      <style>{`
        .odoo-sheet {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .odoo-input {
          width: 100%;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          padding: 6px 10px;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          background: #fff;
        }
        .odoo-input:focus {
          border-color: #875A7B;
          box-shadow: 0 0 0 0.2rem rgba(113, 75, 103, 0.25);
        }
        .odoo-input-sm {
          width: 100%;
          border: 1px solid #e9ecef;
          border-radius: 3px;
          padding: 4px 8px;
          font-size: 11px;
          font-weight: 600;
          outline: none;
          background: white;
        }
        .btn-secondary {
          background: white;
          border: 1px solid #ced4da;
          color: #495057;
          padding: 6px 12px;
          border-radius: 4px;
          font-weight: 700;
          font-size: 11px;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .btn-secondary:hover {
          background: #f8f9fa;
          border-color: #adb5bd;
        }
      `}</style>
    </div>
  );
};

const SectionHeader = ({ title }: any) => (
  <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2">{title}</h3>
);

const FormField = ({ label, children }: any) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">{label}</label>
    {children}
  </div>
);

const ToggleItem = ({ label, desc, checked }: any) => (
  <div className="flex items-center justify-between gap-6 group">
    <div className="flex-1">
      <div className="text-[11px] font-bold text-gray-700 uppercase">{label}</div>
      <div className="text-[10px] text-gray-400 mt-0.5">{desc}</div>
    </div>
    <div className={`w-9 h-4.5 rounded-full relative transition-all cursor-pointer ${checked ? 'bg-[#714B67]' : 'bg-gray-200'}`}>
       <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${checked ? 'left-5' : 'left-0.5'}`}></div>
    </div>
  </div>
);

export default App;
