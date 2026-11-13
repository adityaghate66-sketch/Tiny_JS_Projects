/**
 * Phase 2: Tip Calculator Tool
 * Bill + tip calculation with multiple tip percentages
 */

import BaseCalculator from './calculator.js';

class TipCalculator extends BaseCalculator {
    constructor() {
        super('Tip Calculator', 'tip-calculator', {
            autoSave: true,
            exportable: true
        });
        this.tipPercentages = [5, 10, 15, 18, 20, 25, 30];
    }

    _bindEvents() {
        const calculateBtns = document.querySelectorAll('.btn-tip');
        const billInput = document.querySelector('[data-field="bill"]');
        const peopleInput = document.querySelector('[data-field="people"]');

        if (billInput) {
            billInput.value = this.getInput('bill') || '';
        }
        if (peopleInput) {
            peopleInput.value = this.getInput('people') || '1';
        }

        calculateBtns.forEach(btn => {
            btn?.addEventListener('click', (e) => {
                const tipPercent = parseFloat(e.target.dataset.tip);
                this.calculate(tipPercent);
            });
        });

        // Restore saved result
        if (this.lastResult) {
            this._showResult(this.lastResult);
        }
    }

    calculate(tipPercent = 15) {
        const bill = this.toNumber(this.getInput('bill'), 0);
        const people = this.toNumber(this.getInput('people'), 1);

        if (bill <= 0) {
            this._showError('Please enter a valid bill amount');
            return;
        }

        const tipAmount = (bill * tipPercent) / 100;
        const total = bill + tipAmount;
        const perPerson = total / people;

        this.lastResult = {
            bill,
            tipPercent,
            tipAmount,
            total,
            people,
            perPerson,
            formatted: `$${total.toFixed(2)}`,
            unit: 'total'
        };

        this.setInput('bill', bill);
        this.setInput('people', people);
        this._showResult(this.lastResult);

        // Update UI with calculation details
        this._showBreakdown();
    }

    _showBreakdown() {
        if (!this.lastResult) return;

        const resultBox = document.querySelector('.result-box');
        const { bill, tipPercent, tipAmount, total, people, perPerson } = this.lastResult;

        resultBox.innerHTML = `
            <div class="calculation-details">
                <h3>Calculation Breakdown</h3>
                <div class="detail-row">
                    <span>Bill:</span>
                    <span>$${bill.toFixed(2)}</span>
                </div>
                <div class="detail-row">
                    <span>Tip (${tipPercent}%):</span>
                    <span>$${tipAmount.toFixed(2)}</span>
                </div>
                <div class="detail-row total-row">
                    <span>Total:</span>
                    <span>$${total.toFixed(2)}</span>
                </div>
                ${people > 1 ? `
                <div class="detail-row">
                    <span>Per Person (${people} people):</span>
                    <span>$${perPerson.toFixed(2)}</span>
                </div>
                ` : ''}
            </div>
        `;

        this._saveState();
    }

    _showError(message) {
        const resultBox = document.querySelector('.result-box');
        if (resultBox) {
            resultBox.innerHTML = `<div class="error">${message}</div>`;
        }
    }

    renderTipButtons() {
        return this.tipPercentages.map(percent => `
            <button class="btn btn-tip" data-tip="${percent}">
                ${percent}%
            </button>
        `).join('');
    }

    toNumber(value, defaultValue = 0) {
        const num = parseFloat(value);
        return isNaN(num) ? defaultValue : num;
    }

    export() {
        super.export();
        ExportUtility.downloadJSON({
            tool: 'Tip Calculator',
            bill: this.lastResult?.bill,
            tipPercent: this.lastResult?.tipPercent,
            tipAmount: this.lastResult?.tipAmount,
            total: this.lastResult?.total,
            timestamp: new Date().toISOString()
        }, 'tip-calculation.json');
    }
}

// Initialize when script loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.tool-container')) {
        const tipCalc = new TipCalculator();
        const buttonsContainer = document.querySelector('.tip-buttons');
        if (buttonsContainer) {
            buttonsContainer.innerHTML = tipCalc.renderTipButtons();
        }
    }
});

export default TipCalculator;