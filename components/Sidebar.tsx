import React from 'react';
import { LayoutDashboard, Settings, Code, PlayCircle, FolderGit2 } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    { id: 'config', label: 'Configuración', icon: Settings },
    { id: 'generator', label: 'Generador Código', icon: Code },
    { id: 'simulator', label: 'Simulador', icon: PlayCircle },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 shadow-xl">
      <div className="p-6 flex items-center space-x-3 border-b border-slate-700">
        <FolderGit2 className="w-8 h-8 text-purple-400" />
        <h1 className="text-xl font-bold tracking-tight">Odoo<span className="text-purple-400">Builder</span></h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-800 rounded-lg p-3">
          <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Target Version</p>
          <p className="text-sm text-white font-mono">Odoo 18.0 Enterprise</p>
        </div>
      </div>
    </div>
  );
};