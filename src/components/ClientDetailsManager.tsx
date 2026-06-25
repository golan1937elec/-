import React, { useState, useEffect } from "react";
import { Project } from "../types";
import { User, Phone, Calendar, Layers, Settings, Plus, Trash2, X, RotateCcw } from "lucide-react";

interface ClientDetailsManagerProps {
  project: Project;
  onUpdateProject: (updatedProject: Project) => void;
}

const DEFAULT_BRANCHES = [
  "בית הדר",
  "בית ירח",
  "בננות",
  "גד\"ש",
  "חברים",
  "חדר אוכל",
  "כלבו",
  "לול",
  "מוזיאון",
  "מזכירות",
  "מסגריה",
  "מקלטים",
  "משק ילדים",
  "נוי",
  "רפת",
  "שכירויות",
  "תאורת גדר",
  "תאורת חצר",
  "תיירות"
];

export default function ClientDetailsManager({
  project,
  onUpdateProject,
}: ClientDetailsManagerProps) {
  const { clientName = "", clientPhone = "", branch = "", date = "" } = project;

  // Persistent list of branches
  const [branches, setBranches] = useState<string[]>(() => {
    const saved = localStorage.getItem("custom_branches_list");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse custom branches", e);
      }
    }
    return DEFAULT_BRANCHES;
  });

  const [selectValue, setSelectValue] = useState(() => {
    if (!branch) return "";
    if (branches.includes(branch)) return branch;
    return "custom";
  });

  const [customValue, setCustomValue] = useState(() => {
    if (!branch) return "";
    if (branches.includes(branch)) return "";
    return branch;
  });

  // Manage Branches Modal State
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [newBranchInput, setNewBranchInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Keep state synced with parent updates
  useEffect(() => {
    if (!branch) {
      setSelectValue("");
      setCustomValue("");
    } else if (branches.includes(branch)) {
      setSelectValue(branch);
      setCustomValue("");
    } else {
      setSelectValue("custom");
      setCustomValue(branch);
    }
  }, [branch, branches]);

  const handleUpdateField = (field: keyof Project, value: any) => {
    onUpdateProject({
      ...project,
      [field]: value,
    });
  };

  const handleSelectChange = (val: string) => {
    setSelectValue(val);
    if (val === "custom") {
      onUpdateProject({
        ...project,
        branch: customValue,
      });
    } else {
      onUpdateProject({
        ...project,
        branch: val,
      });
    }
  };

  const handleCustomBranchChange = (val: string) => {
    setCustomValue(val);
    onUpdateProject({
      ...project,
      branch: val,
    });
  };

  // Branch list modification functions
  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanValue = newBranchInput.trim();
    if (!cleanValue) return;

    if (branches.includes(cleanValue)) {
      setErrorMsg("ענף זה כבר קיים ברשימה");
      return;
    }

    const updated = [...branches, cleanValue].sort((a, b) => a.localeCompare(b, "he"));
    setBranches(updated);
    localStorage.setItem("custom_branches_list", JSON.stringify(updated));
    setNewBranchInput("");
    setErrorMsg("");
  };

  const handleRemoveBranch = (branchToRemove: string) => {
    const updated = branches.filter((b) => b !== branchToRemove);
    setBranches(updated);
    localStorage.setItem("custom_branches_list", JSON.stringify(updated));

    // If the currently selected branch was removed, switch select value back to empty or custom
    if (branch === branchToRemove) {
      onUpdateProject({
        ...project,
        branch: "",
      });
    }
  };

  const handleResetBranches = () => {
    if (window.confirm("האם אתה בטוח שברצונך לשחזר את רשימת הענפים המקורית?")) {
      setBranches(DEFAULT_BRANCHES);
      localStorage.setItem("custom_branches_list", JSON.stringify(DEFAULT_BRANCHES));
      setErrorMsg("");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-indigo-100/75 p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
            <User className="w-4.5 h-4.5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-sm">פרטי הפרויקט והענף</h3>
            <p className="text-[10px] text-slate-400">הזן פרטי זיהוי ובחר ענף עבור הצעת המחיר</p>
          </div>
        </div>
        
        {/* Manage branches button */}
        <button
          type="button"
          onClick={() => setIsManageModalOpen(true)}
          className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1.5 transition"
        >
          <Settings className="w-3.5 h-3.5 text-slate-500" />
          ניהול רשימת ענפים
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Client Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-600 text-right">שם הלקוח</label>
          <div className="relative w-full">
            <input
              id="client-name-input"
              type="text"
              placeholder="למשל: משפחת כהן"
              value={clientName}
              onChange={(e) => handleUpdateField("clientName", e.target.value)}
              className="w-full text-xs px-3 py-2 pr-9 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 bg-slate-50/20 font-bold"
            />
            <User className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-[10px]" />
          </div>
        </div>

        {/* Branch / ענף */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-600 text-right">ענף</label>
          <div className="flex flex-col gap-2">
            <div className="relative w-full">
              <select
                id="branch-select"
                value={selectValue}
                onChange={(e) => handleSelectChange(e.target.value)}
                className="w-full text-xs px-3 py-2 pr-9 pl-8 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 bg-slate-50/20 font-bold text-slate-700 appearance-none"
              >
                <option value="">בחר ענף</option>
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
                <option value="custom">✍️ הקלדה חופשית (ענף אחר)</option>
              </select>
              <Layers className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-[10px] pointer-events-none" />
              <div className="absolute left-3 top-2.5 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {selectValue === "custom" && (
              <div className="relative w-full">
                <input
                  id="custom-branch-input"
                  type="text"
                  placeholder="הקלד שם ענף אחר..."
                  value={customValue}
                  onChange={(e) => handleCustomBranchChange(e.target.value)}
                  className="w-full text-xs px-3 py-2 pr-9 border border-indigo-200 rounded-lg focus:ring-1 focus:ring-indigo-500 bg-indigo-50/10 font-bold text-indigo-950"
                />
                <span className="absolute right-3 top-2 text-indigo-400 font-bold text-xs">✎</span>
              </div>
            )}
          </div>
        </div>

        {/* Client Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-600 text-right">טלפון לקוח</label>
          <div className="relative w-full">
            <input
              id="client-phone-input"
              type="text"
              placeholder="למשל: 050-1234567"
              value={clientPhone || ""}
              onChange={(e) => handleUpdateField("clientPhone", e.target.value)}
              className="w-full text-xs px-3 py-2 pr-9 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 bg-slate-50/20"
            />
            <Phone className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-[10px]" />
          </div>
        </div>

        {/* Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-600 text-right">תאריך פתיחה</label>
          <div className="relative w-full">
            <input
              id="project-date-input"
              type="date"
              value={date}
              onChange={(e) => handleUpdateField("date", e.target.value)}
              className="w-full text-xs px-3 py-2 pr-9 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 bg-slate-50/20"
            />
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-[10px]" />
          </div>
        </div>
      </div>

      {/* Modal - Manage Branches */}
      {isManageModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] overflow-hidden" dir="rtl">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-600" />
                <h4 className="font-bold text-slate-900 text-base">ניהול רשימת הענפים</h4>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsManageModalOpen(false);
                  setErrorMsg("");
                }}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content & List */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Form to Add New Branch */}
              <form onSubmit={handleAddBranch} className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">הוספת ענף חדש לרשימה:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBranchInput}
                    onChange={(e) => {
                      setNewBranchInput(e.target.value);
                      setErrorMsg("");
                    }}
                    placeholder="הקלד שם ענף (למשל: מחסן טכני)"
                    className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 font-bold"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1 transition shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    הוסף ענף
                  </button>
                </div>
                {errorMsg && (
                  <p className="text-[11px] text-red-500 font-bold">{errorMsg}</p>
                )}
              </form>

              {/* Current List Header */}
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-600">רשימת ענפים קיימת ({branches.length}):</span>
                <button
                  type="button"
                  onClick={handleResetBranches}
                  className="text-[10px] text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition"
                  title="שחזר רשימת ברירת מחדל"
                >
                  <RotateCcw className="w-3 h-3" />
                  שחזר ברירת מחדל
                </button>
              </div>

              {/* Scrollable list of existing branches */}
              <div className="grid grid-cols-2 gap-2 max-h-[40vh] overflow-y-auto pr-1">
                {branches.map((b) => (
                  <div
                    key={b}
                    className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs hover:bg-slate-100/80 transition"
                  >
                    <span className="font-semibold text-slate-800 truncate">{b}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBranch(b)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-white transition"
                      title={`מחק את ענף ${b}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsManageModalOpen(false);
                  setErrorMsg("");
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2 rounded-lg transition"
              >
                סגור
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
