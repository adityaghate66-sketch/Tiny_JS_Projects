/**
 * Phase 2: Age Calculator Tool
 * Calculate age from birthdate with localStorage persistence
 */

import BaseCalculator from './calculator.js';

class AgeCalculator extends BaseCalculator {
    constructor() {
        super('Age Calculator', 'age-calculator', {
            autoSave: true,
            exportable: true
        });
    }

    _bindEvents() {
        const calculateBtn = document.querySelector('.calculate');
        const exportBtn = document.querySelector('.export');
        const birthDateInput = document.querySelector('[data-field="birth_date"]');

        if (birthDateInput) {
            birthDateInput.value = this.getInput('birth_date') || '';
        }

        calculateBtn?.addEventListener('click', () => this.calculate());
        exportBtn?.addEventListener('click', () => this.export());

        // Restore saved result
        if (this.lastResult) {
            this._showResult(this.lastResult);
        }
    }

    calculate() {
        const birthDate = this.getInput('birth_date');

        if (!birthDate) {
            this._showError('Please enter your birth date');
            return;
        }

        try {
            const birth = new Date(birthDate);
            if (isNaN(birth.getTime())) {
                throw new Error('Invalid date');
            }

            const now = new Date();
            let years = now.getFullYear() - birth.getFullYear();
            let months = now.getMonth() - birth.getMonth();
            let days = now.getDate() - birth.getDate();

            // Adjust for negative days
            if (days < 0) {
                months--;
                const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
                days += lastMonth.getDate();
            }

            // Adjust for negative months
            if (months < 0) {
                years--;
                months += 12;
            }

            this.lastResult = {
                years,
                months,
                days,
                formatted: `${years} years, ${months} months, ${days} days`,
                totalMonths: years * 12 + months,
                totalDays: Math.floor((now - birth) / (1000 * 60 * 60 * 24))
            };

            this.setInput('birth_date', birthDate);
            this._showResult(this.lastResult);

        } catch (e) {
            this._showError('Invalid date format');
        }
    }

    _showError(message) {
        const resultBox = document.querySelector('.result-box');
        if (resultBox) {
            resultBox.innerHTML = `<div class="error">${message}</div>`;
        }
    }

    export() {
        super.export();
        // Also try PDF export
        const resultBox = document.querySelector('.result-box');
        const content = resultBox ? resultBox.innerHTML : 'Age Calculation Result';
        ExportUtility.downloadJSON({
            tool: 'Age Calculator',
            birthDate: this.inputs.birth_date,
            result: this.lastResult,
            timestamp: new Date().toISOString()
        }, 'age-calculation.json');
    }
}

// Initialize when script loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.tool-container')) {
        new AgeCalculator();
    }
});

export default AgeCalculator;