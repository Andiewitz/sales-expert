import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Lead, Sale } from '../types';

export class ExportService {
    /**
     * Exports a list of leads to an Excel (.xlsx) file
     */
    static async exportLeadsToExcel(leads: Lead[]): Promise<void> {
        try {
            // 1. Define the proper schema for a Salesperson
            const data = leads.map(lead => ({
                'Name': lead.name,
                'Company': lead.businessName || 'Independent',
                'Status': lead.status,
                'Potential Value ($)': lead.value,
                'Email': lead.email || 'N/A',
                'Phone': lead.phone || 'N/A',
                'Address': lead.address || 'N/A',
                'Date Added': new Date(lead.createdAt).toLocaleDateString(),
                'Time Added': new Date(lead.createdAt).toLocaleTimeString(),
                'Notes': lead.notes || ''
            }));

            // 2. Create worksheet
            const ws = XLSX.utils.json_to_sheet(data);

            // Set column widths for better readability
            const wscols = [
                { wch: 20 }, // Name
                { wch: 25 }, // Company
                { wch: 10 }, // Status
                { wch: 15 }, // Value
                { wch: 25 }, // Email
                { wch: 15 }, // Phone
                { wch: 30 }, // Address
                { wch: 12 }, // Date
                { wch: 12 }, // Time
                { wch: 40 }, // Notes
            ];
            ws['!cols'] = wscols;

            // 3. Create workbook
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Active Pipeline");

            // 4. Generate base64 string
            const wbout = XLSX.write(wb, {
                type: 'base64',
                bookType: 'xlsx'
            });

            // 5. Save and Share
            const filename = `Sales_Expert_Leads_${new Date().toISOString().split('T')[0]}.xlsx`;
            const fileUri = FileSystem.cacheDirectory + filename;

            await FileSystem.writeAsStringAsync(fileUri, wbout, {
                encoding: FileSystem.EncodingType.Base64
            });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri, {
                    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    dialogTitle: 'Export Sales Pipeline',
                    UTI: 'com.microsoft.excel.xlsx'
                });
            }
        } catch (error) {
            console.error('Export Error:', error);
            throw error;
        }
    }

    /**
     * Exports sales history to Excel
     */
    static async exportSalesToExcel(sales: Sale[]): Promise<void> {
        try {
            const data = sales.map(sale => ({
                'Transaction ID': sale.id,
                'Description': sale.description,
                'Amount ($)': sale.amount,
                'Date': new Date(sale.date).toLocaleDateString(),
                'Timestamp': new Date(sale.created_at).toLocaleString()
            }));

            const ws = XLSX.utils.json_to_sheet(data);
            ws['!cols'] = [{ wch: 15 }, { wch: 40 }, { wch: 15 }, { wch: 15 }, { wch: 25 }];

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Sales History");

            const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
            const filename = `Sales_History_${new Date().toISOString().split('T')[0]}.xlsx`;
            const fileUri = FileSystem.cacheDirectory + filename;

            await FileSystem.writeAsStringAsync(fileUri, wbout, {
                encoding: FileSystem.EncodingType.Base64
            });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri, {
                    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    dialogTitle: 'Export Sales History',
                    UTI: 'com.microsoft.excel.xlsx'
                });
            }
        } catch (error) {
            console.error('Export Error:', error);
            throw error;
        }
    }
}
