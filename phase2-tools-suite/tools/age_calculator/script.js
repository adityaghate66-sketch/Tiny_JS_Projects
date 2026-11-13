/**
 * Phase 2: Age Calculator Script
 * Import and initialize the AgeCalculator
 */

import BaseCalculator from '../../tools/calculator.js';

class AgeCalculator extends BaseCalculator {
    constructor() {
        super('Age Calculator', 'age-calculator', {
            autoSave: true,
            exportable: true
        });
    }

    _bindEvents() {
        const calculateBtn = document.querySelector('.calculate');
        const birthDateInput = document.querySelector('[data-field="birth_date"]');

        if (birthDateInput) {
            birthDateInput.value = this.getInput('birth_date') || '';
        }

        calculateBtn?.addEventListener('click', () => this.calculate());

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
}

export default AgeCalculator;