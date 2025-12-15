
import { Injectable } from '@nestjs/common';

export interface ExportColumn<T = any> {
    header: string;
    accessor: keyof T | string | ((row: T) => string | number | boolean | null | undefined);
}

@Injectable()
export class CsvService {
    generateCsv<T>(data: T[], columns: ExportColumn<T>[]): string {
        if (!data || data.length === 0) {
            return '';
        }

        const headers = columns.map((col) => `"${col.header}"`).join(',');
        const rows = data.map((row) => {
            return columns
                .map((col) => {
                    let value: string | number | boolean | null | undefined;
                    if (typeof col.accessor === 'function') {
                        value = col.accessor(row);
                    } else {
                        // Support nested properties like 'agencyInfo.name'
                        value = this.getNestedValue(row, col.accessor as string) as string | number | boolean | null | undefined;
                    }
                    const stringValue = value === null || value === undefined ? '' : String(value);
                    return `"${stringValue.replace(/"/g, '""')}"`;
                })
                .join(',');
        });

        return [headers, ...rows].join('\n');
    }

    private getNestedValue<T>(obj: T, path: string): unknown {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return path.split('.').reduce((acc: any, part) => acc && acc[part], obj);
    }
}
