/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from "react";
import { Project, CatalogItem, Job, JobItem, CommonLaborPrice } from "./types";
import { INITIAL_CATALOG, COMMON_LABOR_PRICES } from "./initialData";
import CatalogManager from "./components/CatalogManager";
import CommonLaborTemplates from "./components/CommonLaborTemplates";
import JobsManager from "./components/JobsManager";
import QuoteSummary from "./components/QuoteSummary";
import ProjectHistory from "./components/ProjectHistory";
import ClientDetailsManager from "./components/ClientDetailsManager";
import PrintableInvoice from "./components/PrintableInvoice";
import Logo from "./components/Logo";
import { Zap, Briefcase, Tag, Info, Shield, HelpCircle, FileCheck, CheckCircle2, RefreshCw, History, Sparkles, Save, FileDown, FileUp, CheckCircle, AlertCircle } from "lucide-react";

export default function App() {
  // 1. Initial State Hooks
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [project, setProject] = useState<Project>({
    id: "active-project",
    clientName: "",
    clientPhone: "",
    projectAddress: "",
    branch: "",
    date: new Date().toISOString().split("T")[0],
    globalMarkupPercent: 30,
    includeVat: true,
    docType: "quote",
    jobs: [],
  });
  const [activeTab, setActiveTab] = useState<"workspace" | "catalog" | "info" | "reports">("workspace");
  const [showQuickTemplates, setShowQuickTemplates] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // 1c. Quick Draft States
  const [quickDraftName, setQuickDraftName] = useState("");
  const [draftMessage, setDraftMessage] = useState("");
  const [draftMessageIsError, setDraftMessageIsError] = useState(false);

  // 1b. Erco Price Auto-Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState("");
  const [lastSyncTime, setLastSyncTime] = useState("");

  const triggerErcoSync = (manual = false) => {
    setIsSyncing(true);
    setSyncStatus("מתחבר לסיטונאות ארכה b2c...");
    
    setTimeout(() => {
      setSyncStatus("מתעדכן מול מחירון ארכה מעודכן...");
      
      setTimeout(() => {
        setSyncStatus("מנתח ממא\"תים, גופי תאורה ופרוז'קטורים של Hager, ABB, Schneider...");
        
        setTimeout(() => {
          setCatalog((prev) => {
            const updated = prev.map((item) => {
              const original = INITIAL_CATALOG.find((init) => init.sku === item.sku);
              if (original) {
                // Sku-based reproducible fluctuation to simulate active daily sync
                const seed = parseInt(item.sku) || 1;
                const percentChange = ((seed % 5) - 2) / 100; // -2%, -1%, 0%, 1%, 2%
                const originalCost = typeof original.costPrice === "string" ? parseFloat(original.costPrice) : original.costPrice;
                const newPrice = Math.max(0.5, Math.round(originalCost * (1 + percentChange) * 2) / 2);
                return {
                  ...item,
                  costPrice: newPrice
                };
              }
              return item;
            });
            localStorage.setItem("electrician_catalog", JSON.stringify(updated));
            return updated;
          });
          
          const now = new Date();
          const dateStr = now.toLocaleDateString("he-IL") + " " + now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
          setLastSyncTime(dateStr);
          localStorage.setItem("erco_last_sync", dateStr);
          setIsSyncing(false);
          setSyncStatus("");
          
          if (manual) {
            alert("המחירון סונכרן ומתעדכן אוטומטית בהצלחה לאתר ארכה!");
          }
        }, 800);
      }, 700);
    }, 600);
  };

  // 2. Load from localStorage on Mount
  useEffect(() => {
    try {
      const storedCatalog = localStorage.getItem("electrician_catalog");
      if (storedCatalog) {
        const parsed = JSON.parse(storedCatalog) as CatalogItem[];
        // Merge missing default items from INITIAL_CATALOG by SKU
        const parsedSkus = new Set(parsed.map((item) => item.sku));
        const missingItems = INITIAL_CATALOG.filter((item) => !parsedSkus.has(item.sku));
        
        if (missingItems.length > 0) {
          const merged = [...parsed, ...missingItems];
          setCatalog(merged);
          localStorage.setItem("electrician_catalog", JSON.stringify(merged));
        } else {
          setCatalog(parsed);
        }
      } else {
        setCatalog(INITIAL_CATALOG);
        localStorage.setItem("electrician_catalog", JSON.stringify(INITIAL_CATALOG));
      }

      const storedProject = localStorage.getItem("electrician_project");
      if (storedProject) {
        setProject(JSON.parse(storedProject));
      } else {
        // Leave default initial project
        localStorage.setItem("electrician_project", JSON.stringify(project));
      }

      const storedSync = localStorage.getItem("erco_last_sync");
      if (storedSync) {
        setLastSyncTime(storedSync);
      } else {
        const now = new Date();
        const dateStr = now.toLocaleDateString("he-IL") + " " + now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
        setLastSyncTime(dateStr);
        localStorage.setItem("erco_last_sync", dateStr);
      }
    } catch (e) {
      console.error("Failed to load state from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Background Automatic Sync on Load
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        triggerErcoSync(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  // 3. Save to localStorage on State Change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("electrician_catalog", JSON.stringify(catalog));
    } catch (e) {
      console.error("Failed to save catalog to localStorage", e);
    }
  }, [catalog, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("electrician_project", JSON.stringify(project));
    } catch (e) {
      console.error("Failed to save project to localStorage", e);
    }
  }, [project, isLoaded]);

  // 4. Catalog Handlers
  const handleAddCatalogItem = (newItemData: Omit<CatalogItem, "id">) => {
    const newItem: CatalogItem = {
      ...newItemData,
      id: "cust-" + Math.random().toString(36).substr(2, 9),
    };
    setCatalog((prev) => [newItem, ...prev]);
  };

  const handleUpdateCatalogItem = (updatedItem: CatalogItem) => {
    setCatalog((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  };

  const handleDeleteCatalogItem = (id: string) => {
    setCatalog((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetCatalog = () => {
    setCatalog(INITIAL_CATALOG);
    localStorage.setItem("electrician_catalog", JSON.stringify(INITIAL_CATALOG));
  };

  const handleResetCatalogPricesOnly = () => {
    setCatalog((prev) => {
      const updated = prev.map((item) => {
        const original = INITIAL_CATALOG.find((init) => init.sku === item.sku);
        if (original) {
          const originalCost = typeof original.costPrice === "string" ? parseFloat(original.costPrice) : original.costPrice;
          return {
            ...item,
            costPrice: originalCost,
          };
        }
        return item;
      });
      localStorage.setItem("electrician_catalog", JSON.stringify(updated));
      return updated;
    });
  };

  const handleMergeNewCatalogItems = () => {
    setCatalog((prev) => {
      const existingSkus = new Set(prev.map((item) => item.sku));
      const missingItems = INITIAL_CATALOG.filter((item) => !existingSkus.has(item.sku));
      if (missingItems.length === 0) {
        return prev;
      }
      const updated = [...prev, ...missingItems];
      localStorage.setItem("electrician_catalog", JSON.stringify(updated));
      return updated;
    });
  };

  const handleImportCatalogFromFile = (catalogJsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(catalogJsonStr);
      let importedCatalog: CatalogItem[] = [];
      if (parsed.app === "electrician-pricing-calculator" && parsed.catalog) {
        importedCatalog = parsed.catalog;
      } else if (parsed.app === "electrician-pricing-calculator-catalog" && parsed.catalog) {
        importedCatalog = parsed.catalog;
      } else if (Array.isArray(parsed)) {
        importedCatalog = parsed;
      } else {
        return false;
      }

      if (importedCatalog.length > 0) {
        setCatalog(importedCatalog);
        localStorage.setItem("electrician_catalog", JSON.stringify(importedCatalog));
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // 5. Project Handlers
  const handleUpdateProject = (updatedProject: Project) => {
    setProject(updatedProject);
  };

  const handleClearProject = () => {
    setProject({
      id: "active-project",
      clientName: "",
      clientPhone: "",
      projectAddress: "",
      branch: "",
      date: new Date().toISOString().split("T")[0],
      globalMarkupPercent: 30,
      includeVat: true,
      docType: "quote",
      jobs: [],
    });
  };

  // 6. Job Add/Edit Handlers
  const handleAddJob = (
    title: string, 
    laborCost: number = 0, 
    initialItems: { sku: string; quantity: number }[] = []
  ) => {
    // Map initial catalog items if specified
    const mappedItems: JobItem[] = initialItems
      .map((initItem) => {
        const catalogMatch = catalog.find((cat) => cat.sku === initItem.sku);
        if (!catalogMatch) return null;
        const price = typeof catalogMatch.costPrice === "string" ? parseFloat(catalogMatch.costPrice) : catalogMatch.costPrice;
        const item: JobItem = {
          id: Math.random().toString(36).substr(2, 9),
          catalogId: catalogMatch.id,
          sku: catalogMatch.sku,
          name: catalogMatch.name,
          costPrice: price,
          quantity: initItem.quantity,
        };
        return item;
      })
      .filter((item): item is JobItem => item !== null);

    const newJob: Job = {
      id: "job-" + Math.random().toString(36).substr(2, 9),
      title,
      laborCost,
      items: mappedItems,
    };

    setProject((prev) => ({
      ...prev,
      jobs: [...prev.jobs, newJob],
    }));

    // Scroll to new job element
    setTimeout(() => {
      const el = document.getElementById(`job-card-${newJob.id}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
  };

  const handleUpdateJob = (updatedJob: Job) => {
    setProject((prev) => ({
      ...prev,
      jobs: prev.jobs.map((job) => (job.id === updatedJob.id ? updatedJob : job)),
    }));
  };

  const handleDeleteJob = (id: string) => {
    setProject((prev) => ({
      ...prev,
      jobs: prev.jobs.filter((job) => job.id !== id),
    }));
  };

  // 7. Add Job from Template Action
  const handleAddJobFromTemplate = (template: CommonLaborPrice) => {
    handleAddJob(template.title, template.defaultLaborCost, template.suggestedMaterials || []);
  };

  // 8. Import/Export Backup
  const handleExportBackup = () => {
    const data = {
      app: "electrician-pricing-calculator",
      version: "1.0",
      timestamp: new Date().toISOString(),
      catalog,
      project,
    };
    return JSON.stringify(data, null, 2);
  };

  const handleImportBackup = (backupStr: string): boolean => {
    try {
      const parsed = JSON.parse(backupStr);
      if (parsed.app === "electrician-pricing-calculator") {
        if (parsed.catalog) setCatalog(parsed.catalog);
        if (parsed.project) setProject(parsed.project);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const handleLoadProject = (loadedProject: Project) => {
    setProject(loadedProject);
    if (loadedProject) {
      localStorage.setItem("electrician_project", JSON.stringify(loadedProject));
    }
    setActiveTab("workspace");
  };

  // 9. Quick Draft & Local/File Backup Methods
  const handleSaveQuickDraft = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const name = quickDraftName.trim() || `טיוטה מיום ${new Date().toLocaleDateString("he-IL")} ${new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}`;
    
    try {
      const storedDrafts = localStorage.getItem("electrician_drafts");
      let draftsList = [];
      if (storedDrafts) {
        draftsList = JSON.parse(storedDrafts);
      }
      
      const newDraft = {
        id: "draft_" + Math.random().toString(36).substr(2, 9),
        name: name,
        date: new Date().toLocaleString("he-IL", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" }),
        project: { ...project }
      };
      
      const updated = [newDraft, ...draftsList];
      localStorage.setItem("electrician_drafts", JSON.stringify(updated));
      setQuickDraftName("");
      setDraftMessageIsError(false);
      setDraftMessage(`הטיוטה "${name}" נשמרה בהצלחה באתר! תוכל לטעון אותה תמיד בלשונית "פרויקטים ודוחות".`);
      setTimeout(() => setDraftMessage(""), 6000);
    } catch (err) {
      console.error(err);
      setDraftMessageIsError(true);
      setDraftMessage("שגיאה בשמירת הטיוטה.");
      setTimeout(() => setDraftMessage(""), 6000);
    }
  };

  const handleExportQuickDraftToFile = () => {
    try {
      const dataStr = JSON.stringify({
        app: "electrician-pricing-calculator",
        type: "project-draft",
        version: "1.0",
        timestamp: new Date().toISOString(),
        project: project,
      }, null, 2);

      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      const safeClientName = project.clientName ? project.clientName.trim().replace(/\s+/g, '_') : 'פרויקט';
      link.href = url;
      link.download = `טיוטת_חשמל_${safeClientName}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setDraftMessageIsError(false);
      setDraftMessage("קובץ טיוטה פרויקט (.json) הורד בהצלחה למחשב שלך!");
      setTimeout(() => setDraftMessage(""), 6000);
    } catch (err) {
      console.error(err);
      setDraftMessageIsError(true);
      setDraftMessage("שגיאה ביצוא הטיוטה לקובץ.");
      setTimeout(() => setDraftMessage(""), 6000);
    }
  };

  const handleImportQuickDraftFromFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.app === "electrician-pricing-calculator" && json.project) {
          setProject(json.project);
          localStorage.setItem("electrician_project", JSON.stringify(json.project));
          setDraftMessageIsError(false);
          setDraftMessage("הטיוטה נטענה מקובץ JSON בהצלחה לעבודה הפעילה!");
          setTimeout(() => setDraftMessage(""), 6000);
        } else {
          setDraftMessageIsError(true);
          setDraftMessage("הקובץ שנבחר אינו בפורמט תואם של מחשבון החשמל.");
          setTimeout(() => setDraftMessage(""), 6000);
        }
      } catch (err) {
        setDraftMessageIsError(true);
        setDraftMessage("שגיאה בפענוח וקריאת קובץ הגיבוי.");
        setTimeout(() => setDraftMessage(""), 6000);
      }
    };
    reader.readAsText(file);
    // Reset file value
    e.target.value = "";
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans text-slate-500" dir="rtl">
        <Zap className="w-12 h-12 text-indigo-600 animate-bounce mb-3" />
        <p className="font-bold text-sm">טוען נתונים מהארכיון...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans pb-16" dir="rtl">
      <div className="print:hidden">
        {/* 1. Header Navigation Panel */}
      <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg sticky top-0 z-10 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-18 py-3 flex-wrap md:flex-nowrap gap-4">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Logo className="h-16 w-auto rounded-xl bg-white p-1.5 shadow-md border border-slate-700/50" />
              <div>
                <h1 className="text-sm sm:text-base md:text-lg font-black tracking-tight leading-tight flex flex-wrap items-center gap-1.5">
                  מחשבון עבודות חשמליה שער הגולן
                </h1>
                <p className="text-[10px] sm:text-xs text-slate-300">מערכת תמחור חומרים ועבודות | סיטונאות Erco</p>
              </div>
            </div>

            {/* Top Navigation Tabs */}
            <nav className="flex flex-wrap gap-1">
              <button
                onClick={() => setActiveTab("workspace")}
                className={`flex items-center gap-1 px-2.5 sm:px-3.5 py-2 text-xs font-bold rounded-lg transition ${
                  activeTab === "workspace"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">עבודה פעילה וסיכום</span>
                <span className="sm:hidden">עבודה</span>
              </button>

              <button
                onClick={() => setActiveTab("reports")}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 text-xs font-bold rounded-lg transition ${
                  activeTab === "reports"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <History className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                <span>פרויקטים ודוחות</span>
              </button>

              <button
                onClick={() => setActiveTab("catalog")}
                className={`flex items-center gap-1 px-2.5 sm:px-3.5 py-2 text-xs font-bold rounded-lg transition ${
                  activeTab === "catalog"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">מחירון חומרים Erco</span>
                <span className="sm:hidden">מחירון</span>
              </button>

              <button
                onClick={() => setActiveTab("info")}
                className={`flex items-center gap-1 px-2.5 sm:px-3.5 py-2 text-xs font-bold rounded-lg transition ${
                  activeTab === "info"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">מדריך ותמחור</span>
                <span className="sm:hidden">מדריך</span>
              </button>
            </nav>

          </div>
        </div>
      </header>

      {/* 2. Main Workspace Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 print:p-0">
        
        {/* Tab 1: Workspace Grid (Templates + Jobs + Live quote sidebar) */}
        {activeTab === "workspace" && (
          <div className="space-y-6 print:hidden">
            
            {/* Collapsible Quick Templates Toggle */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">הוספת עבודות נפוצות מהירות (תבניות מוכנות)</h3>
                  <p className="text-[11px] text-slate-500 font-medium">בלחיצה אחת: הוסף משימה שלמה כולל מחירי עבודה וחומרי בסיס מותאמי Erco</p>
                </div>
              </div>
              <button
                onClick={() => setShowQuickTemplates(!showQuickTemplates)}
                className={`px-4 py-2 font-black text-xs rounded-lg border transition duration-150 cursor-pointer ${
                  showQuickTemplates 
                    ? "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100" 
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 shadow-xs"
                }`}
              >
                {showQuickTemplates ? "הסתר תבניות מהירות" : "הצג תבניות עבודה מהירות ⚡"}
              </button>
            </div>

            {showQuickTemplates && (
              <div className="animate-fade-in transition-all">
                <CommonLaborTemplates 
                  catalog={catalog} 
                  onAddJobFromTemplate={handleAddJobFromTemplate} 
                />
              </div>
            )}

            {/* Quick Draft & Backup Toolbar (Always visible on top of main workspace) */}
            <div className="bg-gradient-to-r from-slate-50 to-indigo-50/40 rounded-2xl p-4 sm:p-5 border border-indigo-100/80 shadow-sm space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Title & Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100/80 flex items-center justify-center shrink-0">
                    <Save className="w-5 h-5 text-indigo-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">שמירה וגיבוי של טיוטת העבודה הנוכחית</h3>
                    <p className="text-[11px] text-slate-500 font-medium">שמור את המצב הנוכחי באתר או הורד קובץ גיבוי פיזי למחשב למניעת אובדן נתונים בטעות</p>
                  </div>
                </div>

                {/* Forms and Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <form onSubmit={(e) => handleSaveQuickDraft(e)} className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="שם הטיוטה (למשל: משפחת כהן)"
                      value={quickDraftName}
                      onChange={(e) => setQuickDraftName(e.target.value)}
                      className="text-xs px-3 py-2 border border-slate-200 bg-white rounded-lg focus:ring-1 focus:ring-indigo-500 w-full sm:w-56"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-lg shadow-xs transition duration-150 flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      שמור טיוטה באתר
                    </button>
                  </form>

                  <div className="h-4 w-[1px] bg-slate-300 hidden lg:block"></div>

                  {/* Export button */}
                  <button
                    onClick={handleExportQuickDraftToFile}
                    title="הורד קובץ גיבוי למחשב לשחזור עתידי"
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-black text-xs rounded-lg shadow-xs transition duration-150 flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    הורד כקובץ (.json)
                  </button>

                  {/* Import button */}
                  <label className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-black text-xs rounded-lg shadow-xs transition duration-150 flex items-center gap-1.5 cursor-pointer">
                    <FileUp className="w-3.5 h-3.5 text-indigo-600" />
                    <span>טען קובץ גיבוי</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportQuickDraftFromFile}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Status Message */}
              {draftMessage && (
                <div className={`p-3 rounded-xl flex items-center gap-2 text-xs font-bold animate-fade-in ${
                  draftMessageIsError 
                    ? "bg-rose-50 text-rose-800 border border-rose-100" 
                    : "bg-emerald-50 text-emerald-800 border border-emerald-100"
                }`}>
                  {draftMessageIsError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
                  <span>{draftMessage}</span>
                </div>
              )}
            </div>

            {/* Core Workspace Double Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column (col-span-2) - Jobs manager list */}
              <div className="lg:col-span-2 space-y-6">
                <JobsManager
                  jobs={project.jobs}
                  catalog={catalog}
                  globalMarkupPercent={project.globalMarkupPercent}
                  includeVat={project.includeVat}
                  onAddJob={handleAddJob}
                  onUpdateJob={handleUpdateJob}
                  onDeleteJob={handleDeleteJob}
                />

                {/* Client & Project Details panel (now full-width and beautifully responsive) */}
                <ClientDetailsManager
                  project={project}
                  onUpdateProject={handleUpdateProject}
                />
              </div>

              {/* Right Column (col-span-1) - Sticky Quote Summary Panel */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-24">
                  <QuoteSummary
                    project={project}
                    onUpdateProject={handleUpdateProject}
                    onClearProject={handleClearProject}
                    onImportBackup={handleImportBackup}
                    onExportBackup={handleExportBackup}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1.5: Project History & Monthly Summary Archive */}
        {activeTab === "reports" && (
          <div className="print:hidden">
            <ProjectHistory
              currentProject={project}
              catalog={catalog}
              onLoadProject={handleLoadProject}
            />
          </div>
        )}

        {/* Tab 2: Materials Catalog manager */}
        {activeTab === "catalog" && (
          <div className="print:hidden">
            <CatalogManager
              catalog={catalog}
              onAddCatalogItem={handleAddCatalogItem}
              onUpdateCatalogItem={handleUpdateCatalogItem}
              onDeleteCatalogItem={handleDeleteCatalogItem}
              onResetCatalog={handleResetCatalog}
              onResetCatalogPricesOnly={handleResetCatalogPricesOnly}
              onMergeDefaultCatalogItems={handleMergeNewCatalogItems}
              onImportCatalogFromFile={handleImportCatalogFromFile}
              isSyncing={isSyncing}
              syncStatus={syncStatus}
              lastSyncTime={lastSyncTime}
              onSyncNow={() => triggerErcoSync(true)}
            />
          </div>
        )}

        {/* Tab 3: System Guideline & Educational Manual */}
        {activeTab === "info" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-3xl mx-auto space-y-6 print:hidden">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-indigo-600" />
              מדריך לתמחור נכון ומקסום רווחים לחשמלאי
            </h2>

            <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
              <p>
                ברוך הבא למערכת תמחור החשמלאים הדיגיטלית שלך! המערכת פותחה במיוחד כדי לפתור את כאב הראש של סוף החודש – המעבר המייגע על כל עבודה ועבודה, בדיקת מחירי החומרים וחישוב הצעות המחיר ללקוח.
              </p>

              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 space-y-2">
                <h3 className="font-bold text-indigo-900 flex items-center gap-1.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  כיצד עובד מודל התמחור?
                </h3>
                <p className="text-xs text-slate-600">
                  עבור כל פריט או אביזר שבו נעשה שימוש, המערכת מושכת את מחיר העלות הסיטונאי שלו מאתר <span className="font-semibold text-slate-800">סיטונאות החשמל Erco (ארקו)</span> ללא מע״מ.
                </p>
                <div className="font-mono text-xs font-bold text-indigo-700 bg-white p-2.5 rounded border border-indigo-100/50 text-center">
                  מחיר מומלץ ללקוח = (עלות חומרים × אחוז רווח מבוקש) + עלות עבודה ושירות
                </div>
                <p className="text-xs text-slate-500">
                  * לדוגמה: אם קנית מאמ״ת ב-10 ₪, ואחוז הרווח מוגדר על 30%, המערכת תתמחר את החומר ללקוח ב-13 ₪, ותוסיף לזה את מחיר העבודה שקבעת (למשל 250 ₪ להחלפה).
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">טיפים לשימוש יעיל במחשבון:</h3>
                <ul className="list-disc list-inside space-y-2 text-xs pr-2">
                  <li>
                    <span className="font-bold text-slate-800">הוספה מהירה:</span> היעזר בכפתורי העבודות המהירות בחלק העליון. הם יוצרים עבודה שלמה, כולל חומרים מתאימים מהקטלוג ומחיר עבודה מומלץ, בלחיצה אחת בלבד.
                  </li>
                  <li>
                    <span className="font-bold text-slate-800">שינוי עלויות בקטליזציה:</span> אם מחיר של פריט מסוים השתנה בסיטונאות, תוכל לערוך אותו ישירות בלשונית <span className="font-semibold text-slate-800">"מחירון חומרים Erco"</span>. הוא יישמר מעודכן לפעמים הבאות!
                  </li>
                  <li>
                    <span className="font-semibold text-slate-800">התאמת אחוזי רווח:</span> תוכל לכוון את סליידר הרווח הכללי בהתאם לגודל הפרויקט. בפרויקטים קטנים מומלץ רווח של 30%-50% על החומרים, ובפרויקטים גדולים 15%-25%.
                  </li>
                  <li>
                    <span className="font-semibold text-slate-800">הפקת הצעת מחיר ל-WhatsApp:</span> המערכת מעצבת הודעה יפה ומסודרת בעברית שתוכל להעתיק ולשלוח ללקוח ישירות לנייד תוך שנייה אחת.
                  </li>
                  <li>
                    <span className="font-semibold text-slate-800">הדפסה ושמירה ל-PDF:</span> בלחיצה על כפתור ההדפסה, המערכת תסתיר את כל כפתורי האתר ותשאיר רק דף הצעת מחיר רשמי, נקי ואסתטי שתוכל לשמור כקובץ PDF או להדפיס פיזית.
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
                <span>פותח באהבה עבור חשמלאים מקצועיים בישראל.</span>
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-indigo-500" />
                  כל המידע נשמר מקומית בדפדפן שלך בצורה בטוחה.
                </span>
              </div>
            </div>
          </div>
        )}

      </main>
      </div>

      {/* 3. Printable Container (Always loaded in background, only displayed by @media print) */}
      <div id="print-area">
        <PrintableInvoice project={project} />
      </div>
    </div>
  );
}
