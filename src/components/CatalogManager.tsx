/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { CatalogItem, PRODUCT_CATEGORIES } from "../types";
import { Search, Plus, Edit2, Check, Trash2, Tag, RefreshCw, AlertCircle, Settings, Download, Upload, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

interface CatalogManagerProps {
  catalog: CatalogItem[];
  onAddCatalogItem: (item: Omit<CatalogItem, "id">) => void;
  onUpdateCatalogItem: (updatedItem: CatalogItem) => void;
  onDeleteCatalogItem: (id: string) => void;
  onResetCatalog: () => void;
  onResetCatalogPricesOnly: () => void;
  onMergeDefaultCatalogItems: () => void;
  onImportCatalogFromFile: (catalogJsonStr: string) => boolean;
  isSyncing?: boolean;
  syncStatus?: string;
  lastSyncTime?: string;
  onSyncNow?: () => void;
}

export default function CatalogManager({
  catalog,
  onAddCatalogItem,
  onUpdateCatalogItem,
  onDeleteCatalogItem,
  onResetCatalog,
  onResetCatalogPricesOnly,
  onMergeDefaultCatalogItems,
  onImportCatalogFromFile,
  isSyncing = false,
  syncStatus = "",
  lastSyncTime = "",
  onSyncNow,
}: CatalogManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>("");
  const [editName, setEditName] = useState<string>("");
  const [editSku, setEditSku] = useState<string>("");
  const [editUnit, setEditUnit] = useState<string>("");

  // New item form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [showMaintenance, setShowMaintenance] = useState(false);
  const [maintenanceFeedback, setMaintenanceFeedback] = useState<{ text: string; isError: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newItem, setNewItem] = useState({
    sku: "",
    name: "",
    category: PRODUCT_CATEGORIES[0],
    costPrice: "",
    brand: "",
    unit: "יחידה",
  });
  const [formError, setFormError] = useState("");

  const filteredCatalog = catalog.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.includes(searchTerm) ||
      (item.brand && item.brand.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleStartEdit = (item: CatalogItem) => {
    setEditingId(item.id);
    setEditPrice(String(item.costPrice));
    setEditName(item.name);
    setEditSku(item.sku);
    setEditUnit(item.unit || "יחידה");
  };

  const handleSaveEdit = (item: CatalogItem) => {
    const numericPrice = parseFloat(editPrice);
    if (isNaN(numericPrice) || numericPrice < 0) {
      alert("נא להזין מחיר עלות תקין");
      return;
    }

    onUpdateCatalogItem({
      ...item,
      sku: editSku,
      name: editName,
      costPrice: numericPrice,
      unit: editUnit,
    });
    setEditingId(null);
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!newItem.name.trim()) {
      setFormError("נא להזין שם מוצר");
      return;
    }

    const price = parseFloat(newItem.costPrice);
    if (isNaN(price) || price < 0) {
      setFormError("נא להזין מחיר עלות חיובי");
      return;
    }

    onAddCatalogItem({
      sku: newItem.sku || Math.floor(10000 + Math.random() * 90000).toString(),
      name: newItem.name.trim(),
      category: newItem.category,
      costPrice: price,
      brand: newItem.brand.trim() || undefined,
      unit: newItem.unit,
    });

    // Reset form
    setNewItem({
      sku: "",
      name: "",
      category: selectedCategory !== "all" ? selectedCategory : PRODUCT_CATEGORIES[0],
      costPrice: "",
      brand: "",
      unit: "יחידה",
    });
    setShowAddForm(false);
  };

  const handleExportCatalog = () => {
    try {
      const data = {
        app: "electrician-pricing-calculator-catalog",
        version: "1.0",
        timestamp: new Date().toISOString(),
        catalog: catalog,
      };
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data, null, 2)
      )}`;
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", jsonString);
      downloadAnchor.setAttribute("download", `catalog_backup_${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error(err);
      alert("שגיאה בייצוא הקובץ");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === "string") {
        if (confirm("האם אתה בטוח שברצונך לייבא את הקטלוג ולהחליף את המוצרים הקיימים? כל השינויים שלא גובו יאבדו.")) {
          const success = onImportCatalogFromFile(text);
          if (success) {
            setMaintenanceFeedback({
              text: "הקטלוג יובא בהצלחה מתוך הקובץ!",
              isError: false,
            });
          } else {
            setMaintenanceFeedback({
              text: "ייבוא הקובץ נכשל. ודא שהקובץ הוא בפורמט JSON תקין של קטלוג החשמלאי.",
              isError: true,
            });
          }
        }
      }
    };
    reader.onerror = () => {
      setMaintenanceFeedback({
        text: "שגיאה בקריאת הקובץ.",
        isError: true,
      });
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div id="catalog-manager-section" className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Tag className="w-5 h-5 text-indigo-600" />
            קטלוג חומרי חשמל ומחירי עלות
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            מבוסס על מחירי העלות הסיטונאיים של Erco (ללא מע״מ). באפשרותך לעדכן מחירים או להוסיף מוצרים מותאמים אישית.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            id="btn-show-add-form"
            onClick={() => {
              setShowAddForm(!showAddForm);
              setShowMaintenance(false);
            }}
            className={`flex items-center gap-1.5 px-4 py-2 text-white font-medium text-sm rounded-lg transition ${
              showAddForm ? "bg-slate-700 hover:bg-slate-800" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            <Plus className="w-4 h-4" />
            {showAddForm ? "סגור טופס הוספה" : "הוספת מוצר חדש לקטלוג"}
          </button>
          
          <button
            id="btn-show-maintenance"
            onClick={() => {
              setShowMaintenance(!showMaintenance);
              setShowAddForm(false);
            }}
            className={`flex items-center gap-1.5 px-4 py-2 border rounded-lg text-sm font-medium transition ${
              showMaintenance
                ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-bold"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
            }`}
            title="סנכרון ותחזוקה מתקדמת לקטלוג"
          >
            <Settings className="w-4 h-4" />
            סנכרון ותחזוקה מתקדמת
            {showMaintenance ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Erco Price Live Auto-Sync Status Bar */}
      <div className="bg-indigo-50/40 border-b border-slate-100 px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {isSyncing ? (
            <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          )}
          <span className="font-semibold text-slate-800">
            {isSyncing ? (
              <span className="text-indigo-700 font-bold">{syncStatus}</span>
            ) : (
              <span>מחירון מסונכרן אוטומטית מול אתר סיטונאות <span className="text-indigo-700 font-bold">Erco (ארכה) b2c</span></span>
            )}
          </span>
          {!isSyncing && lastSyncTime && (
            <span className="text-slate-500 font-medium">
              (סונכרן לאחרונה: {lastSyncTime})
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={onSyncNow}
            disabled={isSyncing}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md border transition ${
              isSyncing
                ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
                : "bg-white hover:bg-slate-50 text-indigo-700 border-slate-200 hover:border-slate-300 shadow-xs cursor-pointer"
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
            עדכן מחירים מאתר ארכה כעת
          </button>
        </div>
      </div>

      {/* Advanced Maintenance Panel */}
      {showMaintenance && (
        <div className="p-6 bg-slate-50 border-b border-slate-200 transition">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 font-sans">
                <Settings className="w-4 h-4 text-indigo-600 animate-spin-slow" />
                מרכז עדכונים ותחזוקת קטלוג מתקדם
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-sans">
                כלים לניהול הקטלוג לאורך זמן - רענון מוצרים, גיבוי מחירי עלות וייבוא ללא צורך בעריכת קוד האתר.
              </p>
            </div>
          </div>

          {maintenanceFeedback && (
            <div className={`mb-4 p-3 rounded-lg flex items-center justify-between text-xs border font-sans ${
              maintenanceFeedback.isError 
                ? "bg-rose-50 border-rose-100 text-rose-700" 
                : "bg-emerald-50 border-emerald-100 text-emerald-700"
            }`}>
              <div className="flex items-center gap-2">
                {maintenanceFeedback.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                <span>{maintenanceFeedback.text}</span>
              </div>
              <button 
                onClick={() => setMaintenanceFeedback(null)} 
                className="text-slate-400 hover:text-slate-600 font-bold px-1.5 py-0.5 rounded"
              >
                ✕
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Action 1: Refresh list / Merge missing */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <h4 className="text-xs font-bold text-slate-800">רענון ומיזוג פריטים חדשים</h4>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal mb-4">
                  מוסיף לקטלוג שלך פריטים חדשים שנוספו למערכת בקוד (מחירון הבסיס), מבלי לפגוע במחירים הנוכחיים או בפריטים האישיים שלך.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onMergeDefaultCatalogItems();
                  setMaintenanceFeedback({
                    text: "רשימת הפריטים רועננה ומוזגה בהצלחה! כל פריט ברירת מחדל חדש שנוסף למערכת התווסף לקטלוג שלך.",
                    isError: false
                  });
                }}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-indigo-700 font-bold text-xs rounded-lg border border-slate-200 transition cursor-pointer"
              >
                רענן ומזג פריטים חדשים
              </button>
            </div>

            {/* Action 2: Reset Prices Only */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className="w-4 h-4 text-amber-500 shrink-0" />
                  <h4 className="text-xs font-bold text-slate-800">שחזור מחירי בסיס בלבד</h4>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal mb-4">
                  מעדכן את מחירי העלות של פריטי ברירת המחדל למחירי סיטונאות Erco המקוריים בקוד. שומר על מוצרים מותאמים שהוספת.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm("האם אתה בטוח שברצונך לעדכן את מחירי מוצרי ברירת המחדל חזרה למחירון הבסיס? מוצרים מותאמים אישית שהוספת יישמרו.")) {
                    onResetCatalogPricesOnly();
                    setMaintenanceFeedback({
                      text: "מחירי מוצרי ברירת המחדל שוחזרו בהצלחה למחירון הבסיס של Erco!",
                      isError: false
                    });
                  }
                }}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-indigo-700 font-bold text-xs rounded-lg border border-slate-200 transition cursor-pointer"
              >
                שחזר מחירי בסיס בלבד
              </button>
            </div>

            {/* Action 3: Backup & Import */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Download className="w-4 h-4 text-blue-500 shrink-0" />
                  <h4 className="text-xs font-bold text-slate-800">גיבוי, ייבוא וייצוא קובץ</h4>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal mb-4">
                  שמור את הקטלוג שלך כקובץ JSON מקומי או טען קובץ מוצרים חיצוני במקום להקליד ידנית או לערוך קוד.
                </p>
              </div>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleExportCatalog}
                  className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  ייצוא קובץ קטלוג
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg border border-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  ייבוא קובץ קטלוג
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".json"
                  className="hidden"
                />
              </div>
            </div>

            {/* Action 4: Full Factory Reset */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <h4 className="text-xs font-bold text-slate-800">איפוס קטלוג מלא</h4>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal mb-4">
                  מוחק לחלוטין את כל פריטי הקטלוג הקיים שלכם, כולל מוצרים שהוספתם ומשחזר מחדש את מחירון ברירת המחדל הנקי.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm("⚠️ אזהרה חמורה: פעולה זו תמחק את כל המוצרים המותאמים אישית שהוספת ואת כל עריכות המחירים שביצעת, ותחזיר את הקטלוג למחירון Erco הנקי. האם אתה בטוח?")) {
                    onResetCatalog();
                    setMaintenanceFeedback({
                      text: "הקטלוג אופס לחלוטין למצב המפעל המקורי!",
                      isError: false
                    });
                  }
                }}
                className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-lg border border-rose-200 transition cursor-pointer"
              >
                איפוס קטלוג מלא
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Item Form Drawer */}
      {showAddForm && (
        <form onSubmit={handleAddNewItem} className="p-6 bg-indigo-50/30 border-b border-indigo-100/50 transition">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-indigo-600" />
            יצירת מוצר חדש בקטלוג האישי
          </h3>

          {formError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">שם המוצר *</label>
              <input
                type="text"
                required
                placeholder="למשל: שקע חד פזי ניסקו"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">קטגוריה *</label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">מחיר עלות סיטונאי (₪) *</label>
              <input
                type="number"
                step="0.01"
                required
                min="0"
                placeholder="ללא מע״מ"
                value={newItem.costPrice}
                onChange={(e) => setNewItem({ ...newItem, costPrice: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">מק״ט (אופציונלי)</label>
              <input
                type="text"
                placeholder="ייווצר אוטומטית אם ריק"
                value={newItem.sku}
                onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">מותג/יצרן (אופציונלי)</label>
              <input
                type="text"
                placeholder="למשל: Nisko, Gewiss"
                value={newItem.brand}
                onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">יחידת מידה</label>
              <select
                value={newItem.unit}
                onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="יחידה">יחידה</option>
                <option value="מטר">מטר</option>
                <option value="חבילה">חבילה</option>
                <option value="סט">סט</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md transition"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-md shadow-sm transition"
            >
              שמור בקטלוג
            </button>
          </div>
        </form>
      )}

      {/* Filters & Search */}
      <div className="p-6 bg-slate-50/20 border-b border-slate-100 flex flex-col gap-4">
        {/* Search */}
        <div className="relative w-full">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </span>
          <input
            id="catalog-search"
            type="text"
            placeholder="חיפוש לפי שם אביזר, מותג או מק״ט..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-base pr-10 pl-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm font-sans"
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin w-full">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 text-xs font-medium rounded-full shrink-0 transition ${
              selectedCategory === "all"
                ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-200"
            }`}
          >
            הכל ({catalog.length})
          </button>
          {PRODUCT_CATEGORIES.map((cat) => {
            const count = catalog.filter((i) => i.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full shrink-0 transition ${
                  selectedCategory === cat
                    ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                    : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-200"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-xs font-semibold">
              <th className="p-4 w-24">מק״ט</th>
              <th className="p-4">שם המוצר והמותג</th>
              <th className="p-4 w-44">קטגוריה</th>
              <th className="p-4 w-28">יחידה</th>
              <th className="p-4 w-36 text-left">עלות סיטונאי (₪)</th>
              <th className="p-4 w-28 text-center">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredCatalog.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400 text-sm">
                  לא נמצאו מוצרים בקטלוג התואמים את החיפוש.
                </td>
              </tr>
            ) : (
              filteredCatalog.map((item) => {
                const isEditing = editingId === item.id;
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/50 transition ${isEditing ? "bg-indigo-50/20" : ""}`}
                  >
                    {/* SKU */}
                    <td className="p-4 font-mono text-xs text-slate-400">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editSku}
                          onChange={(e) => setEditSku(e.target.value)}
                          className="w-full text-xs px-2 py-1 border border-slate-200 rounded bg-white text-right"
                        />
                      ) : (
                        item.sku
                      )}
                    </td>

                    {/* Product Name & Brand */}
                    <td className="p-4">
                      {isEditing ? (
                        <div className="flex flex-col gap-1">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full text-sm px-2 py-1 border border-slate-200 rounded bg-white text-right font-medium"
                          />
                        </div>
                      ) : (
                        <div>
                          <span className="font-semibold text-slate-800">{item.name}</span>
                          {item.brand && (
                            <span className="mr-2 text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-medium">
                              {item.brand}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <span className="text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100 font-medium">
                        {item.category}
                      </span>
                    </td>

                    {/* Unit */}
                    <td className="p-4 text-slate-500">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editUnit}
                          onChange={(e) => setEditUnit(e.target.value)}
                          className="w-16 text-xs px-2 py-1 border border-slate-200 rounded bg-white text-right"
                        />
                      ) : (
                        item.unit || "יחידה"
                      )}
                    </td>

                    {/* Cost Price */}
                    <td className="p-4 text-left font-semibold text-slate-800">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5 justify-end">
                          <span className="text-xs text-slate-400">₪</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-20 text-xs px-2 py-1 border border-slate-200 rounded bg-white text-left font-mono font-bold"
                          />
                        </div>
                      ) : (
                        <span className="font-mono text-slate-950 font-medium">
                          ₪{Number(item.costPrice).toFixed(2)}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-1">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(item)}
                              title="שמור שינויים"
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              title="בטל"
                              className="p-1.5 text-slate-400 hover:bg-slate-50 rounded transition"
                            >
                              <RefreshCw className="w-4 h-4 rotate-180" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleStartEdit(item)}
                              title="ערוך מחיר/פרטים"
                              className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded transition"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`האם למחוק את ${item.name} מהקטלוג לחלוטין?`)) {
                                  onDeleteCatalogItem(item.id);
                                }
                              }}
                              title="מחק מוצר מהקטלוג"
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
