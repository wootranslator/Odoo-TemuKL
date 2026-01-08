import React, { useState } from 'react';
// Changed MiraklConfig to MarketplaceConfig as per types.ts
import { MarketplaceConfig, GeneratedFile, AppStatus } from '../types';
// Updated import to match exported function name in geminiService
import { generateOdooModuleCode } from '../services/geminiService';
import { CodeBlock } from '../components/CodeBlock';
import { Loader2, Zap, FileCode, AlertCircle } from 'lucide-react';

interface GeneratorPageProps {
  config: MarketplaceConfig;
}

export const GeneratorPage: React.FC<GeneratorPageProps> = ({ config }) => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleGenerate = async () => {
    setStatus(AppStatus.GENERATING);
    setErrorMsg("");
    try {
      // Corrected function call to generateOdooModuleCode with required array and fiscal config
      const generatedFiles = await generateOdooModuleCode([config], {
        enableOss: true,
        validateVies: true,
        defaultFiscalPositionId: 'Regimen Nacional'
      });
      setFiles(generatedFiles);
      setStatus(AppStatus.COMPLETED);
    } catch (e: any) {
      setErrorMsg(e.message || "Error generating code");
      setStatus(AppStatus.ERROR);
    }
  };

  return (
    <div className="flex flex-col h-full p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
           <h2 className="text-3xl font-bold text-gray-800">Generador de Módulo Odoo</h2>
           <p className="text-gray-500 mt-2">Utiliza Gemini AI para crear la estructura completa del módulo basada en tu configuración.</p>
        </div>
        
        <button
          onClick={handleGenerate}
          disabled={status === AppStatus.GENERATING}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold shadow-lg transition-all transform hover:-translate-y-0.5 ${
             status === AppStatus.GENERATING 
             ? 'bg-gray-400 cursor-not-allowed' 
             : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
          }`}
        >
          {status === AppStatus.GENERATING ? (
            <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generando...</span>
            </>
          ) : (
            <>
                <Zap className="w-5 h-5" />
                <span>Generar Módulo</span>
            </>
          )}
        </button>
      </div>

      {status === AppStatus.ERROR && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 flex items-center mb-6">
            <AlertCircle className="w-5 h-5 mr-2" />
            {errorMsg}
        </div>
      )}

      {files.length > 0 && (
        <div className="flex-grow flex flex-col md:flex-row gap-6 h-[600px]">
          {/* File List */}
          <div className="w-full md:w-1/4 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">
                Archivos Generados
            </div>
            <div className="overflow-y-auto flex-grow p-2 space-y-1">
                {files.map((file, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveFileIndex(idx)}
                        className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-2 text-sm transition-colors ${
                            activeFileIndex === idx 
                            ? 'bg-purple-50 text-purple-700 font-medium' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <FileCode className="w-4 h-4" />
                        <span className="truncate">{file.path}</span>
                    </button>
                ))}
            </div>
          </div>

          {/* Code View */}
          <div className="w-full md:w-3/4 h-full">
            <CodeBlock 
                fileName={files[activeFileIndex].path} 
                language={files[activeFileIndex].language} 
                code={files[activeFileIndex].content} 
            />
          </div>
        </div>
      )}

      {status === AppStatus.IDLE && (
         <div className="flex-grow flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <Zap className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">Listo para generar código</p>
            <p className="text-sm">Configura tus parámetros y presiona "Generar Módulo"</p>
         </div>
      )}
    </div>
  );
};