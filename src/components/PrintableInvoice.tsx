import React from "react";
import { Project } from "../types";
import Logo from "./Logo";

interface PrintableInvoiceProps {
  project: Project;
}

export default function PrintableInvoice({ project }: PrintableInvoiceProps) {
  const { clientName, clientPhone, projectAddress, branch, date, globalMarkupPercent, includeVat, docType = "quote", jobs } = project;

  // Global calculations
  const totalClientMaterialPrice = jobs.reduce((totalSum, job) => {
    return totalSum + job.items.reduce((sum, item) => {
      const markup = item.markupPercent !== undefined ? item.markupPercent : globalMarkupPercent;
      return sum + (item.costPrice * (1 + markup / 100)) * item.quantity;
    }, 0);
  }, 0);

  const totalLaborCost = jobs.reduce((sum, job) => sum + job.laborCost, 0);
  const subtotalClient = totalClientMaterialPrice + totalLaborCost;
  const vatAmount = includeVat ? subtotalClient * 0.17 : 0;
  const grandTotalClient = subtotalClient + vatAmount;

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white text-slate-900 font-sans text-right" dir="rtl">
      {/* Invoice Header */}
      <div className="flex justify-between items-start border-b-2 border-slate-300 pb-6 mb-6">
        <div className="flex gap-4 items-center">
          <Logo className="h-16 w-auto" />
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              {docType === "invoice" ? "חשבונית ופירוט עבודות" : "הצעת מחיר ופירוט עבודות"}
            </h1>
            <p className="text-xs text-slate-500 mt-1">מערכת תמחור דיגיטלית לחשמלאי מוסמך</p>
          </div>
        </div>
        <div className="text-left">
          <h2 className="text-lg font-bold text-slate-800">{clientName || "פרויקט ללא שם"}</h2>
          <p className="text-xs text-slate-500">תאריך: {date}</p>
          {branch && <p className="text-xs text-slate-700 font-bold">ענף: {branch}</p>}
          {projectAddress && <p className="text-xs text-slate-500">כתובת: {projectAddress}</p>}
          {clientPhone && <p className="text-xs text-slate-500 font-mono">טלפון: {clientPhone}</p>}
        </div>
      </div>

      {/* Jobs details list */}
      <div className="space-y-6 mb-8">
        <h3 className="text-sm font-bold border-b border-slate-200 pb-1 mb-3">פירוט עבודות וחומרים</h3>
        {jobs.length === 0 ? (
          <p className="text-xs text-slate-400">אין עבודות בפרויקט זה.</p>
        ) : (
          jobs.map((job, idx) => {
            const jobTotal = job.items.reduce((sum, item) => {
              const itemMarkup = item.markupPercent !== undefined ? item.markupPercent : globalMarkupPercent;
              return sum + (item.costPrice * (1 + itemMarkup / 100)) * item.quantity;
            }, 0) + job.laborCost;

            return (
              <div key={job.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200/60 break-inside-avoid">
                <div className="flex justify-between items-center mb-2 font-bold text-slate-800 border-b border-slate-200 pb-1">
                  <span>{idx + 1}. {job.title}</span>
                  <span className="font-mono text-xs">₪{jobTotal.toFixed(1)}</span>
                </div>
                {job.description && <p className="text-xs text-slate-500 italic mb-2">{job.description}</p>}
                
                {job.items.length > 0 && (
                  <div className="mt-2 text-xs space-y-1 pr-4 border-r-2 border-slate-200 mb-2">
                    <div className="text-[10px] text-slate-400 font-bold">חומרים כלולים (כולל רווח):</div>
                    {job.items.map((item) => {
                      const itemMarkup = item.markupPercent !== undefined ? item.markupPercent : globalMarkupPercent;
                      const clientPrice = item.costPrice * (1 + itemMarkup / 100);
                      return (
                        <div key={item.id} className="flex justify-between text-slate-600">
                          <span>- {item.name} (כמות: {item.quantity})</span>
                          <span className="font-mono">₪{(clientPrice * item.quantity).toFixed(1)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="mt-1 text-[11px] text-slate-500 pr-4">
                  שירות ועבודה: <span className="font-bold font-mono">₪{job.laborCost.toFixed(1)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary table */}
      <div className="w-72 mr-auto border-t-2 border-slate-300 pt-4 space-y-2 text-xs">
        <div className="flex justify-between text-slate-600">
          <span>סה״כ חומרים ללקוח:</span>
          <span className="font-mono">₪{totalClientMaterialPrice.toFixed(1)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>סה״כ עבודה ושירות:</span>
          <span className="font-mono">₪{totalLaborCost.toFixed(1)}</span>
        </div>
        <div className="flex justify-between font-bold border-t border-slate-200 pt-2 text-slate-800">
          <span>סה״כ לפני מע״מ:</span>
          <span className="font-mono">₪{subtotalClient.toFixed(1)}</span>
        </div>
        {includeVat && (
          <div className="flex justify-between text-slate-500">
            <span>מע״מ (17%):</span>
            <span className="font-mono">₪{vatAmount.toFixed(1)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-black bg-slate-100 p-2.5 rounded border border-slate-200">
          <span>סה״כ לתשלום:</span>
          <span className="font-mono text-indigo-950">₪{grandTotalClient.toFixed(1)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-[11px] text-slate-400 border-t border-slate-200 pt-6">
        <p>{docType === "invoice" ? "חשבונית זו הופקה דיגיטלית ונכונה ליום הפקתה." : "הצעת מחיר זו הופקה דיגיטלית ונכונה ליום הפקתה."}</p>
        <p className="mt-1">תודה רבה על שיתוף הפעולה! נשמח לעמוד לשירותכם תמיד.</p>
      </div>
    </div>
  );
}
