/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Project, Job } from "../types";
import { 
  FileText, Percent, ShieldCheck, Printer, Share2, AlertCircle, 
  Trash2, Copy, Check, Download, Upload, User, Phone, MapPin, Calendar, DollarSign, Settings
} from "lucide-react";

interface QuoteSummaryProps {
  project: Project;
  onUpdateProject: (updatedProject: Project) => void;
  onClearProject: () => void;
  onImportBackup: (backupStr: string) => boolean;
  onExportBackup: () => string;
}

export default function QuoteSummary({
  project,
  onUpdateProject,
  onClearProject,
  onImportBackup,
  onExportBackup,
}: QuoteSummaryProps) {
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState("");
  const [showBackup, setShowBackup] = useState(false);
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");

  const { clientName, clientPhone, projectAddress, branch, date, globalMarkupPercent, includeVat, docType = "quote", jobs } = project;

  // Global project calculations
  const totalWholesaleMaterialCost = jobs.reduce((totalSum, job) => {
    return totalSum + job.items.reduce((sum, item) => sum + item.costPrice * item.quantity, 0);
  }, 0);

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

  const totalMaterialProfit = totalClientMaterialPrice - totalWholesaleMaterialCost;
  const totalProjectMargin = totalMaterialProfit + totalLaborCost;

  // Handle updates to basic client info
  const handleUpdateField = (field: keyof Project, value: any) => {
    onUpdateProject({
      ...project,
      [field]: value,
    });
  };

  // Format WhatsApp Hebrew message
  const generateWhatsAppMessage = () => {
    let msg = docType === "invoice" ? `*חשבונית וסיכום עבודות חשמל*\n` : `*הצעת מחיר / סיכום עבודות חשמל*\n`;
    if (clientName) msg += `לכבוד: *${clientName}*\n`;
    if (date) msg += `תאריך: ${date}\n`;
    if (branch) msg += `ענף: *${branch}*\n`;
    if (projectAddress) msg += `מיקום/כתובת: ${projectAddress}\n`;
    msg += `------------------------------------------\n\n`;

    jobs.forEach((job, index) => {
      msg += `*${index + 1}. ${job.title}*\n`;
      if (job.description) msg += `  _${job.description}_\n`;
      
      if (job.items.length > 0) {
        msg += `  • *חומרים ששומשו:*\n`;
        job.items.forEach((item) => {
          const itemMarkup = item.markupPercent !== undefined ? item.markupPercent : globalMarkupPercent;
          const clientPrice = item.costPrice * (1 + itemMarkup / 100);
          msg += `    - ${item.name} | כמות: ${item.quantity} | מחיר יח׳: ₪${clientPrice.toFixed(1)}\n`;
        });
      }
      
      msg += `  • *מחיר עבודה ושירות:* ₪${job.laborCost.toFixed(0)}\n`;
      const jobTotal = job.items.reduce((sum, item) => {
        const itemMarkup = item.markupPercent !== undefined ? item.markupPercent : globalMarkupPercent;
        return sum + (item.costPrice * (1 + itemMarkup / 100)) * item.quantity;
      }, 0) + job.laborCost;
      msg += `  *סה״כ לעבודה זו:* ₪${jobTotal.toFixed(1)}\n\n`;
    });

    msg += `------------------------------------------\n`;
    msg += `*סיכום סופי:*\n`;
    msg += `• סה״כ חומרים ללקוח: ₪${totalClientMaterialPrice.toFixed(1)}\n`;
    msg += `• סה״כ עבודה (שירות): ₪${totalLaborCost.toFixed(1)}\n`;
    msg += `• סה״כ ביניים: ₪${subtotalClient.toFixed(1)}\n`;
    
    if (includeVat) {
      msg += `• מע״מ (17%): ₪${vatAmount.toFixed(1)}\n`;
      msg += `*סה״כ סופי לתשלום (כולל מע״מ): ₪${grandTotalClient.toFixed(1)}*\n`;
    } else {
      msg += `*סה״כ סופי לתשלום (ללא מע״מ): ₪${grandTotalClient.toFixed(1)}*\n`;
    }

    msg += `\nתודה רבה!\n_הופק באמצעות מחשבון החשמלאי_`;
    return encodeURIComponent(msg);
  };

  const handleCopyText = () => {
    let msg = docType === "invoice" ? `חשבונית וסיכום עבודות חשמל\n` : `הצעת מחיר / סיכום עבודות חשמל\n`;
    if (clientName) msg += `לכבוד: ${clientName}\n`;
    if (date) msg += `תאריך: ${date}\n`;
    if (branch) msg += `ענף: ${branch}\n`;
    if (projectAddress) msg += `מיקום/כתובת: ${projectAddress}\n`;
    msg += `------------------------------------------\n\n`;

    jobs.forEach((job, index) => {
      msg += `${index + 1}. ${job.title}\n`;
      if (job.description) msg += `   (${job.description})\n`;
      if (job.items.length > 0) {
        msg += `   חומרים ששומשו:\n`;
        job.items.forEach((item) => {
          const itemMarkup = item.markupPercent !== undefined ? item.markupPercent : globalMarkupPercent;
          const clientPrice = item.costPrice * (1 + itemMarkup / 100);
          msg += `     - ${item.name} | כמות: ${item.quantity} | מחיר יח׳: ₪${clientPrice.toFixed(1)}\n`;
        });
      }
      msg += `   מחיר עבודה ושירות: ₪${job.laborCost.toFixed(0)}\n`;
      const jobTotal = job.items.reduce((sum, item) => {
        const itemMarkup = item.markupPercent !== undefined ? item.markupPercent : globalMarkupPercent;
        return sum + (item.costPrice * (1 + itemMarkup / 100)) * item.quantity;
      }, 0) + job.laborCost;
      msg += `   סה״כ לעבודה זו: ₪${jobTotal.toFixed(1)}\n\n`;
    });

    msg += `------------------------------------------\n`;
    msg += `סיכום סופי:\n`;
    msg += `סה״כ חומרים ללקוח: ₪${totalClientMaterialPrice.toFixed(1)}\n`;
    msg += `סה״כ עבודה: ₪${totalLaborCost.toFixed(1)}\n`;
    msg += `סה״כ לפני מע״מ: ₪${subtotalClient.toFixed(1)}\n`;
    if (includeVat) {
      msg += `מע״מ (17%): ₪${vatAmount.toFixed(1)}\n`;
      msg += `סה״כ לתשלום (כולל מע״מ): ₪${grandTotalClient.toFixed(1)}\n`;
    } else {
      msg += `סה״כ לתשלום: ₪${grandTotalClient.toFixed(1)}\n`;
    }

    navigator.clipboard.writeText(msg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTriggerPrint = () => {
    const originalTitle = document.title;
    const documentName = docType === "invoice" ? "חשבונית" : "הצעת מחיר";
    document.title = `${documentName} - ${clientName || "עבודות חשמל"}`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const handleExportJson = () => {
    const backup = onExportBackup();
    const blob = new Blob([backup], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `גיבוי_מחשבון_חשמל_${clientName || "פרויקט"}_${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportJson = () => {
    if (!importText.trim()) return;
    const success = onImportBackup(importText);
    if (success) {
      setImportStatus("success");
      setImportText("");
      setTimeout(() => {
        setImportStatus("idle");
        setShowBackup(false);
      }, 2000);
    } else {
      setImportStatus("error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Financial Breakdown Panel */}
      <div id="financial-overview" className="grid grid-cols-1 gap-3">
        {/* Cost Price */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4 text-right">
          <div>
            <div className="text-xs text-slate-500 font-bold">סך עלות חומרים סיטונאית</div>
            <p className="text-[10px] text-slate-400 mt-0.5">מחירי קנייה מ-Erco (ללא רווח)</p>
          </div>
          <div className="text-lg font-black text-slate-700 font-mono whitespace-nowrap">
            ₪{totalWholesaleMaterialCost.toFixed(1)}
          </div>
        </div>

        {/* Client Material Revenue */}
        <div className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-4 flex items-center justify-between gap-4 text-right">
          <div>
            <div className="text-xs text-indigo-600 font-bold">מחיר חומרים ללקוח</div>
            <p className="text-[10px] text-indigo-400 mt-0.5">כולל מרווח רווח של {globalMarkupPercent}%</p>
          </div>
          <div className="text-lg font-black text-indigo-700 font-mono whitespace-nowrap">
            ₪{totalClientMaterialPrice.toFixed(1)}
          </div>
        </div>

        {/* Total Labor Income */}
        <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-4 flex items-center justify-between gap-4 text-right">
          <div>
            <div className="text-xs text-emerald-600 font-bold">סה״כ שירות ועבודה</div>
            <p className="text-[10px] text-emerald-500 mt-0.5">רווח נקי מעבודה פיזית</p>
          </div>
          <div className="text-lg font-black text-emerald-700 font-mono whitespace-nowrap">
            ₪{totalLaborCost.toFixed(1)}
          </div>
        </div>

        {/* Net Profit Margin of Project */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-xl p-4 flex items-center justify-between gap-4 text-right text-white shadow-md">
          <div>
            <div className="text-xs text-indigo-200 font-semibold">סך רווח נקי לפרויקט זה</div>
            <p className="text-[10px] text-indigo-200/85 mt-0.5">עבודה (₪{totalLaborCost}) + רווח חומרים (₪{totalMaterialProfit.toFixed(0)})</p>
          </div>
          <div className="text-lg font-black text-indigo-300 font-mono whitespace-nowrap">
            ₪{totalProjectMargin.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Total summary of Quote & Export features */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-md border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            סיכום כספי סופי ללקוח
          </h3>

          {/* Document Type Selector */}
          <div className="mt-4">
            <label className="block text-xs font-bold text-slate-600 text-right mb-1.5">סוג המסמך להפקה:</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => handleUpdateField("docType", "quote")}
                className={`py-2 px-3 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  docType === "quote"
                    ? "bg-white text-indigo-700 shadow-xs border border-indigo-100/50"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <FileText className="w-4 h-4" />
                הצעת מחיר
              </button>
              <button
                type="button"
                onClick={() => handleUpdateField("docType", "invoice")}
                className={`py-2 px-3 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  docType === "invoice"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                חשבונית ופירוט
              </button>
            </div>
          </div>

            {/* Pricing Adjustments (Moved from Left Side) */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-150 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Global markup percent slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-600">אחוז רווח חומרים כללי:</span>
                  <span className="text-indigo-600 font-black bg-indigo-50 px-2 py-0.5 rounded font-mono">
                    {globalMarkupPercent}%
                  </span>
                </div>
                <input
                  id="markup-slider"
                  type="range"
                  min="0"
                  max="150"
                  step="5"
                  value={globalMarkupPercent}
                  onChange={(e) => handleUpdateField("globalMarkupPercent", parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-semibold">
                  <span>מחיר עלות (0%)</span>
                  <span>כפול 1.5 (50%)</span>
                  <span>כפול 2.5 (150%)</span>
                </div>
              </div>

              {/* VAT Toggle */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200/80">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">הוספת מע״מ כללי (17%)</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">כבה לסיכום במזומן/ללא קבלה</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeVat}
                    onChange={(e) => handleUpdateField("includeVat", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="py-6 space-y-3.5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-semibold">סך עלות חומרים ללקוח:</span>
                <span className="font-mono text-slate-800">₪{totalClientMaterialPrice.toFixed(1)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-semibold">סך מחיר עבודה (שירות):</span>
                <span className="font-mono text-slate-800">₪{totalLaborCost.toFixed(1)}</span>
              </div>
              
              <div className="h-[1px] bg-slate-100 my-2"></div>
              
              <div className="flex justify-between text-sm font-bold">
                <span className="text-slate-700">סה״כ ביניים {includeVat ? "(לפני מע״מ)" : ""}:</span>
                <span className="font-mono text-slate-900">₪{subtotalClient.toFixed(1)}</span>
              </div>

              {includeVat && (
                <div className="flex justify-between text-sm text-slate-500">
                  <span className="font-semibold">מע״מ כחוק (17%):</span>
                  <span className="font-mono text-slate-800">₪{vatAmount.toFixed(1)}</span>
                </div>
              )}

              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50 flex justify-between items-center mt-4">
                <div>
                  <span className="font-black text-slate-900 block text-sm">מחיר סופי מומלץ ללקוח</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">על בסיס מחיר חומרי עלות Erco + רווח {globalMarkupPercent}% + עבודה</span>
                </div>
                <div className="text-left">
                  <span className="text-2xl md:text-3xl font-black text-indigo-700 font-mono">
                    ₪{grandTotalClient.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-indigo-500 font-bold block mt-0.5">{includeVat ? "כולל מע״מ" : "מחיר סופי"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            {/* Delivery Channels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Copy message button */}
              <button
                onClick={handleCopyText}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copied ? "הועתק ללוח!" : "העתק סיכום להודעה"}
              </button>

              {/* WhatsApp direct link */}
              <a
                href={`https://api.whatsapp.com/send?text=${generateWhatsAppMessage()}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition shadow-sm"
              >
                <Share2 className="w-4 h-4" />
                שתף ישירות ב-WhatsApp
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Print Receipt / Quote */}
              <button
                onClick={handleTriggerPrint}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition shadow-sm"
              >
                <Printer className="w-4 h-4" />
                {docType === "invoice" ? "הדפס חשבונית / שמור PDF" : "הדפס הצעת מחיר / שמור PDF"}
              </button>

              {/* Clear / Start Fresh */}
              <button
                onClick={() => {
                  if (confirm("האם אתה בטוח שברצונך לאפס ולמחוק את כל העבודות הפעילות? (מומלץ לבצע גיבוי לפני כן)")) {
                    onClearProject();
                  }
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-sm rounded-xl transition"
              >
                <Trash2 className="w-4 h-4" />
                אפס והתחל פרויקט חדש
              </button>
            </div>

            {/* Data management (Backup and Import) */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setShowBackup(!showBackup);
                  setImportStatus("idle");
                }}
                className="text-xs font-semibold text-slate-400 hover:text-indigo-600 flex items-center gap-1 mx-auto"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>ניהול גיבויים, ייצוא וייבוא נתונים (JSON)</span>
              </button>

              {showBackup && (
                <div className="mt-4 p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-4 transition">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-200">
                    <span className="text-xs font-bold text-slate-700">ייצוא וגיבוי של בסיס הנתונים</span>
                    <button
                      onClick={handleExportJson}
                      className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 bg-white border border-slate-200 px-3 py-1 rounded hover:bg-slate-50"
                    >
                      <Download className="w-3 h-3" />
                      הורד קובץ גיבוי לסטורג׳
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-slate-600">שחזור / ייבוא גיבוי (הדבק קוד JSON):</label>
                    <textarea
                      placeholder='הדבק כאן את תוכן קובץ הגיבוי שהורדת בעבר...'
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                      dir="ltr"
                      className="w-full text-[10px] font-mono p-2 border border-slate-200 rounded-lg bg-white h-20"
                    />

                    {importStatus === "success" && (
                      <div className="p-2 bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] rounded flex items-center gap-1.5 font-bold">
                        <ShieldCheck className="w-4 h-4" />
                        הנתונים יובאו ושוחזרו בהצלחה!
                      </div>
                    )}
                    {importStatus === "error" && (
                      <div className="p-2 bg-rose-50 border border-rose-100 text-rose-800 text-[11px] rounded flex items-center gap-1.5 font-bold">
                        <AlertCircle className="w-4 h-4" />
                        שגיאה: קוד JSON לא תקין. נא לוודא שהעתקת את הנתונים במלואם.
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        onClick={handleImportJson}
                        className="flex items-center gap-1 text-[11px] font-bold text-white bg-slate-800 hover:bg-slate-900 px-4 py-1.5 rounded transition"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        שחזר מגיבוי
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
    </div>
  );
}
