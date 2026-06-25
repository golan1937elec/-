/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Job, JobItem, CatalogItem, PRODUCT_CATEGORIES } from "../types";
import { 
  Plus, Trash2, Search, Briefcase, Coins, ChevronDown, ChevronUp, 
  Settings, ShoppingBag, PlusCircle, MinusCircle, Info, Edit, Check,
  Calculator, Clock
} from "lucide-react";

interface JobsManagerProps {
  jobs: Job[];
  catalog: CatalogItem[];
  globalMarkupPercent: number;
  includeVat: boolean;
  onAddJob: (title: string, laborCost?: number, initialItems?: { sku: string; quantity: number }[]) => void;
  onUpdateJob: (updatedJob: Job) => void;
  onDeleteJob: (id: string) => void;
}

export default function JobsManager({
  jobs,
  catalog,
  globalMarkupPercent,
  includeVat,
  onAddJob,
  onUpdateJob,
  onDeleteJob,
}: JobsManagerProps) {
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobLabor, setNewJobLabor] = useState("");
  const [activeSearchJobId, setActiveSearchJobId] = useState<string | null>(null);
  const [materialSearchQuery, setMaterialSearchQuery] = useState("");
  const [selectedMaterialCategory, setSelectedMaterialCategory] = useState("all");
  
  // Custom manual material on-the-fly state per job
  const [customMaterialName, setCustomMaterialName] = useState("");
  const [customMaterialPrice, setCustomMaterialPrice] = useState("");

  // Editable rate shortcuts with localStorage persistence
  const [rateElectrician, setRateElectrician] = useState<number>(() => {
    const saved = localStorage.getItem('rate_electrician');
    return saved ? Number(saved) : 250;
  });
  const [rateSenior, setRateSenior] = useState<number>(() => {
    const saved = localStorage.getItem('rate_senior');
    return saved ? Number(saved) : 350;
  });
  const [rateWithAssistant, setRateWithAssistant] = useState<number>(() => {
    const saved = localStorage.getItem('rate_with_assistant');
    return saved ? Number(saved) : 380;
  });

  const [isEditingShortcuts, setIsEditingShortcuts] = useState(false);
  const [tempRateElectrician, setTempRateElectrician] = useState(rateElectrician.toString());
  const [tempRateSenior, setTempRateSenior] = useState(rateSenior.toString());
  const [tempRateWithAssistant, setTempRateWithAssistant] = useState(rateWithAssistant.toString());

  const handleSaveShortcuts = () => {
    const elec = Math.max(0, parseInt(tempRateElectrician) || 0);
    const snr = Math.max(0, parseInt(tempRateSenior) || 0);
    const asst = Math.max(0, parseInt(tempRateWithAssistant) || 0);

    setRateElectrician(elec);
    setRateSenior(snr);
    setRateWithAssistant(asst);

    localStorage.setItem('rate_electrician', elec.toString());
    localStorage.setItem('rate_senior', snr.toString());
    localStorage.setItem('rate_with_assistant', asst.toString());

    setIsEditingShortcuts(false);
  };

  const handleStartEditingShortcuts = () => {
    setTempRateElectrician(rateElectrician.toString());
    setTempRateSenior(rateSenior.toString());
    setTempRateWithAssistant(rateWithAssistant.toString());
    setIsEditingShortcuts(true);
  };

  // Labor hours calculator states
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [calcHourlyRate, setCalcHourlyRate] = useState<number>(() => {
    const saved = localStorage.getItem('rate_electrician');
    return saved ? Number(saved) : 250;
  });
  const [calcHours, setCalcHours] = useState<number>(4);

  const calculatedTotal = calcHourlyRate * calcHours;

  const handleApplyCalculatedLabor = () => {
    setNewJobLabor(calculatedTotal.toFixed(0));
    setIsCalcOpen(false);
  };

  const handleCreateManualJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim()) return;
    
    const labor = parseFloat(newJobLabor) || 0;
    onAddJob(newJobTitle.trim(), labor);
    setNewJobTitle("");
    setNewJobLabor("");
  };

  const handleUpdateLaborCost = (job: Job, costStr: string) => {
    const cost = parseFloat(costStr) || 0;
    onUpdateJob({
      ...job,
      laborCost: cost,
    });
  };

  const handleUpdateJobTitle = (job: Job, title: string) => {
    onUpdateJob({
      ...job,
      title: title,
    });
  };

  const handleUpdateJobDescription = (job: Job, desc: string) => {
    onUpdateJob({
      ...job,
      description: desc,
    });
  };

  const handleAddMaterialToJob = (job: Job, catalogItem: CatalogItem) => {
    // Check if item already exists in job
    const existingIndex = job.items.findIndex(
      (item) => item.catalogId === catalogItem.id || item.sku === catalogItem.sku
    );

    const price = typeof catalogItem.costPrice === "string" ? parseFloat(catalogItem.costPrice) : catalogItem.costPrice;

    if (existingIndex > -1) {
      // Increment quantity
      const updatedItems = [...job.items];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: updatedItems[existingIndex].quantity + 1,
      };
      onUpdateJob({ ...job, items: updatedItems });
    } else {
      // Add new item
      const newItem: JobItem = {
        id: Math.random().toString(36).substr(2, 9),
        catalogId: catalogItem.id,
        sku: catalogItem.sku,
        name: catalogItem.name,
        costPrice: price,
        quantity: 1,
      };
      onUpdateJob({ ...job, items: [...job.items, newItem] });
    }
  };

  const handleAddManualMaterial = (job: Job) => {
    if (!customMaterialName.trim() || !customMaterialPrice) return;
    const price = parseFloat(customMaterialPrice);
    if (isNaN(price) || price < 0) return;

    const newItem: JobItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: customMaterialName.trim(),
      costPrice: price,
      quantity: 1,
    };

    onUpdateJob({
      ...job,
      items: [...job.items, newItem],
    });

    setCustomMaterialName("");
    setCustomMaterialPrice("");
  };

  const handleUpdateItemQty = (job: Job, itemId: string, newQty: number) => {
    if (newQty < 1) return;
    const updatedItems = job.items.map((item) =>
      item.id === itemId ? { ...item, quantity: newQty } : item
    );
    onUpdateJob({ ...job, items: updatedItems });
  };

  const handleUpdateItemPrice = (job: Job, itemId: string, newPriceStr: string) => {
    const price = parseFloat(newPriceStr) || 0;
    const updatedItems = job.items.map((item) =>
      item.id === itemId ? { ...item, costPrice: price } : item
    );
    onUpdateJob({ ...job, items: updatedItems });
  };

  const handleDeleteItemFromJob = (job: Job, itemId: string) => {
    const updatedItems = job.items.filter((item) => item.id !== itemId);
    onUpdateJob({ ...job, items: updatedItems });
  };

  // Catalog item searcher for selection
  const filteredCatalogForSelection = catalog.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(materialSearchQuery.toLowerCase()) ||
      item.sku.includes(materialSearchQuery) ||
      (item.brand && item.brand.toLowerCase().includes(materialSearchQuery.toLowerCase()));

    const matchesCategory =
      selectedMaterialCategory === "all" || item.category === selectedMaterialCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Create New Job Manually */}
      <div id="add-job-manual-form" className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-600" />
          הוספת עבודה מותאמת אישית לענף או לפרויקט
        </h3>
        
        <form onSubmit={handleCreateManualJob} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">שם העבודה / המשימה שבוצעה *</label>
            <input
              type="text"
              required
              placeholder="למשל: החלפת לוח חשמל משני בקומה ב׳, התקנת גופים במטבח"
              value={newJobTitle}
              onChange={(e) => setNewJobTitle(e.target.value)}
              className="w-full text-sm px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/30"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700">מחיר עבודה בלבד (₪ - ללא חומרים)</label>
              <button
                type="button"
                onClick={() => setIsCalcOpen(!isCalcOpen)}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
              >
                <Calculator className="w-3 h-3" />
                {isCalcOpen ? "סגור מחשבון" : "חשב שעות עבודה"}
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                placeholder="למשל: 350"
                value={newJobLabor}
                onChange={(e) => setNewJobLabor(e.target.value)}
                className="w-full text-sm px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/30"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition shrink-0"
              >
                הוסף עבודה
              </button>
            </div>
          </div>

          {/* Labor Hours Calculator Form Expanded */}
          {isCalcOpen && (
            <div className="md:col-span-3 mt-2 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/70 space-y-3">
              <div className="flex items-center gap-2 text-indigo-800 font-bold text-xs pb-1 border-b border-indigo-100/45">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>מחשבון שעות עבודה דינמי (תעריפי שוק חשמלאים)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">תעריף שעת עבודה (₪)</label>
                  <input
                    type="number"
                    min="0"
                    value={calcHourlyRate}
                    onChange={(e) => setCalcHourlyRate(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-lg bg-white font-mono font-bold focus:ring-1 focus:ring-indigo-500"
                  />
                  <div className="mt-1.5">
                    {!isEditingShortcuts ? (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setCalcHourlyRate(rateElectrician)}
                          className={`text-[10px] px-2 py-0.5 rounded border transition font-medium ${calcHourlyRate === rateElectrician ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                        >
                          חשמלאי (₪{rateElectrician})
                        </button>
                        <button
                          type="button"
                          onClick={() => setCalcHourlyRate(rateSenior)}
                          className={`text-[10px] px-2 py-0.5 rounded border transition font-medium ${calcHourlyRate === rateSenior ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                        >
                          חשמלאי בכיר (₪{rateSenior})
                        </button>
                        <button
                          type="button"
                          onClick={() => setCalcHourlyRate(rateWithAssistant)}
                          className={`text-[10px] px-2 py-0.5 rounded border transition font-medium ${calcHourlyRate === rateWithAssistant ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                        >
                          חשמלאי ועוזר (₪{rateWithAssistant})
                        </button>
                        <button
                          type="button"
                          onClick={handleStartEditingShortcuts}
                          className="text-[10px] px-1.5 py-0.5 rounded border border-dashed border-slate-300 text-indigo-600 hover:bg-indigo-50 font-medium flex items-center gap-0.5 transition"
                          title="ערוך תעריפי קיצור דרך"
                        >
                          <Edit className="w-2.5 h-2.5" />
                          ערוך תעריפים
                        </button>
                      </div>
                    ) : (
                      <div className="p-2 bg-slate-100/90 rounded-lg border border-slate-200/80 space-y-2 text-right">
                        <div className="text-[10px] font-bold text-slate-600">ערוך תעריפי קיצור דרך מהירים (₪):</div>
                        <div className="grid grid-cols-3 gap-1.5">
                          <div>
                            <span className="block text-[9px] text-slate-500 truncate">חשמלאי:</span>
                            <input
                              type="number"
                              value={tempRateElectrician}
                              onChange={(e) => setTempRateElectrician(e.target.value)}
                              className="w-full text-[10px] px-1 py-0.5 border border-slate-300 rounded bg-white text-center font-mono font-bold"
                            />
                          </div>
                          <div>
                            <span className="block text-[9px] text-slate-500 truncate">בכיר:</span>
                            <input
                              type="number"
                              value={tempRateSenior}
                              onChange={(e) => setTempRateSenior(e.target.value)}
                              className="w-full text-[10px] px-1 py-0.5 border border-slate-300 rounded bg-white text-center font-mono font-bold"
                            />
                          </div>
                          <div>
                            <span className="block text-[9px] text-slate-500 truncate">ועוזר:</span>
                            <input
                              type="number"
                              value={tempRateWithAssistant}
                              onChange={(e) => setTempRateWithAssistant(e.target.value)}
                              className="w-full text-[10px] px-1 py-0.5 border border-slate-300 rounded bg-white text-center font-mono font-bold"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-1.5 pt-1 border-t border-slate-200/50">
                          <button
                            type="button"
                            onClick={() => setIsEditingShortcuts(false)}
                            className="text-[9px] px-2 py-0.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                          >
                            ביטול
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveShortcuts}
                            className="text-[9px] px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-0.5"
                          >
                            <Check className="w-2.5 h-2.5" />
                            שמור
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">מספר שעות עבודה</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCalcHours((h) => Math.max(0.5, h - 0.5))}
                      className="w-8 h-8 rounded bg-white border border-slate-200 flex items-center justify-center font-bold hover:bg-slate-100 shrink-0 text-slate-600"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={calcHours}
                      onChange={(e) => setCalcHours(Math.max(0.5, parseFloat(e.target.value) || 1))}
                      className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-lg bg-white text-center font-mono font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => setCalcHours((h) => h + 0.5)}
                      className="w-8 h-8 rounded bg-white border border-slate-200 flex items-center justify-center font-bold hover:bg-slate-100 shrink-0 text-slate-600"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <button
                      type="button"
                      onClick={() => setCalcHours(1)}
                      className="text-[10px] px-1.5 py-0.5 rounded border bg-white text-slate-600 border-slate-200 hover:bg-slate-50 transition"
                    >
                      שעה 1
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcHours(4)}
                      className="text-[10px] px-1.5 py-0.5 rounded border bg-white text-slate-600 border-slate-200 hover:bg-slate-50 transition"
                    >
                      חצי יום (4 ש')
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcHours(8)}
                      className="text-[10px] px-1.5 py-0.5 rounded border bg-white text-slate-600 border-slate-200 hover:bg-slate-50 transition"
                    >
                      יום שלם (8 ש')
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-indigo-100/40">
                <div className="text-xs text-indigo-900 font-semibold text-right">
                  חישוב: <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-indigo-150 text-indigo-700 font-bold">{calcHours} שעות</span> × <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-indigo-150 text-indigo-700 font-bold">₪{calcHourlyRate} לשעה</span> = <span className="font-mono text-indigo-800 font-black bg-indigo-100 px-2 py-0.5 rounded text-sm">₪{calculatedTotal.toFixed(0)}</span>
                </div>
                
                <button
                  type="button"
                  onClick={handleApplyCalculatedLabor}
                  className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm transition"
                >
                  הזן למחיר העבודה
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Active Jobs List */}
      <div className="space-y-6">
        <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-indigo-600" />
          רשימת העבודות הכלולות בפרויקט ({jobs.length})
        </h3>

        {jobs.length === 0 ? (
          <div className="bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-500">
            <p className="text-sm font-medium">אין עדיין עבודות פעילות בפרויקט זה.</p>
            <p className="text-xs text-slate-400 mt-1">בחר עבודה מהירה מהתבניות למעלה, או צור עבודה חדשה בטופס מעל.</p>
          </div>
        ) : (
          jobs.map((job, index) => {
            // Calculations per Job
            const totalMaterialCost = job.items.reduce(
              (sum, item) => sum + item.costPrice * item.quantity,
              0
            );
            const totalMaterialClientPrice = job.items.reduce(
              (sum, item) => {
                const markup = item.markupPercent !== undefined ? item.markupPercent : globalMarkupPercent;
                const clientPrice = item.costPrice * (1 + markup / 100);
                return sum + clientPrice * item.quantity;
              },
              0
            );

            const jobSubtotal = totalMaterialClientPrice + job.laborCost;
            const jobSubtotalVat = includeVat ? jobSubtotal * 1.17 : jobSubtotal;

            const isSearching = activeSearchJobId === job.id;

            return (
              <div 
                key={job.id} 
                id={`job-card-${job.id}`}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
              >
                {/* Job Header Card */}
                <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={job.title}
                        onChange={(e) => handleUpdateJobTitle(job, e.target.value)}
                        className="font-bold text-slate-900 text-base md:text-lg bg-transparent hover:bg-white focus:bg-white border-b border-transparent focus:border-indigo-300 px-1 rounded transition w-full max-w-md"
                      />
                    </div>
                    
                    <input
                      type="text"
                      placeholder="הוסף הערה או מיקום (למשל: סלון, קומה 2, ארון ראשי)..."
                      value={job.description || ""}
                      onChange={(e) => handleUpdateJobDescription(job, e.target.value)}
                      className="text-xs text-slate-500 bg-transparent hover:bg-white focus:bg-white border-b border-transparent focus:border-indigo-300 px-1 rounded transition w-full"
                    />
                  </div>

                  {/* Pricing Inputs */}
                  <div className="flex flex-wrap items-center gap-4 bg-white p-3 rounded-xl border border-slate-100 shadow-sm shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">מחיר עבודה:</span>
                      <div className="relative">
                        <span className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-xs text-slate-400">₪</span>
                        <input
                          type="number"
                          min="0"
                          value={job.laborCost}
                          onChange={(e) => handleUpdateLaborCost(job, e.target.value)}
                          className="w-24 text-sm pr-5 pl-2 py-1.5 border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 bg-slate-50/30 text-left font-semibold font-mono"
                        />
                      </div>
                    </div>

                    <div className="h-6 w-[1px] bg-slate-100 hidden sm:block"></div>

                    {/* Job pricing sum overview */}
                    <div className="text-left">
                      <div className="text-[10px] text-slate-400 font-semibold">סיכום עבודה ללקוח</div>
                      <div className="text-sm font-bold text-indigo-700 font-mono">
                        ₪{jobSubtotal.toFixed(1)} <span className="text-[10px] font-normal text-slate-500">{includeVat ? "לפני מע״מ" : ""}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`האם אתה בטוח שברצונך למחוק את העבודה "${job.title}"?`)) {
                          onDeleteJob(job.id);
                        }
                      }}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition mr-2"
                      title="מחק עבודה זו"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>

                {/* Materials Used in this Job Table */}
                <div className="p-6 border-b border-slate-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      חומרי חשמל ששומשו ({job.items.length})
                    </h4>
                    
                    <button
                      onClick={() => {
                        setActiveSearchJobId(isSearching ? null : job.id);
                        setMaterialSearchQuery("");
                      }}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition flex items-center gap-1 ${
                        isSearching 
                          ? "bg-indigo-50 border-indigo-200 text-indigo-700" 
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {isSearching ? "סגור בחירת חומרים" : "בחר חומרים מהקטלוג"}
                    </button>
                  </div>

                  {/* Inline Catalog Search Panel */}
                  {isSearching && (
                    <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                          <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="חפש מוצר להוספה לעבודה זו..."
                            value={materialSearchQuery}
                            onChange={(e) => setMaterialSearchQuery(e.target.value)}
                            className="w-full text-xs pr-9 pl-3 py-2 border border-slate-200 rounded-lg bg-white"
                          />
                        </div>

                        <select
                          value={selectedMaterialCategory}
                          onChange={(e) => setSelectedMaterialCategory(e.target.value)}
                          className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                        >
                          <option value="all">כל הקטגוריות</option>
                          {PRODUCT_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Filtered Catalog List for quick add */}
                      <div className="max-h-48 overflow-y-auto border border-slate-150 rounded-lg bg-white divide-y divide-slate-100 text-xs">
                        {filteredCatalogForSelection.length === 0 ? (
                          <div className="p-4 text-center text-slate-400">לא נמצאו חומרים תואמים</div>
                        ) : (
                          filteredCatalogForSelection.slice(0, 15).map((item) => (
                            <div
                              key={item.id}
                              onClick={() => handleAddMaterialToJob(job, item)}
                              className="p-2.5 hover:bg-indigo-50/40 flex items-center justify-between cursor-pointer transition"
                            >
                              <div className="text-right">
                                <span className="font-bold text-slate-800">{item.name}</span>
                                <span className="text-[10px] text-slate-400 mr-2 font-mono">מק״ט: {item.sku}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-mono text-slate-500">עלות סיטונאית: ₪{Number(item.costPrice).toFixed(1)}</span>
                                <span className="bg-indigo-600 text-white rounded-full p-1 hover:bg-indigo-700">
                                  <Plus className="w-3.5 h-3.5" />
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                        {filteredCatalogForSelection.length > 15 && (
                          <div className="p-2 text-center text-[10px] bg-slate-50 text-slate-400 font-semibold">
                            מציג 15 תוצאות ראשונות. סנן לקבלת תוצאה מדויקת.
                          </div>
                        )}
                      </div>

                      {/* Custom Material Addition on the fly */}
                      <div className="pt-3 border-t border-slate-200/60">
                        <div className="text-[11px] font-bold text-slate-500 mb-2">לא מצאת בקטלוג? הוסף חומר ידני לעבודה זו בלבד:</div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            placeholder="שם האביזר (למשל: מחבר מיוחד 3/4)"
                            value={customMaterialName}
                            onChange={(e) => setCustomMaterialName(e.target.value)}
                            className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white flex-1"
                          />
                          <input
                            type="number"
                            min="0"
                            placeholder="מחיר עלות סיטונאי (₪)"
                            value={customMaterialPrice}
                            onChange={(e) => setCustomMaterialPrice(e.target.value)}
                            className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white sm:w-44 text-left font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddManualMaterial(job)}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-lg shadow-sm shrink-0 transition"
                          >
                            הוסף חומר ידני
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Materials Table */}
                  {job.items.length === 0 ? (
                    <div className="text-center p-6 bg-slate-50/20 border border-dashed border-slate-150 rounded-xl text-xs text-slate-400">
                      אין עדיין חומרים ברשימת העבודה הזו. לחץ על "בחר חומרים מהקטלוג" למעלה כדי להוסיף.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-right text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 font-semibold pb-2">
                            <th className="pb-2">פריט</th>
                            <th className="pb-2 text-center w-28">כמות</th>
                            <th className="pb-2 text-left w-32">עלות סיטונאי (₪)</th>
                            <th className="pb-2 text-left w-32">ללקוח (₪ - כולל רווח)</th>
                            <th className="pb-2 text-left w-32">סה״כ ללקוח (₪)</th>
                            <th className="pb-2 w-10"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {job.items.map((item) => {
                            const markup = item.markupPercent !== undefined ? item.markupPercent : globalMarkupPercent;
                            const clientUnitPrice = item.costPrice * (1 + markup / 100);
                            const clientTotal = clientUnitPrice * item.quantity;

                            return (
                              <tr key={item.id} className="hover:bg-slate-50/30">
                                <td className="py-2.5">
                                  <div className="font-semibold text-slate-800">{item.name}</div>
                                  {item.sku && (
                                    <div className="text-[10px] text-slate-400 font-mono">מק״ט: {item.sku}</div>
                                  )}
                                </td>
                                
                                {/* Quantity selector */}
                                <td className="py-2.5 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateItemQty(job, item.id, item.quantity - 1)}
                                      className="p-1 hover:text-indigo-600 text-slate-400 rounded transition"
                                    >
                                      <MinusCircle className="w-4 h-4" />
                                    </button>
                                    <input
                                      type="number"
                                      min="1"
                                      value={item.quantity}
                                      onChange={(e) => handleUpdateItemQty(job, item.id, parseInt(e.target.value) || 1)}
                                      className="w-10 text-center font-bold bg-slate-50 border border-slate-200 rounded py-0.5 text-xs font-mono"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateItemQty(job, item.id, item.quantity + 1)}
                                      className="p-1 hover:text-indigo-600 text-slate-400 rounded transition"
                                    >
                                      <PlusCircle className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>

                                {/* Cost Price override */}
                                <td className="py-2.5 text-left">
                                  <div className="inline-flex items-center gap-1">
                                    <span className="text-[10px] text-slate-400">₪</span>
                                    <input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={item.costPrice}
                                      onChange={(e) => handleUpdateItemPrice(job, item.id, e.target.value)}
                                      className="w-16 text-left font-mono font-medium border border-transparent hover:border-slate-200 focus:border-indigo-300 rounded py-0.5 px-1 focus:bg-white bg-transparent transition"
                                    />
                                  </div>
                                </td>

                                {/* Recommended Client unit price with markup */}
                                <td className="py-2.5 text-left font-mono text-slate-600">
                                  ₪{clientUnitPrice.toFixed(1)}
                                </td>

                                {/* Client Subtotal */}
                                <td className="py-2.5 text-left font-mono font-bold text-slate-900">
                                  ₪{clientTotal.toFixed(1)}
                                </td>

                                {/* Remove item */}
                                <td className="py-2.5 text-left">
                                  <button
                                    onClick={() => handleDeleteItemFromJob(job, item.id)}
                                    className="p-1 text-slate-300 hover:text-rose-600 rounded transition"
                                    title="הסר חומר מעבודה זו"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Job Footer Card Breakdown Summary */}
                <div className="p-4 bg-slate-50/30 px-6 text-xs text-slate-500 flex flex-wrap justify-between items-center gap-4 border-t border-slate-100">
                  <div className="flex flex-wrap gap-4 font-medium text-slate-500">
                    <div>
                      עלות חומרים סיטונאית:{" "}
                      <span className="font-bold text-slate-700 font-mono">
                        ₪{totalMaterialCost.toFixed(1)}
                      </span>
                    </div>
                    <div>•</div>
                    <div>
                      חומרים ללקוח (רווח {globalMarkupPercent}%):{" "}
                      <span className="font-bold text-indigo-700 font-mono">
                        ₪{totalMaterialClientPrice.toFixed(1)}
                      </span>
                    </div>
                    <div>•</div>
                    <div>
                      עלות עבודה:{" "}
                      <span className="font-bold text-indigo-700 font-mono">
                        ₪{job.laborCost.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="font-bold text-slate-800 flex items-center gap-2">
                    <span>סה״כ עבודה {index + 1}:</span>
                    <span className="text-sm bg-indigo-50 border border-indigo-100 text-indigo-800 px-3 py-1 rounded-lg font-mono font-extrabold">
                      ₪{jobSubtotal.toFixed(1)}
                    </span>
                    {includeVat && (
                      <span className="text-[10px] text-slate-400 font-normal">
                        (₪{jobSubtotalVat.toFixed(1)} כולל מע״מ)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
