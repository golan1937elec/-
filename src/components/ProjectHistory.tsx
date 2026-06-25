/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Project, CatalogItem } from "../types";
import { 
  History, TrendingUp, Download, Upload, Calendar, User, 
  Layers, Trash2, FolderOpen, Save, FileDown, FileUp, 
  CheckCircle, AlertCircle, RefreshCw, ChevronDown, ChevronUp, DollarSign
} from "lucide-react";

interface ProjectHistoryProps {
  currentProject: Project;
  catalog: CatalogItem[];
  onLoadProject: (project: Project) => void;
}

// Inline helper to calculate accurate project stats
function calculateProjectMetrics(project: Project, catalog: CatalogItem[]) {
  let totalCostPrice = 0;
  let totalClientPrice = 0;
  let totalLaborCost = 0;

  project.jobs.forEach((job) => {
    totalLaborCost += job.laborCost;
    job.items.forEach((item) => {
      const quantity = item.quantity || 0;
      const cost = item.costPrice || 0;
      totalCostPrice += cost * quantity;
      
      const markup = item.markupPercent !== undefined ? item.markupPercent : project.globalMarkupPercent;
      const clientPrice = cost * (1 + markup / 100);
      totalClientPrice += clientPrice * quantity;
    });
  });

  const subtotal = totalClientPrice + totalLaborCost;
  const totalWithVat = project.includeVat ? subtotal * 1.17 : subtotal;
  const netProfit = totalLaborCost + (totalClientPrice - totalCostPrice);

  return {
    materialsCost: totalCostPrice,
    materialsClient: totalClientPrice,
    laborCost: totalLaborCost,
    subtotal: subtotal,
    totalWithVat: totalWithVat,
    netProfit: netProfit,
  };
}

export default function ProjectHistory({
  currentProject,
  catalog,
  onLoadProject,
}: ProjectHistoryProps) {
  // Saved Projects List
  const [savedProjects, setSavedProjects] = useState<Project[]>([]);
  // Local Drafts List
  const [savedDrafts, setSavedDrafts] = useState<{ id: string; name: string; date: string; project: Project }[]>([]);
  
  // Form input to archive current project
  const [archiveClientName, setArchiveClientName] = useState("");
  const [archiveDate, setArchiveDate] = useState("");
  const [draftNameInput, setDraftNameInput] = useState("");
  
  // UI States
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>("all");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load history from localStorage
  useEffect(() => {
    const storedProjects = localStorage.getItem("electrician_archived_projects");
    if (storedProjects) {
      try {
        setSavedProjects(JSON.parse(storedProjects));
      } catch (e) {
        console.error("Failed to parse archived projects", e);
      }
    }

    const storedDrafts = localStorage.getItem("electrician_drafts");
    if (storedDrafts) {
      try {
        setSavedDrafts(JSON.parse(storedDrafts));
      } catch (e) {
        console.error("Failed to parse drafts", e);
      }
    }

    // Set default form values from current project
    setArchiveClientName(currentProject.clientName || "");
    const today = new Date().toISOString().split('T')[0];
    setArchiveDate(currentProject.date || today);
  }, [currentProject]);

  const triggerNotification = (msg: string, isError = false) => {
    if (isError) {
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(""), 4000);
    } else {
      setSuccessMessage(msg);
      setTimeout(() => setSuccessMessage(""), 4000);
    }
  };

  // 1. Archive Current Active Project
  const handleArchiveCurrentProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!archiveClientName.trim()) {
      triggerNotification("אנא הזן שם לקוח לשמירת הפרויקט", true);
      return;
    }

    const newArchived: Project = {
      ...currentProject,
      id: "archived_" + Math.random().toString(36).substr(2, 9),
      clientName: archiveClientName.trim(),
      date: archiveDate || new Date().toISOString().split('T')[0],
    };

    const updatedList = [newArchived, ...savedProjects];
    setSavedProjects(updatedList);
    localStorage.setItem("electrician_archived_projects", JSON.stringify(updatedList));
    
    triggerNotification("הפרויקט נשמר בהצלחה בארכיון הפרויקטים החודשי!");
  };

  // 2. Delete Archived Project
  const handleDeleteArchivedProject = (id: string, clientName: string) => {
    if (!confirm(`האם אתה בטוח שברצונך למחוק את פרויקט "${clientName}" מהארכיון?`)) return;

    const updatedList = savedProjects.filter(p => p.id !== id);
    setSavedProjects(updatedList);
    localStorage.setItem("electrician_archived_projects", JSON.stringify(updatedList));
    triggerNotification("הפרויקט נמחק מהארכיון");
  };

  // 3. Load Archived Project / Draft to Workspace
  const handleLoadToWorkspace = (project: Project, sourceName: string) => {
    if (!confirm(`טעינת פרויקט זה תחליף את העבודה הפעילה כעת במערכת. האם להמשיך?`)) return;

    onLoadProject({
      ...project,
      id: "project_active", // maintain active workspace ID
    });
    triggerNotification(`פרויקט "${sourceName}" נטען בהצלחה לעבודה פעילה!`);
  };

  // 4. Save Current Active Project as Local Draft
  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    const draftName = draftNameInput.trim() || `טיוטה מיום ${new Date().toLocaleDateString("he-IL")}`;

    const newDraft = {
      id: "draft_" + Math.random().toString(36).substr(2, 9),
      name: draftName,
      date: new Date().toLocaleString("he-IL", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" }),
      project: { ...currentProject }
    };

    const updatedDrafts = [newDraft, ...savedDrafts];
    setSavedDrafts(updatedDrafts);
    localStorage.setItem("electrician_drafts", JSON.stringify(updatedDrafts));
    setDraftNameInput("");
    triggerNotification(`הטיוטה "${draftName}" נשמרה בהצלחה באתר!`);
  };

  // 5. Delete Local Draft
  const handleDeleteDraft = (id: string, name: string) => {
    if (!confirm(`האם למחוק את הטיוטה "${name}"?`)) return;
    const updatedDrafts = savedDrafts.filter(d => d.id !== id);
    setSavedDrafts(updatedDrafts);
    localStorage.setItem("electrician_drafts", JSON.stringify(updatedDrafts));
    triggerNotification("הטיוטה נמחקה");
  };

  // 6. Export active project to JSON File
  const handleExportToFile = () => {
    const dataStr = JSON.stringify({
      app: "electrician-pricing-calculator",
      type: "project-draft",
      version: "1.0",
      timestamp: new Date().toISOString(),
      project: currentProject,
    }, null, 2);

    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    const safeClientName = currentProject.clientName ? currentProject.clientName.replace(/\s+/g, '_') : 'unnamed';
    link.href = url;
    link.download = `טיוטת_חשמל_${safeClientName}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerNotification("קובץ טיוטה הורד בהצלחה למחשב!");
  };

  // 7. Import project from JSON File
  const handleImportFromFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.app === "electrician-pricing-calculator" && json.project) {
          onLoadProject(json.project);
          triggerNotification("הפרויקט נטען מקובץ בהצלחה!");
        } else {
          triggerNotification("קובץ זה אינו בפורמט תואם של המחשבון", true);
        }
      } catch (err) {
        triggerNotification("שגיאה בקריאת הקובץ. וודא שזהו קובץ JSON תקין", true);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = ""; // reset file input
  };

  // Monthly breakdown analysis
  const getMonthlyBreakdown = () => {
    const months: Record<string, {
      name: string;
      projectsCount: number;
      revenue: number;
      materialsCost: number;
      laborCost: number;
      netProfit: number;
      projects: Project[];
    }> = {};

    savedProjects.forEach((proj) => {
      if (!proj.date) return;
      const d = new Date(proj.date);
      if (isNaN(d.getTime())) return;

      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const key = `${year}-${month.toString().padStart(2, '0')}`;
      
      const monthLabel = d.toLocaleString("he-IL", { month: "long" }) + " " + year;

      const metrics = calculateProjectMetrics(proj, catalog);

      if (!months[key]) {
        months[key] = {
          name: monthLabel,
          projectsCount: 0,
          revenue: 0,
          materialsCost: 0,
          laborCost: 0,
          netProfit: 0,
          projects: [],
        };
      }

      months[key].projectsCount += 1;
      months[key].revenue += metrics.subtotal; // Use subtotal (before VAT) or after VAT based on choice
      months[key].materialsCost += metrics.materialsCost;
      months[key].laborCost += metrics.laborCost;
      months[key].netProfit += metrics.netProfit;
      months[key].projects.push(proj);
    });

    return Object.entries(months).sort((a, b) => b[0].localeCompare(a[0]));
  };

  const monthlyBreakdown = getMonthlyBreakdown();

  // Filter archived projects based on selected month filter
  const filteredProjects = selectedMonthFilter === "all"
    ? savedProjects
    : savedProjects.filter(p => {
        if (!p.date) return false;
        const d = new Date(p.date);
        const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
        return key === selectedMonthFilter;
      });

  // Calculate overall statistics for filtered projects
  const totalFilteredStats = filteredProjects.reduce((sums, p) => {
    const m = calculateProjectMetrics(p, catalog);
    return {
      count: sums.count + 1,
      revenue: sums.revenue + m.subtotal,
      netProfit: sums.netProfit + m.netProfit,
      materialsCost: sums.materialsCost + m.materialsCost,
      laborCost: sums.laborCost + m.laborCost,
    };
  }, { count: 0, revenue: 0, netProfit: 0, materialsCost: 0, laborCost: 0 });

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl">
      
      {/* Alert Notifications */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-800 text-sm flex items-center gap-2.5 shadow-sm">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-800 text-sm flex items-center gap-2.5 shadow-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      {/* Draft Saving Tools & Auto-Save banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Save/Restore Draft Local & File */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
              <Save className="w-5 h-5 text-indigo-600" />
              מנהל טיוטות באתר (גיבוי מקומי מהיר)
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              שמור את הרישום הנוכחי כטיוטה מקומית בדפדפן כדי שתוכל לחזור אליה מאוחר יותר, או לחלופין שמור אותה לקובץ פיזי במחשב שלך.
            </p>

            <form onSubmit={handleSaveDraft} className="flex gap-2 mb-4">
              <input
                type="text"
                required
                placeholder="למשל: בית משפחת כהן - שלב א׳"
                value={draftNameInput}
                onChange={(e) => setDraftNameInput(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition shrink-0 cursor-pointer"
              >
                שמור טיוטה באתר
              </button>
            </form>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-700 mb-2">גיבוי וטעינה מקובץ (Draft JSON)</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExportToFile}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg border border-slate-200 transition cursor-pointer"
              >
                <FileDown className="w-4 h-4 text-slate-500" />
                שמור טיוטה לקובץ במחשב
              </button>

              <label className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg border border-slate-200 transition cursor-pointer">
                <FileUp className="w-4 h-4 text-slate-500" />
                טען טיוטה מקובץ במחשב
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json"
                  onChange={handleImportFromFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Current Project Archiving Box */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl shadow-md p-6 text-white flex flex-col justify-between">
          <div>
            <div className="bg-indigo-500/30 text-indigo-300 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full w-max mb-3">
              עבודה פעילה כעת
            </div>
            <h3 className="font-extrabold text-lg mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-indigo-400" />
              שמירת הפרויקט הפעיל לארכיון חודשי
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed mb-4">
              סיימת את העבודה? שמור אותה בארכיון הפרויקטים שלך! הפרויקטים השמורים בארכיון יכללו בדוחות הרווח החודשיים שלך.
            </p>

            <div className="bg-white/10 border border-white/10 rounded-xl p-3 mb-4 space-y-1">
              <div className="text-xs text-slate-300">פרטי הפרויקט הפעיל:</div>
              <div className="font-bold text-sm text-indigo-200">
                {currentProject.clientName || "לקוח ללא שם"} ({currentProject.jobs.length} עבודות כלולות)
              </div>
              <div className="font-mono text-xs text-emerald-400 font-bold">
                רווח נקי משוער לחשמלאי: ₪{calculateProjectMetrics(currentProject, catalog).netProfit.toFixed(1)}
              </div>
            </div>
          </div>

          <form onSubmit={handleArchiveCurrentProject} className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-white/10">
            <div className="sm:col-span-2">
              <input
                type="text"
                required
                placeholder="אשר/עדכן שם הלקוח..."
                value={archiveClientName}
                onChange={(e) => setArchiveClientName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-white/20 rounded-lg bg-white/10 text-white placeholder-slate-400 focus:bg-white/20 focus:ring-1 focus:ring-indigo-400"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-xs rounded-lg transition cursor-pointer flex items-center justify-center gap-1"
              >
                <Save className="w-3.5 h-3.5" />
                שמור בארכיון!
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* List of saved browser drafts */}
      {savedDrafts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-amber-500" />
            טיוטות שמורות בדפדפן ({savedDrafts.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {savedDrafts.map((draft) => {
              const metrics = calculateProjectMetrics(draft.project, catalog);
              return (
                <div key={draft.id} className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-between hover:border-indigo-200 transition">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-sm text-slate-800 line-clamp-1">{draft.name}</span>
                      <button
                        onClick={() => handleDeleteDraft(draft.id, draft.name)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                        title="מחק טיוטה"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold mb-2">{draft.date}</div>
                    
                    <div className="text-[11px] text-slate-600 space-y-1 bg-white p-2 rounded border border-slate-100/50 mb-3">
                      <div>מספר משימות: <span className="font-bold text-slate-800">{draft.project.jobs?.length || 0}</span></div>
                      <div>סך הכול ללקוח: <span className="font-bold text-indigo-600 font-mono">₪{metrics.subtotal.toFixed(1)}</span></div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleLoadToWorkspace(draft.project, draft.name)}
                    className="w-full py-1.5 bg-white hover:bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg border border-slate-200 hover:border-indigo-200 transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    טען טיוטה זו לעבודה פעילה
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Monthly Report Dashboard Board */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Header and Month Selector */}
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-950 text-lg flex items-center gap-2">
              <TrendingUp className="w-5.5 h-5.5 text-indigo-600" />
              דוחות חודשיים וסיכום פרויקטים
            </h3>
            <p className="text-slate-500 text-xs mt-1">
              סקירה עסקית של הפרויקטים שבוצעו, ממוינים לפי חודשים לחישוב ההכנסה והרווח הנקי שלך.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-slate-600">סנן לפי חודש:</span>
            <select
              value={selectedMonthFilter}
              onChange={(e) => setSelectedMonthFilter(e.target.value)}
              className="text-xs font-bold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 text-slate-800"
            >
              <option value="all">כל החודשים והפרויקטים</option>
              {monthlyBreakdown.map(([key, monthData]) => (
                <option key={key} value={key}>{monthData.name} ({monthData.projectsCount} פרויקטים)</option>
              ))}
            </select>
          </div>
        </div>

        {/* Aggregate Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-slate-100">
          <div className="p-6 border-l border-slate-100 text-right">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">מספר פרויקטים</div>
            <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
              {totalFilteredStats.count}
            </div>
            <div className="text-[10px] text-slate-400 font-semibold mt-1">בטווח שנבחר</div>
          </div>

          <div className="p-6 border-l lg:border-l border-slate-100 text-right">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">סך הכנסות (ברוטו לפני מע״מ)</div>
            <div className="text-2xl font-black text-indigo-600 mt-1 font-mono">
              ₪{totalFilteredStats.revenue.toLocaleString("he-IL", { maximumFractionDigits: 1 })}
            </div>
            <div className="text-[10px] text-indigo-500/70 font-semibold mt-1">חיוב לקוחות סופי</div>
          </div>

          <div className="p-6 border-l border-slate-100 text-right bg-emerald-50/20">
            <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">רווח נקי לחשמלאי (עבודה + רווח חומרים)</div>
            <div className="text-2xl font-black text-emerald-600 mt-1 font-mono">
              ₪{totalFilteredStats.netProfit.toLocaleString("he-IL", { maximumFractionDigits: 1 })}
            </div>
            <div className="text-[10px] text-emerald-500 font-semibold mt-1">רווח משוער נטו בכיס</div>
          </div>

          <div className="p-6 text-right">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide font-sans">עלות חומרים משולמת לספק (ארכה)</div>
            <div className="text-2xl font-black text-slate-800 mt-1 font-mono">
              ₪{totalFilteredStats.materialsCost.toLocaleString("he-IL", { maximumFractionDigits: 1 })}
            </div>
            <div className="text-[10px] text-slate-400 font-semibold mt-1">עלות חומרים ללא רווח</div>
          </div>
        </div>

        {/* Archived Projects List Table */}
        <div className="p-6">
          <h4 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-600" />
            רשימת פרויקטים בארכיון {selectedMonthFilter !== "all" ? "החודש" : ""} ({filteredProjects.length})
          </h4>

          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/30">
              <p className="text-sm font-semibold">לא נמצאו פרויקטים בארכיון.</p>
              <p className="text-xs text-slate-400 mt-1">סגור פרויקט פעיל כעת באמצעות הטופס למעלה כדי לכלול אותו בארכיון.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((proj) => {
                const metrics = calculateProjectMetrics(proj, catalog);
                const isExpanded = expandedProjectId === proj.id;

                return (
                  <div key={proj.id} className="border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition bg-white shadow-xs">
                    
                    {/* Compact row summary */}
                    <div 
                      onClick={() => setExpandedProjectId(isExpanded ? null : proj.id)}
                      className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-700 shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{proj.clientName}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-0.5"><Calendar className="w-3 h-3" /> {proj.date}</span>
                            <span>•</span>
                            <span>{proj.jobs.length} משימות/עבודות</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 self-start md:self-auto text-right">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block">סך הכל ללקוח</span>
                          <span className="font-mono text-sm font-black text-slate-800">₪{metrics.subtotal.toFixed(1)}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-emerald-800 font-bold block">רווח נקי</span>
                          <span className="font-mono text-sm font-black text-emerald-600">₪{metrics.netProfit.toFixed(1)}</span>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLoadToWorkspace(proj, proj.clientName);
                            }}
                            className="px-2.5 py-1.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-indigo-700 font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1"
                            title="טען מחדש לעבודה פעילה"
                          >
                            <FolderOpen className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">טען לעבודה פעילה</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteArchivedProject(proj.id, proj.clientName);
                            }}
                            className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition cursor-pointer"
                            title="מחק פרויקט"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className="text-slate-400 p-1">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expandable details list of jobs */}
                    {isExpanded && (
                      <div className="bg-slate-50/50 border-t border-slate-100 p-4 space-y-3">
                        <div className="text-xs font-bold text-slate-600 mb-2">פירוט עבודות וחומרים בפרויקט זה:</div>
                        
                        <div className="space-y-3">
                          {proj.jobs.map((job, jIdx) => {
                            const jobMaterialsCost = job.items.reduce((sum, item) => sum + item.costPrice * item.quantity, 0);
                            const jobMaterialsClient = job.items.reduce((sum, item) => {
                              const markup = item.markupPercent !== undefined ? item.markupPercent : proj.globalMarkupPercent;
                              return sum + item.costPrice * (1 + markup/100) * item.quantity;
                            }, 0);
                            const jobTotal = jobMaterialsClient + job.laborCost;

                            return (
                              <div key={job.id} className="bg-white border border-slate-100 p-3 rounded-lg text-xs">
                                <div className="flex items-center justify-between font-bold text-slate-800 border-b border-slate-100 pb-1.5 mb-2">
                                  <span>{jIdx + 1}. {job.title}</span>
                                  <span className="font-mono text-indigo-700">₪{jobTotal.toFixed(1)}</span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-500">
                                  <div>עלות עבודה: <span className="font-bold text-slate-700 font-mono">₪{job.laborCost}</span></div>
                                  <div>עלות חומרים: <span className="font-bold text-slate-700 font-mono">₪{jobMaterialsCost.toFixed(1)}</span></div>
                                  <div>חומרים ללקוח: <span className="font-bold text-slate-700 font-mono">₪{jobMaterialsClient.toFixed(1)}</span></div>
                                  <div>רווח נקי מעבודה זו: <span className="font-bold text-emerald-600 font-mono">₪{(job.laborCost + (jobMaterialsClient - jobMaterialsCost)).toFixed(1)}</span></div>
                                </div>
                                {job.items.length > 0 && (
                                  <div className="mt-2 pt-1.5 border-t border-dashed border-slate-100 text-[11px] text-slate-400">
                                    <span className="font-semibold text-slate-500">חומרים: </span>
                                    {job.items.map(item => `${item.name} (${item.quantity} יח')`).join(", ")}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
