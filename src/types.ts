/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CatalogItem {
  id: string;
  sku: string;         // מק"ט
  name: string;        // שם המוצר
  category: string;    // קטגוריה
  costPrice: string | number;   // מחיר עלות ללא מע"מ (wholesale cost from Erco)
  brand?: string;      // מותג (לדוגמה: אלקטרו, גוויס, וגו)
  unit?: string;       // יחידת מידה (יחידה, מטר, חבילה)
}

export interface JobItem {
  id: string;          // מזהה ייחודי לפריט בתוך העבודה הספציפית
  catalogId?: string;  // קישור לקטלוג (אם קיים)
  sku?: string;        // מק"ט
  name: string;        // שם הפריט
  costPrice: number;   // מחיר עלות מעודכן לעבודה זו
  quantity: number;    // כמות שנעשה בה שימוש
  markupPercent?: number; // אחוז רווח ספציפי לפריט זה (אם שונה מהכללי)
}

export interface Job {
  id: string;
  title: string;       // שם העבודה (למשל: החלפת לוח חשמל, התקנת גוף תאורה בסלון)
  description?: string; // תיאור קצר נוסף
  laborCost: number;   // מחיר עבודה (שירות) שהחשמלאי קובע
  items: JobItem[];    // החומרים שנעשה בהם שימוש בעבודה זו
}

export interface Project {
  id: string;
  clientName: string;   // שם הלקוח
  clientPhone?: string; // טלפון הלקוח
  projectAddress?: string; // כתובת העבודה
  branch?: string;      // ענף (חדש)
  date: string;         // תאריך
  globalMarkupPercent: number; // אחוז רווח כללי מומלץ על חומרים (למשל 30%)
  includeVat: boolean;  // האם לכלול מע"מ בחישוב הסופי (17% בישראל)
  docType?: "quote" | "invoice"; // סוג מסמך: הצעת מחיר או חשבונית
  jobs: Job[];          // רשימת העבודות הכלולות בפרויקט/חודש הנוכחי
}

export interface CommonLaborPrice {
  id: string;
  title: string;        // שם העבודה הנפוצה
  defaultLaborCost: number; // מחיר עבודה מומלץ כברירת מחדל
  category: string;     // קטגוריה
  suggestedMaterials?: { sku: string; quantity: number }[]; // חומרים מומלצים לעבודה זו כברירת מחדל
}

export const PRODUCT_CATEGORIES = [
  "לוחות ארונות וקופסאות חשמל",
  "כבלי חשמל",
  "כבלי תקשורת",
  "פיקוד ובקרה",
  "מובילים",
  "מפסקים ושקעים (אביזרי קצה)",
  "נורות וספוטים",
  "גופי תאורה",
  "קבלים ורכיבי עזר"
];

export const LABOR_CATEGORIES = {
  BOARDS: "לוחות וחיבורים",
  LIGHTING: "תאורה ונורות",
  DEVICES: "אביזרי קצה ומפסקים",
  REPAIRS: "תיקונים ותקלות",
  INFRASTRUCTURE: "תשתיות וחיווט"
};
