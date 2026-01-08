import React from 'react';
// Changed MiraklConfig to MarketplaceConfig as per types.ts
import { MarketplaceConfig } from '../types';
import { Save, Info } from 'lucide-react';

interface ConfigPageProps {
  config: MarketplaceConfig;
  setConfig: React.Dispatch<React.SetStateAction<MarketplaceConfig>>;
}

export const ConfigPage: React.FC<ConfigPageProps> = ({ config, setConfig }) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Configuración del Conector</h2>
        <p className="text-gray-500 mt-2">Define los parámetros para conectar Odoo 18 con Mirakl.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <SettingsIcon className="w-5 h-5 mr-2 text-purple-600" />
            Credenciales de API
          </h3>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Mirakl Shop URL</label>
            <input
              type="text"
              name="baseUrl"
              value={config.baseUrl}
              onChange={handleChange}
              placeholder="https://mirakl-environment.com/api"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Shop ID</label>
            <input
              type="text"
              name="shopId"
              value={config.shopId}
              onChange={handleChange}
              placeholder="2034"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">API Key</label>
            <input
              type="password"
              name="apiKey"
              value={config.apiKey}
              onChange={handleChange}
              placeholder="••••••••••••••••••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
            />
             <p className="text-xs text-gray-400 flex items-center mt-1">
                <Info className="w-3 h-3 mr-1" />
                Esta llave se usará solo para la generación de código y simulación local.
             </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Lógica de Negocio Odoo</h3>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-700">Campo de Enlace Producto</label>
               <select
                  name="productMatchField"
                  value={config.productMatchField}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white"
               >
                 <option value="default_code">Referencia Interna (default_code)</option>
                 <option value="barcode">Código de Barras (barcode)</option>
                 <option value="id">Odoo ID</option>
               </select>
            </div>
            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-700">Diario de Pagos (ID)</label>
               <input
                  type="text"
                  name="paymentJournalId"
                  value={config.paymentJournalId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  placeholder="e.g., Bank or 5"
               />
            </div>
          </div>

          <div className="flex flex-col space-y-4 pt-4 border-t border-gray-100">
             <ToggleItem 
                label="Confirmar Pedidos Automáticamente" 
                desc="Si está activo, los pedidos se pasarán a 'Orden de Venta' al descargarse."
                name="autoConfirm"
                checked={config.autoConfirm}
                onChange={handleChange}
             />
             <ToggleItem 
                label="Crear Facturas y Conciliar" 
                desc="Generar factura borrador y registrar pago si Mirakl envía datos de transacción."
                name="createInvoice"
                checked={config.createInvoice}
                onChange={handleChange}
             />
             <ToggleItem 
                label="Sincronizar Tracking" 
                desc="Enviar número de seguimiento a Mirakl cuando se valide el albarán en Odoo."
                name="syncTracking"
                checked={config.syncTracking}
                onChange={handleChange}
             />
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-md">
            <Save className="w-5 h-5" />
            <span>Guardar Configuración</span>
        </button>
      </div>
    </div>
  );
};

const SettingsIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
);

const ToggleItem = ({ label, desc, name, checked, onChange }: any) => (
  <div className="flex items-start justify-between">
    <div>
      <h4 className="text-sm font-medium text-gray-900">{label}</h4>
      <p className="text-xs text-gray-500">{desc}</p>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" name={name} checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
    </label>
  </div>
);