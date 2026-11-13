/**
 * Phase 2: Export Utility
 * PDF, CSV, JSON Export functionality
 */

class ExportUtility {
    static downloadJSON(data, filename = 'results.json') {
        try {
            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: 'application/json'
            });
            this._downloadBlob(blob, filename);
            return true;
        } catch (e) {
            console.error('JSON export failed:', e);
            return false;
        }
    }

    static downloadCSV(data, columns, filename = 'results.csv') {
        try {
            const csvContent = [
                columns.join(','),
                ...data.map(row =>
                    columns.map(col => `"${row[col] ?? ''}"`).join(',')
                )
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            this._downloadBlob(blob, filename);
            return true;
        } catch (e) {
            console.error('CSV export failed:', e);
            return false;
        }
    }

    static async downloadPDF(htmlContent, filename = 'result.pdf', title = 'Calculation Result') {
        try {
            // Try html2pdf first (if loaded)
            if (typeof html2pdf !== 'undefined') {
                const element = document.createElement('div');
                element.style.padding = '20px';
                element.style.fontFamily = 'Poppins, sans-serif';
                element.innerHTML = `
                    <h2>${title}</h2>
                    ${htmlContent}
                `;
                document.body.appendChild(element);

                await html2pdf()
                    .from(element)
                    .set({
                        margin: 10,
                        filename: filename,
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: { scale: 2 },
                        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                    })
                    .save();

                document.body.removeChild(element);
                return true;
            }

            // Fallback to JSON export
            console.warn('html2pdf not loaded, falling back to JSON');
            return this.downloadJSON({
                title,
                data: htmlContent,
                timestamp: new Date().toISOString()
            }, filename.replace('.pdf', '.json'));
        } catch (e) {
            console.error('PDF export failed:', e);
            return false;
        }
    }

    static _downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.position = 'absolute';
        a.style.left = '-9999px';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Copy to clipboard
    static async copyToClipboard(text, successMessage = 'Copied to clipboard!') {
        try {
            await navigator.clipboard.writeText(text);
            this._showNotification(successMessage);
            return true;
        } catch (e) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this._showNotification(successMessage);
            return true;
        }
    }

    static _showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'export-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 2000);
    }
}

export default ExportUtility;