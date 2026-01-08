
import { GoogleGenAI, Type } from "@google/genai";
import { MarketplaceConfig, FiscalConfig, GeneratedFile } from "../types";

export const generateOdooModuleCode = async (
  marketplaces: MarketplaceConfig[], 
  fiscal: FiscalConfig
): Promise<GeneratedFile[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Actúa como un Ingeniero Senior de Odoo. Genera el código fuente completo de un módulo para Odoo 18 Enterprise llamado "bridge_temu_kl".
    
    OBJETIVO: Sincronizar pedidos desde Mirakl/Temu hacia Odoo 18, gestionando clientes, productos, pagos y entregas.
    
    REQUISITO CRÍTICO DE DEDUPLICACIÓN:
    Los contactos DEBEN estar identificados para no repetirlos. 
    Implementa en 'res.partner' una lógica de búsqueda robusta que:
    1. Busque por NIF/CIF (campo 'vat') si está disponible.
    2. Si no, busque por Email.
    3. Si no existe, cree el registro vinculándolo a la referencia externa del marketplace.

    ESTRUCTURA DE ARCHIVOS REQUERIDA:
    1. __manifest__.py: Metadatos para Odoo 18.
    2. models/bridge_instance.py: Modelo principal de configuración de conexión.
    3. models/res_partner.py: Lógica de deduplicación avanzada.
    4. models/sale_order.py: Herencia para inyectar datos del marketplace y lógica de creación de pedidos.
    5. models/res_config_settings.py: Integración en el panel de Ajustes de Odoo.
    6. views/bridge_instance_views.xml: Vistas de lista y formulario para las instancias.
    7. views/res_config_settings_views.xml: Interfaz de configuración del módulo en Ajustes.
    8. security/ir.model.access.csv: Permisos de acceso.

    ESPECIFICACIONES TÉCNICAS:
    - Odoo 18 usa Python 3.10+.
    - Usa 'ir.config_parameter' para almacenar llaves de API de forma segura.
    - Implementa un 'ir.cron' para la descarga automática.
    
    CONTEXTO ACTUAL DE CONFIGURACIÓN:
    ${JSON.stringify(marketplaces[0])}

    RESPUESTA: Retorna EXCLUSIVAMENTE un JSON Array de objetos {path: string, content: string}. No incluyas explicaciones fuera del JSON.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            path: { type: Type.STRING },
            content: { type: Type.STRING }
          },
          required: ["path", "content"]
        }
      }
    }
  });

  const files = JSON.parse(response.text || "[]");
  return files.map((f: any) => ({
    name: f.path.split('/').pop(),
    path: f.path,
    language: f.path.endsWith('.py') ? 'python' : 'xml',
    content: f.content
  }));
};
