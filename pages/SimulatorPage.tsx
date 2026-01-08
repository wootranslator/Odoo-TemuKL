import React, { useState } from 'react';
// Changed MiraklConfig to MarketplaceConfig as per types.ts
import { MarketplaceConfig, SimulationStep } from '../types';
import { ArrowRight, CheckCircle2, Circle, RefreshCw } from 'lucide-react';

interface SimulatorPageProps {
  config: MarketplaceConfig;
}

export const SimulatorPage: React.FC<SimulatorPageProps> = ({ config }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [steps, setSteps] = useState<SimulationStep[]>([
    { id: 1, title: 'Conexión API Mirakl', status: 'pending', details: 'GET /api/orders?status=SHIPPING' },
    { id: 2, title: 'Mapeo de Productos', status: 'pending', details: `Búsqueda por ${config.productMatchField}` },
    { id: 3, title: 'Creación Cliente', status: 'pending', details: 'Crear/Actualizar res.partner' },
    { id: 4, title: 'Generación Pedido', status: 'pending', details: config.autoConfirm ? 'Estado: Venta' : 'Estado: Presupuesto' },
    { id: 5, title: 'Conciliación Pago', status: 'pending', details: config.createInvoice ? 'Factura + Pago' : 'Omitido' }
  ]);

  const runSimulation = () => {
    setIsSimulating(true);
    setLogs([]);
    const newSteps = steps.map(s => ({ ...s, status: 'pending' as const }));
    setSteps(newSteps);

    let stepIndex = 0;

    const interval = setInterval(() => {
      if (stepIndex >= steps.length) {
        clearInterval(interval);
        setIsSimulating(false);
        addLog("✅ Simulación completada con éxito.");
        return;
      }

      const currentStep = steps[stepIndex];
      addLog(`[INFO] Ejecutando: ${currentStep.title}...`);
      
      setSteps(prev => prev.map((s, idx) => 
        idx === stepIndex ? { ...s, status: 'success' } : s
      ));

      if (currentStep.id === 2) {
         addLog(`[DEBUG] Producto encontrado: [REF-001] Wireless Headphones -> Odoo ID: 42`);
      }
      if (currentStep.id === 4) {
         addLog(`[SUCCESS] Sale Order SO00123 creada. Total: 159.99 €`);
      }

      stepIndex++;
    }, 1500);
  };

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      
      {/* Visual Process Flow */}
      <div className="space-y-6">
        <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Simulador de Integración</h2>
            <p className="text-gray-500 mt-2">Visualiza el flujo de datos sin conectar a Odoo real.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-8 relative">
                {/* Vertical Line */}
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-100 -z-10"></div>

                {steps.map((step) => (
                    <div key={step.id} className="flex items-start space-x-4">
                        <div className={`mt-1 bg-white p-1 rounded-full border-2 ${
                            step.status === 'success' ? 'border-green-500' : 
                            step.status === 'error' ? 'border-red-500' : 'border-gray-200'
                        }`}>
                            {step.status === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : 
                             step.status === 'error' ? <Circle className="w-5 h-5 text-red-500" /> :
                             <Circle className="w-5 h-5 text-gray-300" />}
                        </div>
                        <div className="flex-1">
                            <h4 className={`font-semibold ${step.status === 'pending' ? 'text-gray-400' : 'text-gray-800'}`}>
                                {step.title}
                            </h4>
                            <p className="text-sm text-gray-500 font-mono mt-1">{step.details}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            <button 
                onClick={runSimulation}
                disabled={isSimulating}
                className="mt-8 w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex justify-center items-center gap-2"
            >
                {isSimulating ? <RefreshCw className="w-5 h-5 animate-spin"/> : <ArrowRight className="w-5 h-5"/>}
                {isSimulating ? 'Procesando...' : 'Iniciar Simulación'}
            </button>
        </div>
      </div>

      {/* Terminal / Logs */}
      <div className="bg-[#1e1e1e] rounded-xl shadow-lg overflow-hidden flex flex-col h-[600px]">
        <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-gray-700">
            <span className="text-xs text-gray-400 font-mono">odoo-server-log</span>
            <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
        </div>
        <div className="p-4 font-mono text-xs text-green-400 space-y-2 overflow-y-auto flex-1 custom-scrollbar">
            <p className="text-gray-500"># Waiting for job execution...</p>
            {logs.map((log, i) => (
                <p key={i} className="break-words">{log}</p>
            ))}
            {isSimulating && (
                <span className="inline-block w-2 h-4 bg-green-500 animate-pulse"></span>
            )}
        </div>
      </div>

    </div>
  );
};