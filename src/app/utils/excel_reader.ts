import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

type SubscriberRow = {
    email: string;
    [key: string]: any;
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

        const { email, ...rest } = normalizedRow;

        if (!email) return null;

        return {
            email,
            ...rest,
        };
    }).filter((row): row is SubscriberRow => row !== null);


    return normalizedData;
};
