import * as XLSX from 'xlsx';
import fs from 'fs';

export const excel_reader = (filePath: string): string[] => {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const data: any[] = XLSX.utils.sheet_to_json(sheet);
    const emails = data.map(row => row.email).filter(Boolean);

    return emails;
};
