
import { GoogleGenAI, Type } from "@google/genai";
import { MarketplaceConfig, FiscalConfig, GeneratedFile } from "../types";

export const generateOdooModuleCode = async (
  marketplaces: MarketplaceConfig[], 
  fiscal: FiscalConfig
): Promise<GeneratedFile[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Eres un ingeniero senior experto en Odoo 18 y Localización Española / Contabilidad.
    Genera un módulo de Odoo 18 profesional para integrar Mirakl y TEMU.

    DISEÑO Y ESTILOS:
    - Las vistas XML deben heredar y usar las clases nativas de Odoo 18 (o_form_view, o_list_view, o_group, o_inner_group).
    - El diseño debe integrarse perfectamente con el backend de Odoo 18 Enterprise.
    - Usa widgets nativos como 'monetary', 'status_bar', 'many2one_avatar_user'.

    CAMPOS FINANCIEROS CRÍTICOS (sale.order):
    - marketplace_id: Char (ID original)
    - transaction_ref: Char (Referencia de pago/transacción)
    - payment_method_name: Char (Método detectado)
    - commission_amount: Monetary (Comisión del marketplace)
    - payment_journal_id: Many2one (Diario contable específico del canal)

    LÓGICA DE NEGOCIO:
    1. Registro de Pago: Al confirmar el pedido, si viene de marketplace y tiene transaction_ref, crear un account.payment en el diario configurado y conciliarlo automáticamente con la factura.
    2. Fiscalidad: Implementar l10n_es_sii para que las facturas se marquen con el tipo de factura rectificativa o simplificada según corresponda.
    3. Mappings: Los transportistas se mapean mediante un modelo 'marketplace.delivery.carrier.mapping'.

    ESTRUCTURA DE ARCHIVOS:
    - __manifest__.py (Dependencias: sale_management, account, l10n_es_sii)
    - models/marketplace_connector.py (Lógica base)
    - models/sale_order.py (Herencia con campos financieros)
    - views/marketplace_connector_views.xml (Vista ágil con pestañas)
    - views/sale_order_views.xml (Añadir pestaña "Finanzas Marketplace")
    - security/ir.model.access.csv

    DATOS CONFIG: ${JSON.stringify(marketplaces)}
    
    RESPUESTA: JSON Array de objetos {name, path, language, content}.
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
            name: { type: Type.STRING },
            path: { type: Type.STRING },
            language: { type: Type.STRING },
            content: { type: Type.STRING }
          },
          required: ["name", "path", "language", "content"]
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No se pudo generar el código");

  return JSON.parse(text.trim());
};
