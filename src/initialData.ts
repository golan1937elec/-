/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CatalogItem, CommonLaborPrice } from "./types";

export const INITIAL_CATALOG: CatalogItem[] = [
  // קטגוריה: לוחות ארונות וקופסאות חשמל
  { id: "c1", sku: "10010", name: "ממא\"ת חד-פזי Hager 10A (Premium)", category: "לוחות ארונות וקופסאות חשמל", costPrice: 14.50, brand: "Hager", unit: "יחידה" },
  { id: "c2", sku: "10016", name: "ממא\"ת חד-פזי Hager 16A (Premium)", category: "לוחות ארונות וקופסאות חשמל", costPrice: 14.50, brand: "Hager", unit: "יחידה" },
  { id: "c3", sku: "10020", name: "ממא\"ת חד-פזי Hager 20A (Premium)", category: "לוחות ארונות וקופסאות חשמל", costPrice: 16.00, brand: "Hager", unit: "יחידה" },
  { id: "c4", sku: "10025", name: "ממא\"ת חד-פזי Hager 25A (Premium)", category: "לוחות ארונות וקופסאות חשמל", costPrice: 18.00, brand: "Hager", unit: "יחידה" },
  { id: "c_h32", sku: "10032", name: "ממא\"ת חד-פזי Hager 32A (Premium)", category: "לוחות ארונות וקופסאות חשמל", costPrice: 22.00, brand: "Hager", unit: "יחידה" },
  { id: "c5", sku: "10316", name: "ממא\"ת תלת-פזי Hager 3x16A (Premium)", category: "לוחות ארונות וקופסאות חשמל", costPrice: 72.00, brand: "Hager", unit: "יחידה" },
  { id: "c6", sku: "10325", name: "ממא\"ת תלת-פזי Hager 3x25A (Premium)", category: "לוחות ארונות וקופסאות חשמל", costPrice: 78.00, brand: "Hager", unit: "יחידה" },
  { id: "c7", sku: "10340", name: "ממא\"ת תלת-פזי Hager 3x40A (Premium)", category: "לוחות ארונות וקופסאות חשמל", costPrice: 92.00, brand: "Hager", unit: "יחידה" },
  { id: "c8", sku: "11040", name: "מפסק פחת חד-פזי Hager 40A/30mA", category: "לוחות ארונות וקופסאות חשמל", costPrice: 88.00, brand: "Hager", unit: "יחידה" },
  { id: "c9", sku: "11340", name: "מפסק פחת תלת-פזי Hager 40A/30mA", category: "לוחות ארונות וקופסאות חשמל", costPrice: 145.00, brand: "Hager", unit: "יחידה" },
  { id: "c10", sku: "12040", name: "מפסק ראשי חד-פזי Hager 40A", category: "לוחות ארונות וקופסאות חשמל", costPrice: 28.00, brand: "Hager", unit: "יחידה" },
  { id: "c11", sku: "12340", name: "מפסק ראשי תלת-פזי Hager 40A", category: "לוחות ארונות וקופסאות חשמל", costPrice: 68.00, brand: "Hager", unit: "יחידה" },
  { id: "c_abb10", sku: "10011", name: "ממא\"ת חד-פזי ABB 10A", category: "לוחות ארונות וקופסאות חשמל", costPrice: 12.50, brand: "ABB", unit: "יחידה" },
  { id: "c_abb16", sku: "10017", name: "ממא\"ת חד-פזי ABB 16A", category: "לוחות ארונות וקופסאות חשמל", costPrice: 12.50, brand: "ABB", unit: "יחידה" },
  { id: "c_abb20", sku: "10021", name: "ממא\"ת חד-פזי ABB 20A", category: "לוחות ארונות וקופסאות חשמל", costPrice: 14.00, brand: "ABB", unit: "יחידה" },
  { id: "c_abb25", sku: "10026", name: "ממא\"ת חד-פזי ABB 25A", category: "לוחות ארונות וקופסאות חשמל", costPrice: 15.50, brand: "ABB", unit: "יחידה" },
  { id: "c_abb316", sku: "10317", name: "ממא\"ת תלת-פזי ABB 3x16A", category: "לוחות ארונות וקופסאות חשמל", costPrice: 64.00, brand: "ABB", unit: "יחידה" },
  { id: "c_abb325", sku: "10326", name: "ממא\"ת תלת-פזי ABB 3x25A", category: "לוחות ארונות וקופסאות חשמל", costPrice: 68.00, brand: "ABB", unit: "יחידה" },
  { id: "c_abb_f1", sku: "11041", name: "מפסק פחת חד-פזי ABB 40A/30mA", category: "לוחות ארונות וקופסאות חשמל", costPrice: 78.00, brand: "ABB", unit: "יחידה" },
  { id: "c_abb_f3", sku: "11341", name: "מפסק פחת תלת-פזי ABB 40A/30mA", category: "לוחות ארונות וקופסאות חשמל", costPrice: 125.00, brand: "ABB", unit: "יחידה" },
  { id: "c_ch10", sku: "10013", name: "ממא\"ת חד-פזי Chint 10A (Economic)", category: "לוחות ארונות וקופסאות חשמל", costPrice: 7.50, brand: "Chint", unit: "יחידה" },
  { id: "c_ch16", sku: "10019", name: "ממא\"ת חד-פזי Chint 16A (Economic)", category: "לוחות ארונות וקופסאות חשמל", costPrice: 7.50, brand: "Chint", unit: "יחידה" },
  { id: "c_ch20", sku: "10023", name: "ממא\"ת חד-פזי Chint 20A (Economic)", category: "לוחות ארונות וקופסאות חשמל", costPrice: 8.50, brand: "Chint", unit: "יחידה" },
  { id: "c_ch25", sku: "10028", name: "ממא\"ת חד-פזי Chint 25A (Economic)", category: "לוחות ארונות וקופסאות חשמל", costPrice: 8.50, brand: "Chint", unit: "יחידה" },
  { id: "c_ch316", sku: "10318", name: "ממא\"ת תלת-פזי Chint 3x16A (Economic)", category: "לוחות ארונות וקופסאות חשמל", costPrice: 32.00, brand: "Chint", unit: "יחידה" },
  { id: "c_ch325", sku: "10327", name: "ממא\"ת תלת-פזי Chint 3x25A (Economic)", category: "לוחות ארונות וקופסאות חשמל", costPrice: 35.00, brand: "Chint", unit: "יחידה" },
  { id: "c_ch_f1", sku: "11043", name: "מפסק פחת חד-פזי Chint 40A/30mA", category: "לוחות ארונות וקופסאות חשמל", costPrice: 42.00, brand: "Chint", unit: "יחידה" },
  { id: "c_ch_f3", sku: "11343", name: "מפסק פחת תלת-פזי Chint 40A/30mA", category: "לוחות ארונות וקופסאות חשמל", costPrice: 72.00, brand: "Chint", unit: "יחידה" },
  { id: "c16", sku: "15012", name: "לוח חשמל שקוע Vega (האגר) 12 מקום", category: "לוחות ארונות וקופסאות חשמל", costPrice: 65.00, brand: "Vega", unit: "יחידה" },
  { id: "c17", sku: "15024", name: "לוח חשמל שקוע Vega (האגר) 24 מקום", category: "לוחות ארונות וקופסאות חשמל", costPrice: 110.00, brand: "Vega", unit: "יחידה" },
  { id: "c18", sku: "15036", name: "לוח חשמל שקוע Vega (האגר) 36 מקום", category: "לוחות ארונות וקופסאות חשמל", costPrice: 165.00, brand: "Vega", unit: "יחידה" },
  { id: "c_v48", sku: "15048", name: "לוח חשמל שקוע Vega (האגר) 48 מקום", category: "לוחות ארונות וקופסאות חשמל", costPrice: 220.00, brand: "Vega", unit: "יחידה" },
  { id: "c_v54", sku: "15054", name: "לוח חשמל שקוע Vega (האגר) 54 מקום", category: "לוחות ארונות וקופסאות חשמל", costPrice: 280.00, brand: "Vega", unit: "יחידה" },
  { id: "c_v72", sku: "15072", name: "לוח חשמל שקוע Vega (האגר) 72 מקום", category: "לוחות ארונות וקופסאות חשמל", costPrice: 380.00, brand: "Vega", unit: "יחידה" },
  { id: "c_v12_out", sku: "15112", name: "לוח חשמל חיצוני Vega (האגר) 12 מקום", category: "לוחות ארונות וקופסאות חשמל", costPrice: 68.00, brand: "Vega", unit: "יחידה" },
  { id: "c_v24_out", sku: "15124", name: "לוח חשמל חיצוני Vega (האגר) 24 מקום", category: "לוחות ארונות וקופסאות חשמל", costPrice: 115.00, brand: "Vega", unit: "יחידה" },
  { id: "c_v36_out", sku: "15136", name: "לוח חשמל חיצוני Vega (האגר) 36 מקום", category: "לוחות ארונות וקופסאות חשמל", costPrice: 175.00, brand: "Vega", unit: "יחידה" },
  { id: "c_met40", sku: "15240", name: "ארון חשמל פח חיצוני IP65 מידה 30x40 ס\"מ", category: "לוחות ארונות וקופסאות חשמל", costPrice: 210.00, brand: "ארקו", unit: "יחידה" },
  { id: "c_met50", sku: "15250", name: "ארון חשמל פח חיצוני IP65 מידה 40x50 ס\"מ", category: "לוחות ארונות וקופסאות חשמל", costPrice: 290.00, brand: "ארקו", unit: "יחידה" },
  { id: "c80", sku: "70100", name: "קופסת חיבורים מוגנת מים עגולה כולל אטם IP55", category: "לוחות ארונות וקופסאות חשמל", costPrice: 6.80, brand: "ארקו", unit: "יחידה" },
  { id: "c81", sku: "70110", name: "קופסת חיבורים מוגנת מים 10x10 ס\"מ IP56", category: "לוחות ארונות וקופסאות חשמל", costPrice: 9.50, brand: "ארקו", unit: "יחידה" },
  { id: "c_box15", sku: "70115", name: "קופסת חיבורים מוגנת מים 15x15 ס\"מ IP56", category: "לוחות ארונות וקופסאות חשמל", costPrice: 18.50, brand: "ארקו", unit: "יחידה" },
  { id: "c_box20", sku: "70120", name: "קופסת חיבורים מוגנת מים 20x20 ס\"מ IP56", category: "לוחות ארונות וקופסאות חשמל", costPrice: 29.00, brand: "ארקו", unit: "יחידה" },
  { id: "c39", sku: "30303", name: "קופסה גוויס 3 מקום תחת הטיח (צהובה)", category: "לוחות ארונות וקופסאות חשמל", costPrice: 2.00, brand: "ארקו", unit: "יחידה" },
  { id: "c_box_g3", sku: "30313", name: "קופסה גוויס 3 מקום לגבס (כחולה)", category: "לוחות ארונות וקופסאות חשמל", costPrice: 4.80, brand: "ארקו", unit: "יחידה" },
  { id: "c40", sku: "30304", name: "קופסה גוויס 3 מקום על הטיח לבנה", category: "לוחות ארונות וקופסאות חשמל", costPrice: 6.00, brand: "ארקו", unit: "יחידה" },
  { id: "c_box_u4", sku: "30305", name: "קופסה גוויס 4 מקום תחת הטיח (צהובה)", category: "לוחות ארונות וקופסאות חשמל", costPrice: 3.50, brand: "ארקו", unit: "יחידה" },
  { id: "c_box_g4", sku: "30314", name: "קופסה גוויס 4 מקום לגבס (כחולה)", category: "לוחות ארונות וקופסאות חשמל", costPrice: 6.20, brand: "ארקו", unit: "יחידה" },
  { id: "c43", sku: "30501", name: "קופסה עגולה 55 כתומה תחת הטיח", category: "לוחות ארונות וקופסאות חשמל", costPrice: 1.20, brand: "ארקו", unit: "יחידה" },
  { id: "c_box_r55g", sku: "30502", name: "קופסה עגולה 55 לגבס כולל ציפורניים", category: "לוחות ארונות וקופסאות חשמל", costPrice: 2.80, brand: "ארקו", unit: "יחידה" },

  // קטגוריה: כבלי חשמל
  { id: "c63", sku: "60015", name: "גליל מוליך נחושת גמיש 1.5 ממ\"ר (100 מטר) שחור", category: "כבלי חשמל", costPrice: 48.00, brand: "סינרג'י", unit: "חבילה" },
  { id: "c_w15b", sku: "60016", name: "גליל מוליך נחושת גמיש 1.5 ממ\"ר (100 מטר) כחול", category: "כבלי חשמל", costPrice: 48.00, brand: "סינרג'י", unit: "חבילה" },
  { id: "c_w15br", sku: "60017", name: "גליל מוליך נחושת גמיש 1.5 ממ\"ר (100 מטר) חום", category: "כבלי חשמל", costPrice: 48.00, brand: "סינרג'י", unit: "חבילה" },
  { id: "c_w15y", sku: "60018", name: "גליל מוליך נחושת גמיש 1.5 ממ\"ר (100 מטר) הארקה צהוב/ירוק", category: "כבלי חשמל", costPrice: 48.00, brand: "סינרג'י", unit: "חבילה" },
  { id: "c64", sku: "60025", name: "גליל מוליך נחושת גמיש 2.5 ממ\"ר (100 מטר) כחול", category: "כבלי חשמל", costPrice: 78.00, brand: "סינרג'י", unit: "חבילה" },
  { id: "c_w25b", sku: "60024", name: "גליל מוליך נחושת גמיש 2.5 ממ\"ר (100 מטר) שחור", category: "כבלי חשמל", costPrice: 78.00, brand: "סינרג'י", unit: "חבילה" },
  { id: "c_w25br", sku: "60027", name: "גליל מוליך נחושת גמיש 2.5 ממ\"ר (100 מטר) חום", category: "כבלי חשמל", costPrice: 78.00, brand: "סינרג'י", unit: "חבילה" },
  { id: "c65", sku: "60026", name: "גליל מוליך נחושת גמיש 2.5 ממ\"ר (100 מטר) הארקה צהוב/ירוק", category: "כבלי חשמל", costPrice: 78.00, brand: "סינרג'י", unit: "חבילה" },
  { id: "c_w4", sku: "60040", name: "גליל מוליך נחושת גמיש 4 ממ\"ר (100 מטר) שחור", category: "כבלי חשמל", costPrice: 125.00, brand: "סינרג'י", unit: "חבילה" },
  { id: "c_w6", sku: "60060", name: "גליל מוליך נחושת גמיש 6 ממ\"ר (100 מטר) שחור", category: "כבלי חשמל", costPrice: 195.00, brand: "סינרג'י", unit: "חבילה" },
  { id: "c66", sku: "61035", name: "כבל פנדל 3x1.5 ממ\"ר לבן גמיש (גליל 100 מטר)", category: "כבלי חשמל", costPrice: 195.00, brand: "סינרג'י", unit: "חבילה" },
  { id: "c67", sku: "61036", name: "כבל פנדל 3x2.5 ממ\"ר לבן גמיש (גליל 100 מטר)", category: "כבלי חשמל", costPrice: 290.00, brand: "סינרג'י", unit: "חבילה" },
  { id: "c_p515", sku: "61055", name: "כבל פנדל 5x1.5 ממ\"ר לבן גמיש (גליל 100 מטר)", category: "כבלי חשמל", costPrice: 340.00, brand: "סינרג'י", unit: "חבילה" },
  { id: "c_p525", sku: "61056", name: "כבל פנדל 5x2.5 ממ\"ר לבן גמיש (גליל 100 מטר)", category: "כבלי חשמל", costPrice: 490.00, brand: "סינרג'י", unit: "חבילה" },
  { id: "c68", sku: "62031", name: "כבל ירוק NYY עמיד אדמה 3x1.5 ממ\"ר", category: "כבלי חשמל", costPrice: 3.80, brand: "סינרג'י", unit: "מטר" },
  { id: "c69", sku: "62032", name: "כבל ירוק NYY עמיד אדמה 3x2.5 ממ\"ר", category: "כבלי חשמל", costPrice: 5.80, brand: "סינרג'י", unit: "מטר" },
  { id: "c_nyy34", sku: "62034", name: "כבל ירוק NYY עמיד אדמה 3x4 ממ\"ר", category: "כבלי חשמל", costPrice: 8.80, brand: "סינרג'י", unit: "מטר" },
  { id: "c_nyy515", sku: "62051", name: "כבל ירוק NYY עמיד אדמה 5x1.5 ממ\"ר", category: "כבלי חשמל", costPrice: 6.20, brand: "סינרג'י", unit: "מטר" },
  { id: "c70", sku: "62052", name: "כבל ירוק NYY עמיד אדמה 5x2.5 ממ\"ר", category: "כבלי חשמל", costPrice: 9.50, brand: "סינרג'י", unit: "מטר" },
  { id: "c_nyy54", sku: "62054", name: "כבל ירוק NYY עמיד אדמה 5x4 ממ\"ר", category: "כבלי חשמל", costPrice: 14.50, brand: "סינרג'י", unit: "מטר" },
  { id: "c_nyy56", sku: "62056", name: "כבל ירוק NYY עמיד אדמה 5x6 ממ\"ר", category: "כבלי חשמל", costPrice: 19.80, brand: "סינרג'י", unit: "מטר" },
  { id: "c_nyy510", sku: "62058", name: "כבל ירוק NYY עמיד אדמה 5x10 ממ\"ר", category: "כבלי חשמל", costPrice: 32.50, brand: "סינרג'י", unit: "מטר" },
  { id: "c_nyy516", sku: "62059", name: "כבל ירוק NYY עמיד אדמה 5x16 ממ\"ר", category: "כבלי חשמל", costPrice: 48.00, brand: "סינרג'י", unit: "מטר" },
  { id: "c_xl54", sku: "62154", name: "כבל כוח XLPE שחור 5x4 ממ\"ר", category: "כבלי חשמל", costPrice: 12.80, brand: "סינרג'י", unit: "מטר" },
  { id: "c_xl56", sku: "62156", name: "כבל כוח XLPE שחור 5x6 ממ\"ר", category: "כבלי חשמל", costPrice: 17.50, brand: "סינרג'י", unit: "מטר" },
  { id: "c_xl510", sku: "62158", name: "כבל כוח XLPE שחור 5x10 ממ\"ר", category: "כבלי חשמל", costPrice: 28.50, brand: "סינרג'י", unit: "מטר" },
  { id: "c_xl516", sku: "62159", name: "כבל כוח XLPE שחור 5x16 ממ\"ר", category: "כבלי חשמל", costPrice: 42.00, brand: "סינרג'י", unit: "מטר" },
  { id: "c_sil315", sku: "62231", name: "כבל סיליקון חסין אש אדום 3x1.5 ממ\"ר", category: "כבלי חשמל", costPrice: 11.50, brand: "ארקו", unit: "מטר" },

  // קטגוריה: כבלי תקשורת
  { id: "c_tel1", sku: "80001", name: "כבל טלפון 4 גידים מקצועי", category: "כבלי תקשורת", costPrice: 1.50, brand: "Teldor", unit: "מטר" },
  { id: "c_tel_2z", sku: "80011", name: "כבל טלפון 2 זוגות (4 מוליכים)", category: "כבלי תקשורת", costPrice: 1.10, brand: "Teldor", unit: "מטר" },
  { id: "c_tel2", sku: "80002", name: "כבל רשת ותקשורת CAT6 FTP", category: "כבלי תקשורת", costPrice: 2.20, brand: "Teldor", unit: "מטר" },
  { id: "c_tel3", sku: "80003", name: "כבל רשת סופר-מהיר CAT7 S/FTP", category: "כבלי תקשורת", costPrice: 3.50, brand: "Teldor", unit: "מטר" },
  { id: "c_tel2_roll", sku: "80022", name: "גליל כבל רשת CAT6 FTP (305 מטר)", category: "כבלי תקשורת", costPrice: 420.00, brand: "Teldor", unit: "חבילה" },
  { id: "c_tel3_roll", sku: "80033", name: "גליל כבל רשת CAT7 S/FTP (305 מטר)", category: "כבלי תקשורת", costPrice: 780.00, brand: "Teldor", unit: "חבילה" },
  { id: "c_coax6", sku: "80007", name: "כבל קואקסיאלי RG6 איכותי לטלוויזיה ויס", category: "כבלי תקשורת", costPrice: 1.80, brand: "Teldor", unit: "מטר" },
  { id: "c_fiber", sku: "80008", name: "כבל סיב אופטי חד-מוד קשיח לתשתית חוץ", category: "כבלי תקשורת", costPrice: 4.80, brand: "סינרג'י", unit: "מטר" },
  { id: "c_tel9", sku: "80009", name: "ארון תקשורת ביתי שקוע 12 אינץ'", category: "כבלי תקשורת", costPrice: 180.00, brand: "Vega", unit: "יחידה" },
  { id: "c_tel_p12", sku: "80010", name: "פנל ניתוב (Patch Panel) 12 פורטים CAT6", category: "כבלי תקשורת", costPrice: 75.00, brand: "ארקו", unit: "יחידה" },

  // קטגוריה: פיקוד ובקרה
  { id: "c14", sku: "14025", name: "קונטקטור (מגען) 25A חד-פזי ללוח", category: "פיקוד ובקרה", costPrice: 38.00, brand: "Hager", unit: "יחידה" },
  { id: "c15", sku: "14040", name: "קונטקטור (מגען) 40A תלת-פזי ללוח", category: "פיקוד ובקרה", costPrice: 65.00, brand: "Hager", unit: "יחידה" },
  { id: "c_con63", sku: "14063", name: "קונטקטור (מגען) 63A תלת-פזי ללוח", category: "פיקוד ובקרה", costPrice: 120.00, brand: "Hager", unit: "יחידה" },
  { id: "c13", sku: "13002", name: "שעון שבת מכני ללוח (קוצב זמן/טיימר)", category: "פיקוד ובקרה", costPrice: 45.00, brand: "גרלין", unit: "יחידה" },
  { id: "c_timer_dig", sku: "13003", name: "שעון שבת דיגיטלי שבועי ללוח", category: "פיקוד ובקרה", costPrice: 135.00, brand: "Hager", unit: "יחידה" },
  { id: "c12", sku: "13001", name: "מגן ברקים ונחשולי מתח חד-פזי ללוח", category: "פיקוד ובקרה", costPrice: 75.00, brand: "Arco", unit: "יחידה" },
  { id: "c_spd3", sku: "13004", name: "מגן ברקים ונחשולי מתח תלת-פזי ללוח (SPD)", category: "פיקוד ובקרה", costPrice: 190.00, brand: "Arco", unit: "יחידה" },
  { id: "c_photo", sku: "14100", name: "עינית פוטוצל (ממסר אור) חיצוני 16A IP65", category: "פיקוד ובקרה", costPrice: 38.00, brand: "ארקו", unit: "יחידה" },
  { id: "c_step16", sku: "14200", name: "ממסר צעד (אימפולס) 16A ללוח", category: "פיקוד ובקרה", costPrice: 48.00, brand: "Hager", unit: "יחידה" },
  { id: "c_switch12", sku: "14300", name: "מפסק בורר מצבים ידני 1-0-2 חד-פזי ללוח", category: "פיקוד ובקרה", costPrice: 52.00, brand: "Hager", unit: "יחידה" },
  { id: "c_switch32", sku: "14302", name: "מפסק בורר מצבים ידני 1-0-2 תלת-פזי ללוח", category: "פיקוד ובקרה", costPrice: 110.00, brand: "Hager", unit: "יחידה" },
  { id: "c_thermo", sku: "14400", name: "טרמוסטט / בקר טמפרטורה דיגיטלי ללוח", category: "פיקוד ובקרה", costPrice: 145.00, brand: "ארקו", unit: "יחידה" },
  { id: "c_lamp_red", sku: "14500", name: "נורת סימון ללוח אדומה", category: "פיקוד ובקרה", costPrice: 12.00, brand: "Hager", unit: "יחידה" },
  { id: "c_lamp_grn", sku: "14501", name: "נורת סימון ללוח ירוקה", category: "פיקוד ובקרה", costPrice: 12.00, brand: "Hager", unit: "יחידה" },
  { id: "c_liycy4", sku: "14604", name: "כבל פיקוד מסוכך LiYCY 4x0.75 ממ\"ר", category: "פיקוד ובקרה", costPrice: 4.80, brand: "Teldor", unit: "מטר" },
  { id: "c_liycy7", sku: "14607", name: "כבל פיקוד מסוכך LiYCY 7x0.75 ממ\"ר", category: "פיקוד ובקרה", costPrice: 7.20, brand: "Teldor", unit: "מטר" },
  { id: "c_liycy12", sku: "14612", name: "כבל פיקוד מסוכך LiYCY 12x0.75 ממ\"ר", category: "פיקוד ובקרה", costPrice: 11.50, brand: "Teldor", unit: "מטר" },

  // קטגוריה: מובילים
  { id: "c71", sku: "63020", name: "צינור מריכף פלסטיק כבה מאליו קוטר 20 (חבילה 50 מטר)", category: "מובילים", costPrice: 45.00, brand: "מריכף", unit: "חבילה" },
  { id: "c72", sku: "63025", name: "צינור מריכף פלסטיק כבה מאליו קוטר 25 (חבילה 50 מטר)", category: "מובילים", costPrice: 62.00, brand: "מריכף", unit: "חבילה" },
  { id: "c_mar32", sku: "63032", name: "צינור מריכף פלסטיק כבה מאליו קוטר 32 (חבילה 50 מטר)", category: "מובילים", costPrice: 95.00, brand: "מריכף", unit: "חבילה" },
  { id: "c_sh20", sku: "63120", name: "צינור שרשורי כבה מאליו קוטר 20 (גליל 50 מטר)", category: "מובילים", costPrice: 38.00, brand: "ארקו", unit: "חבילה" },
  { id: "c_sh25", sku: "63125", name: "צינור שרשורי כבה מאליו קוטר 25 (גליל 50 מטר)", category: "מובילים", costPrice: 52.00, brand: "ארקו", unit: "חבילה" },
  { id: "c_shg50", sku: "63250", name: "צינור מריכוף ירוק תת-קרקעי קוטר 50 מ\"מ", category: "מובילים", costPrice: 5.50, brand: "מריכף", unit: "מטר" },
  { id: "c_shg75", sku: "63275", name: "צינור מריכוף ירוק תת-קרקעי קוטר 75 מ\"מ", category: "מובילים", costPrice: 8.20, brand: "מריכף", unit: "מטר" },
  { id: "c73", sku: "64010", name: "תעלת אצבע פלסטיק הדבקה עצמית 10x20 מ\"מ (2 מטר)", category: "מובילים", costPrice: 3.50, brand: "ארקו", unit: "יחידה" },
  { id: "c74", sku: "64016", name: "תעלת פלסטיק לבנה 16x16 מ\"מ (אורך 2 מטר)", category: "מובילים", costPrice: 4.20, brand: "ארקו", unit: "יחידה" },
  { id: "c_t25", sku: "64025", name: "תעלת פלסטיק לבנה 25x38 מ\"מ (אורך 2 מטר)", category: "מובילים", costPrice: 8.50, brand: "ארקו", unit: "יחידה" },
  { id: "c75", sku: "64040", name: "תעלת פלסטיק לבנה 40x40 מ\"מ (אורך 2 מטר)", category: "מובילים", costPrice: 12.00, brand: "ארקו", unit: "יחידה" },
  { id: "c_t60", sku: "64060", name: "תעלת פלסטיק לבנה 60x40 מ\"מ (אורך 2 מטר)", category: "מובילים", costPrice: 18.00, brand: "ארקו", unit: "יחידה" },
  { id: "c_t100", sku: "64100", name: "תעלת פלסטיק לבנה 100x60 מ\"מ (אורך 2 מטר)", category: "מובילים", costPrice: 32.00, brand: "ארקו", unit: "יחידה" },
  { id: "c_coup20", sku: "65020", name: "קופלונג (מחבר) מהיר לצינור 20 מ\"מ", category: "מובילים", costPrice: 0.80, brand: "ארקו", unit: "יחידה" },
  { id: "c_coup25", sku: "65025", name: "קופלונג (מחבר) מהיר לצינור 25 מ\"מ", category: "מובילים", costPrice: 1.10, brand: "ארקו", unit: "יחידה" },
  { id: "c_clip20", sku: "65120", name: "חובק קליפס פלסטיק לצינור 20 מ\"מ", category: "מובילים", costPrice: 0.60, brand: "ארקו", unit: "יחידה" },
  { id: "c_clip25", sku: "65125", name: "חובק קליפס פלסטיק לצינור 25 מ\"מ", category: "מובילים", costPrice: 0.80, brand: "ארקו", unit: "יחידה" },
  { id: "c_pasta", sku: "65200", name: "סטלבנד (פסטה) פלדה למשיכת חוטים 15 מטר", category: "מובילים", costPrice: 48.00, brand: "ארקו", unit: "יחידה" },

  // קטגוריה: מפסקים ושקעים (אביזרי קצה)
  { id: "c28", sku: "30001", name: "מפסק יחיד גוויס לבן", category: "מפסקים ושקעים (אביזרי קצה)", costPrice: 4.50, brand: "גוויס (Gewiss)", unit: "יחידה" },
  { id: "c29", sku: "30002", name: "מפסק כפול גוויס לבן", category: "מפסקים ושקעים (אביזרי קצה)", costPrice: 7.20, brand: "גוויס (Gewiss)", unit: "יחידה" },
  { id: "c30", sku: "30003", name: "מפסק מחליף גוויס לבן", category: "מפסקים ושקעים (אביזרי קצה)", costPrice: 6.50, brand: "גוויס (Gewiss)", unit: "יחידה" },
  { id: "c31", sku: "30010", name: "שקע ישראלי חד-פזי גוויס לבן", category: "מפסקים ושקעים (אביזרי קצה)", costPrice: 5.80, brand: "גוויס (Gewiss)", unit: "יחידה" },
  { id: "c32", sku: "30011", name: "שקע כוח 16A גוויס לבן (מכונות כוח/תנור)", category: "מפסקים ושקעים (אביזרי קצה)", costPrice: 8.50, brand: "גוויס (Gewiss)", unit: "יחידה" },
  { id: "c33", sku: "30020", name: "מפסק תריס חשמלי גוויס לבן", category: "מפסקים ושקעים (אביזרי קצה)", costPrice: 12.00, brand: "גוויס (Gewiss)", unit: "יחידה" },
  { id: "c34", sku: "30030", name: "מפסק דוד (בוילר) דו-פול גוויס עם נורת ביקורת", category: "מפסקים ושקעים (אביזרי קצה)", costPrice: 14.00, brand: "גוויס (Gewiss)", unit: "יחידה" },
  { id: "c35", sku: "30103", name: "מתאם גוויס 3 מקום לבן", category: "מפסקים ושקעים (אביזרי קצה)", costPrice: 2.50, brand: "גוויס (Gewiss)", unit: "יחידה" },
  { id: "c36", sku: "30104", name: "מתאם גוויס 4 מקום לבן", category: "מפסקים ושקעים (אביזרי קצה)", costPrice: 3.50, brand: "גוויס (Gewiss)", unit: "יחידה" },
  { id: "c37", sku: "30203", name: "פנל/מסגרת פלסטיק גוויס 3 מקום לבנה", category: "מפסקים ושקעים (אביזרי קצה)", costPrice: 3.80, brand: "גוויס (Gewiss)", unit: "יחידה" },
  { id: "c38", sku: "30204", name: "פנל/מסגרת פלסטיק גוויס 4 מקום לבנה", category: "מפסקים ושקעים (אביזרי קצה)", costPrice: 4.80, brand: "גוויס (Gewiss)", unit: "יחידה" },
  { id: "c41", sku: "30400", name: "שקע שירות חיצוני מוגן מים IP55 יחיד", category: "מפסקים ושקעים (אביזרי קצה)", costPrice: 12.50, brand: "ארקו", unit: "יחידה" },
  { id: "c42", sku: "30401", name: "שקע שירות חיצוני מוגן מים IP55 כפול", category: "מפסקים ושקעים (אביזרי קצה)", costPrice: 22.00, brand: "ארקו", unit: "יחידה" },
  { id: "c_ns1", sku: "30601", name: "מפסק יחיד ניסקו לבן", category: "מפסקים ושקעים (אביזרי קצה)", costPrice: 4.20, brand: "ניסקו (Nisko)", unit: "יחידה" },
  { id: "c_ns2", sku: "30602", name: "שקע ישראלי כפול ניסקו לבן", category: "מפסקים ושקעים (אביזרי קצה)", costPrice: 9.80, brand: "ניסקו (Nisko)", unit: "יחידה" },
  { id: "c_ns3", sku: "30603", name: "מפסק דוד ניסקו שלם", category: "מפסקים ושקעים (אביזרי קצה)", costPrice: 19.50, brand: "ניסקו (Nisko)", unit: "יחידה" },
  { id: "c78", sku: "70023", name: "חבילת מהדקי חיבור קפיציים מהירים WAGO 3 מגעים (50 יח')", category: "מפסקים ושקעים (אביזרי קצה)", costPrice: 38.00, brand: "WAGO", unit: "חבילה" },
  { id: "c79", sku: "70025", name: "חבילת מהדקי חיבור קפיציים מהירים WAGO 5 מגעים (25 יח')", category: "מפסקים ושקעים (אביזרי קצה)", costPrice: 28.00, brand: "WAGO", unit: "חבילה" },
  { id: "c_wago2", sku: "70022", name: "חבילת מהדקי חיבור קפיציים מהירים WAGO 2 מגעים (100 יח')", category: "מפסקים ושקעים (אביזרי קצה)", costPrice: 45.00, brand: "WAGO", unit: "חבילה" },

  // קטגוריה: נורות וספוטים
  { id: "c44", sku: "40012", name: "נורת לד Osram E27 12W אור חם", category: "נורות וספוטים", costPrice: 4.80, brand: "Osram", unit: "יחידה" },
  { id: "c45", sku: "40013", name: "נורת לד Osram E27 12W אור קר", category: "נורות וספוטים", costPrice: 4.80, brand: "Osram", unit: "יחידה" },
  { id: "c46", sku: "40015", name: "נורת לד Osram E27 15W אור חם", category: "נורות וספוטים", costPrice: 6.20, brand: "Osram", unit: "יחידה" },
  { id: "c47", sku: "40016", name: "נורת לד Osram E27 15W אור קר", category: "נורות וספוטים", costPrice: 6.20, brand: "Osram", unit: "יחידה" },
  { id: "c48", sku: "40106", name: "נורת לד נר Philips E14 6W אור חם", category: "נורות וספוטים", costPrice: 3.90, brand: "Philips", unit: "יחידה" },
  { id: "c49", sku: "40205", name: "נורת ספוט לד Osram GU10 5W אור חם", category: "נורות וספוטים", costPrice: 4.20, brand: "Osram", unit: "יחידה" },
  { id: "c50", sku: "40207", name: "נורת ספוט לד Osram GU10 7W אור חם", category: "נורות וספוטים", costPrice: 5.50, brand: "Osram", unit: "יחידה" },
  { id: "c_t8", sku: "40220", name: "נורת פלורסנט לד T8 זכוכית 1.2 מטר 18W", category: "נורות וספוטים", costPrice: 9.80, brand: "Philips", unit: "יחידה" },
  { id: "c51", sku: "40300", name: "בית מנורה פלסטיק ישר לבן E27", category: "נורות וספוטים", costPrice: 2.50, brand: "ארקו", unit: "יחידה" },
  { id: "c52", sku: "40301", name: "בית מנורה פלסטיק זווית לבן E27", category: "נורות וספוטים", costPrice: 2.80, brand: "ארקו", unit: "יחידה" },
  { id: "c53", sku: "40305", name: "בית מנורה זמני לבנייה (חצי מטר חוט + בית נורה)", category: "נורות וספוטים", costPrice: 1.50, brand: "ארקו", unit: "יחידה" },

  // קטגוריה: גופי תאורה
  { id: "c54", sku: "50024", name: "גוף תאורה לד עגול צמוד תקרת 24W IP54", category: "גופי תאורה", costPrice: 24.00, brand: "ארקו", unit: "יחידה" },
  { id: "c55", sku: "50036", name: "גוף תאורה לד עגול צמוד תקרת 36W IP54", category: "גופי תאורה", costPrice: 38.00, brand: "ארקו", unit: "יחידה" },
  { id: "c_led48", sku: "50048", name: "גוף תאורה לד עגול צמוד תקרת 48W IP54", category: "גופי תאורה", costPrice: 48.00, brand: "ארקו", unit: "יחידה" },
  { id: "c56", sku: "50112", name: "גוף תאורה לד מוגן מים סלים 1.2 מטר 36W", category: "גופי תאורה", costPrice: 35.00, brand: "ארקו", unit: "יחידה" },
  { id: "c57", sku: "50115", name: "גוף תאורה לד מוגן מים סלים 1.5 מטר 48W", category: "גופי תאורה", costPrice: 48.00, brand: "ארקו", unit: "יחידה" },
  { id: "c58", sku: "50240", name: "פנל לד 60x60 ס\"מ 40W שקוע/צמוד תקרת גבס", category: "גופי תאורה", costPrice: 65.00, brand: "ארקו", unit: "יחידה" },
  { id: "c59", sku: "50312", name: "גוף תאורה לד שקוע תקרת גבס 12W עגול לבן", category: "גופי תאורה", costPrice: 14.00, brand: "ארקו", unit: "יחידה" },
  { id: "c_flood30", sku: "50430", name: "פרוז'קטור לד חיצוני עוצמתי 30W IP65", category: "גופי תאורה", costPrice: 28.00, brand: "ארקו", unit: "יחידה" },
  { id: "c54_fl50", sku: "50450", name: "פרוז'קטור לד חיצוני עוצמתי 50W IP65", category: "גופי תאורה", costPrice: 42.00, brand: "ארקו", unit: "יחידה" },
  { id: "c54_fl100", sku: "50499", name: "פרוז'קטור לד חיצוני עוצמתי 100W IP65", category: "גופי תאורה", costPrice: 78.00, brand: "ארקו", unit: "יחידה" },
  { id: "c_flood150", sku: "50460", name: "פרוז'קטור לד חיצוני עוצמתי 150W IP65", category: "גופי תאורה", costPrice: 110.00, brand: "ארקו", unit: "יחידה" },
  { id: "c_flood200", sku: "50470", name: "פרוז'קטור לד חיצוני עוצמתי 200W IP65", category: "גופי תאורה", costPrice: 145.00, brand: "ארקו", unit: "יחידה" },
  { id: "c_flood_sns", sku: "50480", name: "פרוז'קטור לד 50W מוגן מים כולל גלאי נפח ותנועה", category: "גופי תאורה", costPrice: 59.00, brand: "ארקו", unit: "יחידה" },

  // קטגוריה: קבלים ורכיבי עזר
  { id: "c19", sku: "20015", name: "קבל עבודה 1.5uF ללא חוטים (מאוורר תקרה)", category: "קבלים ורכיבי עזר", costPrice: 8.00, brand: "ארקו", unit: "יחידה" },
  { id: "c21", sku: "20025", name: "קבל עבודה 2.5uF כולל חוטים (מאוורר תקרה)", category: "קבלים ורכיבי עזר", costPrice: 10.50, brand: "ארקו", unit: "יחידה" },
  { id: "c25", sku: "20100", name: "קבל עבודה 35uF למנוע/מזגן (קבל מדחס)", category: "קבלים ורכיבי עזר", costPrice: 18.00, brand: "ארקו", unit: "יחידה" },
  { id: "c26", sku: "20125", name: "קבל עבודה 45uF למנוע/מזגן (קבל מדחס)", category: "קבלים ורכיבי עזר", costPrice: 22.00, brand: "ארקו", unit: "יחידה" },
  { id: "c_fuse10", sku: "20910", name: "פיוז חרסינה 10A ללוח ישן חבילה", category: "קבלים ורכיבי עזר", costPrice: 12.00, brand: "ארקו", unit: "חבילה" },
  { id: "c_fuse16", sku: "20916", name: "פיוז חרסינה 16A ללוח ישן חבילה", category: "קבלים ורכיבי עזר", costPrice: 12.00, brand: "ארקו", unit: "חבילה" },

  // תוספות עבור קטגוריית לוחות ארונות וקופסאות חשמל
  { id: "c_add1", sku: "15901", name: "פקק ללוח חשמל Hager (חבילה של 6 יחידות)", category: "לוחות ארונות וקופסאות חשמל", costPrice: 12.00, brand: "Hager", unit: "חבילה" },
  { id: "c_add2", sku: "15902", name: "פס צבירה אפס/הארקה נחושת 7 חורים", category: "לוחות ארונות וקופסאות חשמל", costPrice: 7.50, brand: "ארקו", unit: "יחידה" },
  { id: "c_add3", sku: "15903", name: "פס צבירה אפס/הארקה נחושת 12 חורים", category: "לוחות ארונות וקופסאות חשמל", costPrice: 12.00, brand: "ארקו", unit: "יחידה" },
  { id: "c_add4", sku: "15904", name: "פס גישור תלת-פזי 12 מקומות (שן) Hager", category: "לוחות ארונות וקופסאות חשמל", costPrice: 32.00, brand: "Hager", unit: "יחידה" },
  { id: "c_add5", sku: "15905", name: "פס גישור חד-פזי 12 מקומות (שן) Hager", category: "לוחות ארונות וקופסאות חשמל", costPrice: 14.00, brand: "Hager", unit: "יחידה" },
  { id: "c_add6", sku: "30306", name: "קופסה גוויס 6 מקום תחת הטיח", category: "לוחות ארונות וקופסאות חשמל", costPrice: 4.50, brand: "ארקו", unit: "יחידה" },
  { id: "c_add7", sku: "30316", name: "קופסה גוויס 6 מקום לגבס", category: "לוחות ארונות וקופסאות חשמל", costPrice: 8.50, brand: "ארקו", unit: "יחידה" },
  { id: "c_add8", sku: "30326", name: "קופסה גוויס 6 מקום על הטיח לבנה", category: "לוחות ארונות וקופסאות חשמל", costPrice: 10.55, brand: "ארקו", unit: "יחידה" },
  { id: "c_add9", sku: "15909", name: "מהדק חיבור מסילה ללוח DIN קוטר 10 ממ\"ר", category: "לוחות ארונות וקופסאות חשמל", costPrice: 3.50, brand: "Hager", unit: "יחידה" },
  { id: "c_add10", sku: "15910", name: "שקע שירות ללוח חשמל (הרכבה על מסילת DIN)", category: "לוחות ארונות וקופסאות חשמל", costPrice: 18.00, brand: "Hager", unit: "יחידה" },

  // תוספות עבור קטגוריית כבלי חשמל
  { id: "c_add11", sku: "60031", name: "גליל מוליך נחושת קשיח (H07V-U) 1.5 ממ\"ר (100 מטר) שחור", category: "כבלי חשמל", costPrice: 42.00, brand: "סינרג'י", unit: "חבילה" },
  { id: "c_add12", sku: "60032", name: "גליל מוליך נחושת קשיח (H07V-U) 1.5 ממ\"ר (100 מטר) כחול", category: "כבלי חשמל", costPrice: 42.00, brand: "סינרג'י", unit: "חבילה" },
  { id: "c_add13", sku: "60033", name: "גליל מוליך נחושת קשיח (H07V-U) 1.5 ממ\"ר (100 מטר) חום", category: "כבלי חשמל", costPrice: 42.00, brand: "סינרג'י", unit: "חבילה" },
  { id: "c_add14", sku: "60034", name: "גליל מוליך נחושת קשיח (H07V-U) 1.5 ממ\"ר (100 מטר) צהוב/ירוק", category: "כבלי חשמל", costPrice: 42.00, brand: "סינרג'י", unit: "חבילה" },
  { id: "c_add15", sku: "60035", name: "גליל מוליך נחושת קשיח (H07V-U) 2.5 ממ\"ר (100 מטר) שחור", category: "כבלי חשמל", costPrice: 68.00, brand: "סינרג'י", unit: "חבילה" },
  { id: "c_add16", sku: "60036", name: "גליל מוליך נחושת קשיח (H07V-U) 2.5 ממ\"ר (100 מטר) כחול", category: "כבלי חשמל", costPrice: 68.00, brand: "סינרג'י", unit: "חבילה" },
  { id: "c_add17", sku: "60037", name: "גליל מוליך נחושת קשיח (H07V-U) 2.5 ממ\"ר (100 מטר) חום", category: "כבלי חשמל", costPrice: 68.00, brand: "סינרג'י", unit: "חבילה" },
  { id: "c_add18", sku: "60038", name: "גליל מוליך נחושת קשיח (H07V-U) 2.5 ממ\"ר (100 מטר) צהוב/ירוק", category: "כבלי חשמל", costPrice: 68.00, brand: "סינרג'י", unit: "חבילה" },
  { id: "c_add19", sku: "62303", name: "כבל פחוס 3x1.5 ממ\"ר לבן (מטר)", category: "כבלי חשמל", costPrice: 2.20, brand: "סינרג'י", unit: "מטר" },
  { id: "c_add20", sku: "62305", name: "כבל פחוס 3x2.5 ממ\"ר לבן (מטר)", category: "כבלי חשמל", costPrice: 3.60, brand: "סינרג'י", unit: "מטר" },
  { id: "c_add21", sku: "62131", name: "כבל כוח XLPE שחור 3x1.5 ממ\"ר", category: "כבלי חשמל", costPrice: 2.80, brand: "סינרג'י", unit: "מטר" },
  { id: "c_add22", sku: "62133", name: "כבל כוח XLPE שחור 3x2.5 ממ\"ר", category: "כבלי חשמל", costPrice: 4.50, brand: "סינרג'י", unit: "מטר" },

  // תוספות עבור קטגוריית כבלי תקשורת
  { id: "c_add23", sku: "80004", name: "כבל אזעקה פיקוד 6 גידים גימור PVC", category: "כבלי תקשורת", costPrice: 1.20, brand: "Teldor", unit: "מטר" },
  { id: "c_add24", sku: "80005", name: "כבל רמקולים שטוח 2x1.5 שקוף", category: "כבלי תקשורת", costPrice: 1.50, brand: "Teldor", unit: "מטר" },
  { id: "c_add25", sku: "80050", name: "חבילת מחברי רשת RJ45 CAT6 (100 יח')", category: "כבלי תקשורת", costPrice: 45.00, brand: "ארקו", unit: "חבילה" },
  { id: "c_add26", sku: "30150", name: "שקע רשת RJ45 בודד CAT6 גוויס לבן", category: "כבלי תקשורת", costPrice: 18.50, brand: "גוויס (Gewiss)", unit: "יחידה" },
  { id: "c_add27", sku: "30151", name: "שקע רשת RJ45 כפול CAT6 גוויס לבן", category: "כבלי תקשורת", costPrice: 28.00, brand: "גוויס (Gewiss)", unit: "יחידה" },
  { id: "c_add28", sku: "80019", name: "ארון תקשורת ביתי חיצוני 12 אינץ' פלסטיק", category: "כבלי תקשורת", costPrice: 110.00, brand: "Vega", unit: "יחידה" },
  { id: "c_add29", sku: "80020", name: "מחבר פין מהיר (Krone) מבודד לתקשורת", category: "כבלי תקשורת", costPrice: 0.50, brand: "ארקו", unit: "יחידה" },

  // תוספות עבור קטגוריית פיקוד ובקרה
  { id: "c_add30", sku: "14099", name: "מגען עזר (Auxiliary Contact) ללוח Hager", category: "פיקוד ובקרה", costPrice: 35.00, brand: "Hager", unit: "יחידה" },
  { id: "c_add31", sku: "13010", name: "ממסר השהייה בהפעלה (Delay ON) ללוח", category: "פיקוד ובקרה", costPrice: 88.00, brand: "גרלין", unit: "יחידה" },
  { id: "c_add32", sku: "13011", name: "ממסר שלט רחוק / בקרת טעינה Hager", category: "פיקוד ובקרה", costPrice: 120.00, brand: "Hager", unit: "יחידה" },
  { id: "c_add33", sku: "14502", name: "נורת סימון ללוח צהובה", category: "פיקוד ובקרה", costPrice: 12.00, brand: "Hager", unit: "יחידה" },
  { id: "c_add34", sku: "14503", name: "נורת סימון ללוח כחולה", category: "פיקוד ובקרה", costPrice: 12.00, brand: "Hager", unit: "יחידה" },
  { id: "c_add35", sku: "14310", name: "מפסק בורר קטן חור 22 מ\"מ כולל מגעים", category: "פיקוד ובקרה", costPrice: 18.50, brand: "ארקו", unit: "יחידה" },
  { id: "c_add36", sku: "14250", name: "ממסר פיקוד קטן 8 פינים כולל תושבת 230V", category: "פיקוד ובקרה", costPrice: 34.00, brand: "ארקו", unit: "יחידה" },

  // תוספות עבור קטגוריית מובילים
  { id: "c_add37", sku: "63116", name: "צינור שרשורי כבה מאליו קוטר 16 (גליל 50 מטר)", category: "מובילים", costPrice: 32.00, brand: "ארקו", unit: "חבילה" },
  { id: "c_add38", sku: "63132", name: "צינור שרשורי כבה מאליו קוטר 32 (גליל 50 מטר)", category: "מובילים", costPrice: 78.00, brand: "ארקו", unit: "חבילה" },
  { id: "c_add39", sku: "63035", name: "צינור מריכף קשיח שחור קוטר 20 מ\"מ (אורך 3 מטר)", category: "מובילים", costPrice: 6.50, brand: "מריכף", unit: "יחידה" },
  { id: "c_add40", sku: "63036", name: "צינור מריכף קשיח שחור קוטר 25 מ\"מ (אורך 3 מטר)", category: "מובילים", costPrice: 8.50, brand: "מריכף", unit: "יחידה" },
  { id: "c_add41", sku: "65300", name: "חבילת אזיקונים שחור עמידי UV מידה 200x3.6 מ\"מ (100 יח')", category: "מובילים", costPrice: 6.00, brand: "ארקו", unit: "חבילה" },
  { id: "c_add42", sku: "65301", name: "חבילת אזיקונים שחור עמידי UV מידה 300x4.8 מ\"מ (100 יח')", category: "מובילים", costPrice: 12.00, brand: "ארקו", unit: "חבילה" },
  { id: "c_add43", sku: "65310", name: "חבילת איזולירבנד (סרט בידוד) 10 יח' צבעוני מעורב", category: "מובילים", costPrice: 18.00, brand: "ארקו", unit: "חבילה" },
  { id: "c_add44", sku: "65320", name: "ג'ל סיכה למשיכת כבלים במוביל 1 ק\"ג", category: "מובילים", costPrice: 38.00, brand: "ארקו", unit: "יחידה" },
  { id: "c_add45", sku: "65130", name: "קליפס מתכת אומגה לצינור 20 מ\"מ", category: "מובילים", costPrice: 0.90, brand: "ארקו", unit: "יחידה" },
  { id: "c_add46", sku: "65131", name: "קליפס מתכת אומגה לצינור 25 מ\"מ", category: "מובילים", costPrice: 1.10, brand: "ארקו", unit: "יחידה" }
];

export const COMMON_LABOR_PRICES: CommonLaborPrice[] = [
  {
    id: "l1",
    title: "החלפת ממא\"ת חד-פזי בלוח חשמל",
    defaultLaborCost: 250,
    category: "לוחות וחיבורים",
    suggestedMaterials: [
      { sku: "10016", quantity: 1 } // ממא"ת 16A חד-פזי Hager
    ]
  },
  {
    id: "l2",
    title: "החלפת מפסק מגן (פחת) חד-פזי",
    defaultLaborCost: 350,
    category: "לוחות וחיבורים",
    suggestedMaterials: [
      { sku: "11040", quantity: 1 } // פחת חד פזי Hager
    ]
  },
  {
    id: "l3",
    title: "החלפת מפסק מגן (פחת) תלת-פזי",
    defaultLaborCost: 450,
    category: "לוחות וחיבורים",
    suggestedMaterials: [
      { sku: "11340", quantity: 1 } // פחת תלת פזי Hager
    ]
  },
  {
    id: "l4",
    title: "החלפת קבל במאוורר תקרה",
    defaultLaborCost: 220,
    category: "תיקונים ותקלות",
    suggestedMaterials: [
      { sku: "20025", quantity: 1 } // קבל 2.5uF
    ]
  },
  {
    id: "l5",
    title: "התקנת גוף תאורה צמוד תקרה (סטנדרטי)",
    defaultLaborCost: 150,
    category: "תאורה ונורות",
    suggestedMaterials: [
      { sku: "50024", quantity: 1 } // גוף תאורה לד 24W
    ]
  },
  {
    id: "l6",
    title: "התקנת גוף תאורה מוגן מים (במרפסת/חנייה/מחסן)",
    defaultLaborCost: 180,
    category: "תאורה ונורות",
    suggestedMaterials: [
      { sku: "50112", quantity: 1 } // גוף תאורה מוגן מים 1.2מ'
    ]
  },
  {
    id: "l7",
    title: "החלפת מפסק דוד (בוילר) כולל מתאם ומסגרת",
    defaultLaborCost: 250,
    category: "אביזרי קצה ומפסקים",
    suggestedMaterials: [
      { sku: "30030", quantity: 1 }, // מפסק דוד
      { sku: "30103", quantity: 1 }, // מתאם
      { sku: "30203", quantity: 1 }  // מסגרת
    ]
  },
  {
    id: "l8",
    title: "התקנת נקודת שקע או מפסק חדש (גוויס)",
    defaultLaborCost: 200,
    category: "אביזרי קצה ומפסקים",
    suggestedMaterials: [
      { sku: "30010", quantity: 1 }, // שקע גוויס
      { sku: "30103", quantity: 1 }, // מתאם 3מ'
      { sku: "30203", quantity: 1 }  // מסגרת 3מ'
    ]
  },
  {
    id: "l9",
    title: "התקנת שקע כוח חיצוני מוגן מים IP55",
    defaultLaborCost: 350,
    category: "אביזרי קצה ומפסקים",
    suggestedMaterials: [
      { sku: "30400", quantity: 1 }, // שקע מוגן מים יחיד
      { sku: "62032", quantity: 5 }   // כבל ירוק 3x2.5 (5 מטר)
    ]
  },
  {
    id: "l10",
    title: "בנייה וחיווט לוח חשמל ביתי בסיסי (Vega 12 מקום כולל פחת וראשי של Hager)",
    defaultLaborCost: 1200,
    category: "לוחות וחיבורים",
    suggestedMaterials: [
      { sku: "15012", quantity: 1 }, // ארון Vega 12 מקום
      { sku: "11040", quantity: 1 }, // פחת חד פזי Hager 40A
      { sku: "12040", quantity: 1 }, // מפסק ראשי Hager 40A
      { sku: "10016", quantity: 8 }, // ממא"תים Hager 16A
      { sku: "10010", quantity: 2 }  // ממא"תים Hager 10A
    ]
  },
  {
    id: "l11",
    title: "איתור וחיסול קצר חשמלי בבית",
    defaultLaborCost: 250,
    category: "תיקונים ותקלות",
    suggestedMaterials: []
  }
];
