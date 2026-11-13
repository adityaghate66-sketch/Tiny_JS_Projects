/**
 * JSON Studio - Developer JSON Toolkit
 * Phase 1: Core Functionality
 */

class JSONStudio {
    constructor() {
        this.input = document.getElementById('json-input');
        this.output = document.getElementById('json-output');
        this.validationStatus = document.getElementById('validation-status');
        this.validationResult = document.getElementById('validation-result');

        this.init();
    }

    init() {
        this.bindEvents();
        this.loadDefaultJSON();
    }

    bindEvents() {
        // Validate on input
        this.input?.addEventListener('input', () => {
            this.validateJSON();
        });

        // Beautify button
        document.getElementById('beautify-btn')?.addEventListener('click', () => {
            this.beautifyJSON();
        });

        // Minify button
        document.getElementById('minify-btn')?.addEventListener('click', () => {
            this.minifyJSON();
        });

        // Copy button
        document.getElementById('copy-btn')?.addEventListener('click', () => {
            this.copyJSON();
        });

        // Download button
        document.getElementById('download-btn')?.addEventListener('click', () => {
            this.downloadJSON();
        });

        // Clear button
        document.getElementById('clear-input')?.addEventListener('click', () => {
            this.clearInput();
        });

        // Reset button
        document.getElementById('reset-input')?.addEventListener('click', () => {
            this.resetToDefault();
        });
    }

    validateJSON() {
        const text = this.input.value.trim();
        if (!text) {
            this.validationResult.classList.remove('valid', 'invalid');
            this.validationStatus.textContent = 'Enter JSON to validate';
            return null;
        }

        try {
            const parsed = JSON.parse(text);
            this.validationResult.className = 'validation-result valid';
            this.validationStatus.outerHTML = `
                <div class="validation-content status valid">
                    <span>✅ Valid JSON</span>
                </div>
            `;
            return parsed;
        } catch (error) {
            this.validationResult.className = 'validation-result invalid';
            const errorMessages = {
                'Unexpected token L': 'Unexpected character (L)',
                'Unexpected token': 'Syntax error',
                'Expecting': 'Invalid syntax',
                'Unterminated': 'Unterminated string'
            };

            let message = 'Invalid JSON';
            for (const [key, val] of Object.entries(errorMessages)) {
                if (error.message.includes(key)) {
                    message = val;
                    break;
                }
            }

            this.validationStatus.outerHTML = `
                <div class="validation-content status invalid">
                    <span>❌ ${message}</span>
                    <span style="font-size: 0.8rem; opacity: 0.7;">(Line ${this.getErrorLine(error.message)})</span>
                </div>
            `;
            return null;
        }
    }

    getErrorLine(message) {
        const match = message.match(/line (\d+)/i);
        return match ? match[1] : '?';
    }

    beautifyJSON() {
        try {
            const parsed = this.validateJSON();
            if (parsed === null) {
                // If no valid JSON, try to beautify the output area content
                const outputText = this.output.value.trim();
                if (outputText) {
                    const beautified = JSON.stringify(JSON.parse(outputText), null, 2);
                    this.output.value = beautified;
                    this.showToast('Formatted from output area', 'info');
                } else {
                    this.showToast('No valid JSON to format', 'error');
                }
                return;
            }

            const beautified = JSON.stringify(parsed, null, 2);
            this.input.value = beautified;
            this.output.value = beautified;
            this.validationStatus.outerHTML = `<div class="validation-content status valid"><span>✅ Valid JSON</span></div>`;
            this.showToast('JSON beautified!', 'success');
        } catch (e) {
            this.showToast('Error beautifying JSON', 'error');
        }
    }

    minifyJSON() {
        try {
            const parsed = this.validateJSON();
            if (parsed === null) {
                const outputText = this.output.value.trim();
                if (outputText) {
                    const minified = JSON.stringify(JSON.parse(outputText));
                    this.output.value = minified;
                    this.showToast('Minified from output area', 'info');
                } else {
                    this.showToast('No valid JSON to minify', 'error');
                }
                return;
            }

            const minified = JSON.stringify(parsed);
            this.input.value = minified;
            this.output.value = minified;
            this.validationStatus.outerHTML = `<div class="validation-content status valid"><span>✅ Valid JSON</span></div>`;
            this.showToast('JSON minified!', 'success');
        } catch (e) {
            this.showToast('Error minifying JSON', 'error');
        }
    }

    copyJSON() {
        const text = this.output.value || this.input.value;
        if (!text.trim()) {
            this.showToast('Nothing to copy', 'error');
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Copied to clipboard!', 'success');
        }).catch(() => {
            this.showToast('Failed to copy', 'error');
        });
    }

    downloadJSON() {
        const text = this.output.value || this.input.value;
        if (!text.trim()) {
            this.showToast('Nothing to download', 'error');
            return;
        }

        const blob = new Blob([text], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.download = 'json-studio-output.json';
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast('JSON downloaded!', 'success');
    }

    clearInput() {
        this.input.value = '';
        this.output.value = '';
        this.validationStatus.textContent = 'Enter JSON to validate';
        this.validationResult.className = 'validation-result';
        this.showToast('Input cleared', 'info');
    }

    resetToDefault() {
        this.input.value = '';
        this.output.value = '';
        this.loadDefaultJSON();
        this.showToast('Reset to default', 'info');
    }

    loadDefaultJSON() {
        const defaultJSON = {
            name: "JSON Studio",
            version: "1.0.0",
            tools: [
                { id: 1, name: "Beautify", icon: "🎨" },
                { id: 2, name: "Minify", icon: "📦" },
                { id: 3, name: "Validate", icon: "✅" },
                { id: 4, name: "Copy", icon: "📋" },
                { id: 5, name: "Download", icon: "💾" }
            ],
            features: {
                validation: true,
                formatting: true,
                export: true,
                clipboard: true
            },
            author: "Developer",
            created: "2024-01-01"
        };

        const formatted = JSON.stringify(defaultJSON, null, 2);
        this.input.value = formatted;
        this.output.value = formatted;
        this.validationResult.className = 'validation-result valid';
        this.validationStatus.outerHTML = `
            <div class="validation-content status valid">
                <span>✅ Valid JSON</span>
            </div>
        `;
    }

    showToast(message, type) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize app
const app = new JSONStudio();