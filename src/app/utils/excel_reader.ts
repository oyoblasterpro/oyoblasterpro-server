import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

type SubscriberRow = {
    email?: string;
    name?: string;
    phone?: string;
    location?: string;
};

export const excel_reader = (filePath: string): SubscriberRow[] => {
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

    const normalizedData: SubscriberRow[] = data.map(row => {
        const normalizedRow = Object.fromEntries(
            Object.entries(row).map(([key, value]) => [key.toLowerCase(), value])
        );

        return {
            email: normalizedRow.email as string,
            name: normalizedRow.name as string,
            phone: normalizedRow.phone as string,
            location: normalizedRow.location as string,
        };
    }).filter(row => row.email); // Keep rows with at least an email

    return normalizedData;
};
