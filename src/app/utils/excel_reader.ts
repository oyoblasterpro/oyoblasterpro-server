import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

export const excel_reader = (filePath: string): string[] => {
    const ext = path.extname(filePath).toLowerCase();
    let data: any[] = [];

    if (ext === '.csv') {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const workbook = XLSX.read(fileContent, { type: 'string' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        data = XLSX.utils.sheet_to_json(sheet);
    } else {
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        data = XLSX.utils.sheet_to_json(sheet);
    }

    const emails = data.map(row => {
        // Normalize keys to lowercase
        const normalizedRow = Object.fromEntries(
            Object.entries(row).map(([key, value]) => [key.toLowerCase(), value])
        );
        return normalizedRow.email;
    }).filter(Boolean);
    return emails as string[];
};
