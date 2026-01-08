
import React, { useState } from 'react';
import { MarketplaceConfig } from './types';
import { 
  Settings, ShoppingBag, Zap, Save, 
  ChevronRight, Search, LayoutGrid, User, Bell, 
  HelpCircle, Database, Receipt,
  Users, UserCheck, ShieldAlert, Layers, Lock, Truck
} from 'lucide-react';

const App: React.FC = () => {
  const [activeSetting, setActiveSetting] = useState('temukl');

  const [config, setConfig] = useState<MarketplaceConfig>({
    id: '1',
    name: 'Temu Spain Connector',
    type: 'temu',
    environment: 'production',
    apiKey: 'MK_PRD_83729_KL',
    shopId: 'ES-BARCELONA-LED',
    baseUrl: 'https://api.temu.com/v1',
    paymentJournalId: 'Banco Sabadell',
    paymentMethodId: 'Temu Payment Service',
    productMatchField: 'sku',
    shippingProductId: 'Envío Marketplace',
    carrierMappings: [],
    taxMappings: [],
    active: true,
    autoConfirm: true,
    createInvoice: true,
    syncTracking: true,
    deduplicatePartners: true,
    partnerMatchField: 'vat',
    updatePartnerData: true,
    spanishFiscal: { 
      enableSii: true, 
      enableVerifactu: true, 
      enableFacturae: false, 
      enableFace: false, 
      defaultTaxType: 'iva', 
      validateVies: true 
    }
  });

  const handleToggle = (key: keyof MarketplaceConfig) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex h-screen bg-[#f1f4f8] font-sans text-gray-800 overflow-hidden selection:bg-[#714B67]/20">
      {/* Odoo 18 Top Navbar */}
      <div className="absolute top-0 left-0 right-0 h-11 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-[#714B67] p-1.5 rounded text-white cursor-pointer hover:bg-[#5E3F56] transition-colors">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1 text-sm font-medium">
            <span className="text-gray-500 cursor-pointer hover:text-gray-700">Ajustes</span>
            <ChevronRight className="w-3 h-3 text-gray-300" />
            <span className="text-gray-900 font-bold">TemuKL Bridge Config</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-[#714B67]" />
            <input type="text" placeholder="Buscar ajustes..." className="bg-gray-100 border-none rounded-md py-1.5 pl-8 pr-3 text-xs w-64 focus:ring-1 focus:ring-[#714B67] outline-none transition-all" />
          </div>
          <div className="flex items-center gap-4 text-gray-500 border-l border-gray-200 pl-4">
            <Bell className="w-4 h-4 cursor-pointer hover:text-gray-700 transition-colors" />
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-7 h-7 bg-[#714B67] rounded-full flex items-center justify-center text-white text-[10px] font-bold">AD</div>
              <span className="text-xs font-bold text-gray-700 group-hover:text-black">Administrador</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Mockup */}
      <aside className="w-[240px] bg-white border-r border-gray-200 pt-11 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
        <div className="p-3">
          <div className="flex gap-2 mb-6">
            <button className="flex-1 bg-[#714B67] hover:bg-[#5E3F56] text-white py-1.5 px-3 rounded text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-sm">
              <Save className="w-3.5 h-3.5" /> Guardar
            </button>
            <button className="px-3 py-1.5 border border-gray-200 rounded text-sm font-medium hover:bg-gray-50 text-gray-600 transition-colors">
              Descartar
            </button>
          </div>
          
          <nav className="space-y-0.5">
            <SidebarItem active={activeSetting === 'gen'} onClick={() => setActiveSetting('gen')} icon={<Settings className="w-4 h-4 text-gray-400" />} label="Opciones generales" />
            <SidebarItem active={activeSetting === 'usuarios'} onClick={() => setActiveSetting('usuarios')} icon={<User className="w-4 h-4 text-emerald-500" />} label="Usuarios y compañías" />
            <SidebarItem active={activeSetting === 'temukl'} onClick={() => setActiveSetting('temukl')} icon={<Zap className="w-4 h-4 text-purple-600" />} label="TemuKL Bridge" />
            <div className="h-px bg-gray-100 my-2 mx-2"></div>
            <SidebarItem active={activeSetting === 'ventas'} onClick={() => setActiveSetting('ventas')} icon={<ShoppingBag className="w-4 h-4 text-orange-500" />} label="Ventas" />
            <SidebarItem active={activeSetting === 'inventario'} onClick={() => setActiveSetting('inventario')} icon={<Truck className="w-4 h-4 text-purple-400" />} label="Inventario" />
            <SidebarItem active={activeSetting === 'conta'} onClick={() => setActiveSetting('conta')} icon={<Receipt className="w-4 h-4 text-blue-500" />} label="Contabilidad" />
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 mt-11 overflow-y-auto custom-scrollbar bg-white">
        <div className="p-10 max-w-6xl mx-auto space-y-12 pb-24">
          {/* Header with Smart Buttons */}
          <div className="flex justify-between items-start border-b border-gray-100 pb-8">
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">TemuKL Bridge - Configuración</h1>
              <p className="text-gray-500 mt-2 text-sm leading-relaxed max-w-2xl">
                Configura la lógica de negocio para la sincronización de pedidos desde Marketplaces (Mirakl, Temu) hacia Odoo 18.
              </p>
            </div>
            <div className="flex gap-3">
              <SmartButton label="Contactos Vinculados" count="1.2k" icon={<Users className="w-4 h-4" />} />
              <SmartButton label="Transacciones OK" count="98%" icon={<Check className="w-4 h-4" />} color="text-emerald-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-14">
            {/* Sección de Identificación de Contactos */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg"><UserCheck className="w-5 h-5 text-emerald-600" /></div>
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Identificación y Deduplicación</h2>
              </div>
              
              <div className="bg-gray-50/50 rounded-xl p-8 border border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16"></div>
                
                <div className="space-y-8">
                  <OdooToggle 
                    label="Activar Deduplicación Inteligente" 
                    desc="Busca clientes existentes para evitar duplicados en la base de datos." 
                    checked={config.deduplicatePartners}
                    onToggle={() => handleToggle('deduplicatePartners')}
                  />
                  
                  <OdooToggle 
                    label="Actualizar Ficha de Cliente" 
                    desc="Si el contacto existe, actualiza su dirección y teléfono con los datos del pedido." 
                    checked={config.updatePartnerData}
                    onToggle={() => handleToggle('updatePartnerData')}
                  />
                </div>

                <div className="space-y-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Identificador Principal</label>
                     <select className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm font-medium outline-none focus:ring-1 focus:ring-[#714B67] shadow-sm">
                        <option value="vat">NIF / CIF (Campo VAT)</option>
                        <option value="email">Correo Electrónico</option>
                        <option value="ref">Referencia Externa</option>
                     </select>
                     <p className="text-[10px] text-gray-400 italic">Recomendado para contabilidad española: NIF/CIF.</p>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Empresa por defecto</label>
                     <div className="flex items-center gap-2 bg-white border border-gray-200 rounded px-3 py-2 text-sm font-medium text-gray-600 shadow-sm">
                        <Database className="w-3.5 h-3.5 opacity-40" /> Barcelona LED Iluminación S.L
                     </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Credenciales y API */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg"><Lock className="w-5 h-5 text-purple-600" /></div>
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Configuración de API</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <SettingField label="Marketplace URL" value={config.baseUrl} />
                 <SettingField label="Shop ID" value={config.shopId} />
                 <div className="md:col-span-2">
                   <SettingField label="API Key" value="••••••••••••••••••••••••••••" secret />
                 </div>
              </div>
            </section>

            {/* Automatización Odoo */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-lg"><Layers className="w-5 h-5 text-orange-600" /></div>
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Automatización y Flujo</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                 <OdooToggle 
                    label="Confirmar Pedidos" 
                    desc="Validar automáticamente el pedido de venta al importarse." 
                    checked={config.autoConfirm}
                    onToggle={() => handleToggle('autoConfirm')}
                 />
                 <OdooToggle 
                    label="Factura y Pago" 
                    desc="Generar factura borrador y registrar el cobro automáticamente." 
                    checked={config.createInvoice}
                    onToggle={() => handleToggle('createInvoice')}
                 />
                 <OdooToggle 
                    label="Sincronización de Tracking" 
                    desc="Enviar el número de seguimiento al marketplace al validar el albarán." 
                    checked={config.syncTracking}
                    onToggle={() => handleToggle('syncTracking')}
                 />
                 <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Diario de Cobros</label>
                     <select className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm font-medium outline-none focus:ring-1 focus:ring-[#714B67] shadow-sm">
                        <option>Banco Sabadell (Marketplace)</option>
                        <option>Efectivo</option>
                        <option>Pasarela Temu Pay</option>
                     </select>
                 </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }
      `}</style>
    </div>
  );
};

const SidebarItem = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-all ${active ? 'bg-[#f1f4f8] text-[#714B67] font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
  >
    <div className={`p-1 rounded ${active ? 'bg-white shadow-sm' : ''}`}>
      {icon}
    </div>
    <span className="truncate">{label}</span>
  </button>
);

const SmartButton = ({ label, count, icon, color }: any) => (
  <div className="flex items-center gap-3 border border-gray-200 bg-white px-5 py-2.5 rounded-xl hover:shadow-md transition-all group min-w-[200px]">
    <div className={`p-2 rounded-lg bg-gray-50 text-gray-400 group-hover:scale-110 group-hover:bg-white transition-all ${color || ''}`}>{icon}</div>
    <div className="text-left">
      <div className={`text-lg font-black leading-none ${color || 'text-gray-900'}`}>{count}</div>
      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{label}</div>
    </div>
  </div>
);

const SettingField = ({ label, value, secret }: any) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
    <div className="relative group">
      <input 
        type={secret ? 'password' : 'text'} 
        defaultValue={value} 
        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:ring-1 focus:ring-[#714B67] shadow-sm transition-all"
      />
      <div className="absolute right-3 top-3 text-[8px] font-bold text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">EDITABLE</div>
    </div>
  </div>
);

const OdooToggle = ({ label, desc, checked, onToggle }: any) => (
  <div className="flex items-start gap-4 cursor-pointer select-none group" onClick={onToggle}>
    <div className="relative inline-flex items-center mt-1">
      <div className={`w-10 h-5 rounded-full transition-all flex items-center px-0.5 ${checked ? 'bg-[#714B67]' : 'bg-gray-200'}`}>
        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}></div>
      </div>
    </div>
    <div className="flex-1">
      <h4 className="text-[13px] font-black text-gray-800 group-hover:text-[#714B67] transition-colors">{label}</h4>
      <p className="text-[11px] text-gray-500 font-medium leading-tight mt-1">{desc}</p>
    </div>
  </div>
);

const Check = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

export default App;
