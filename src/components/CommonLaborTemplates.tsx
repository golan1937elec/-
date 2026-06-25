/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CommonLaborPrice, CatalogItem } from "../types";
import { COMMON_LABOR_PRICES } from "../initialData";
import { Sparkles, Plus, Info } from "lucide-react";

interface CommonLaborTemplatesProps {
  catalog: CatalogItem[];
  onAddJobFromTemplate: (template: CommonLaborPrice) => void;
}

export default function CommonLaborTemplates({
  catalog,
  onAddJobFromTemplate,
}: CommonLaborTemplatesProps) {
  return (
    <div id="templates-section" className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
        <h3 className="font-bold text-slate-900 text-lg">עבודות נפוצות להוספה מהירה</h3>
      </div>
      <p className="text-xs text-slate-500 mb-6">
        לחיצה על עבודה נפוצה תוסיף אותה מייד לרשימה עם מחיר העבודה הסטנדרטי וחומרי הבסיס המתאימים לפי קטלוג Erco!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {COMMON_LABOR_PRICES.map((template) => {
          // Find if there are suggested materials and retrieve their details
          const materialsCount = template.suggestedMaterials?.length || 0;
          const materialListPreview = template.suggestedMaterials?.map((sm) => {
            const catItem = catalog.find((ci) => ci.sku === sm.sku);
            return catItem ? `${catItem.name} (${sm.quantity} יח')` : null;
          }).filter(Boolean).join(", ");

          return (
            <div
              key={template.id}
              onClick={() => onAddJobFromTemplate(template)}
              className="group relative bg-slate-50/50 hover:bg-indigo-50/30 hover:border-indigo-200 border border-slate-100 p-4 rounded-xl transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded">
                    {template.category}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900 bg-white border border-slate-100 px-2 py-0.5 rounded shadow-sm">
                    עבודה: ₪{template.defaultLaborCost}
                  </span>
                </div>
                
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-900 mb-2 transition">
                  {template.title}
                </h4>

                {materialsCount > 0 && (
                  <div className="flex items-start gap-1 mt-1 text-slate-500 text-[11px] leading-relaxed bg-white/70 p-2 rounded border border-slate-100/50">
                    <Info className="w-3 h-3 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-700">כולל חומרים: </span>
                      <span className="text-slate-500">{materialListPreview}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-end text-xs font-semibold text-indigo-600 group-hover:text-indigo-700 gap-1">
                <Plus className="w-3.5 h-3.5" />
                <span>הוסף לעבודה הנוכחית</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
