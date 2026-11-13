/**
 * Phase 2: Weight Converter Script
 */

import { WeightConverter } from '../../tools/converter.js';

class WeightConverterTool {
    constructor() {
        this.converter = new WeightConverter();
        this._bindEvents();
    }

    _bindEvents() {
        const calculateBtn = document.querySelector('.calculate');
        const inputValue = document.querySelector('[data-field="input_value"]');
        const fromSelect = document.querySelector('[data-field="from_unit"]');
        const toSelect = document.querySelector('[data-field="to_unit"]');

        if (inputValue) inputValue.value = localStorage.getItem('phase2_weight_input') || '';
        if (fromSelect) fromSelect.value = localStorage.getItem('phase2_weight_from') || 'kilograms';
        if (toSelect) toSelect.value = localStorage.getItem('phase2_weight_to') || 'grams';

        calculateBtn?.addEventListener('click', () => this.calculate());
        inputValue?.addEventListener('input', () => this.autoConvert());
    }

    calculate() {
        const input = document.querySelector('[data-field="input_value"]').value;
        const from = document.querySelector('[data-field="from_unit"]').value;
        const to = document.querySelector('[data-field="to_unit"]').value;

        if (!input || isNaN(parseFloat(input))) {
            this._showResult('Please enter a valid weight');
            return;
        }

        const value = parseFloat(input);
        const result = this.converter._fromBase(
            this.converter._toBase(value, from),
            to
        );

        const formattedInput = this._formatWeight(value, from);
        const formattedOutput = this._formatWeight(result.value, to);

        this._showResult(
            `${formattedInput} = ${formattedOutput}<br>
            <small>Conversion ratio: 1 ${from} = ${result.ratio.toFixed(4)} ${to}</small>`
        );

        localStorage.setItem('phase2_weight_input', input);
        localStorage.setItem('phase2_weight_from', from);
        localStorage.setItem('phase2_weight_to', to);
    }

    autoConvert() {
        const input = document.querySelector('[data-field="input_value"]').value;
        if (input && !isNaN(parseFloat(input))) {
            setTimeout(() => this.calculate(), 300);
        }
    }

    _formatWeight(value, unit) {
        const num = parseFloat(value);
        if (!num) return '0';

        switch(unit) {
            case 'kilograms':
            case 'kg':
                return `${num.toFixed(4)} kg`;
            case 'grams':
            case 'g':
                return `${(num * 1000).toFixed(2)} g`;
            case 'pounds':
            case 'lbs':
                return `${num.toFixed(4)} lbs`;
            case 'ounces':
            case 'oz':
                return `${(num * 35.274).toFixed(2)} oz`;
            default:
                return `${num.toFixed(4)} ${unit}`;
        }
    }

    _showResult(result) {
        const resultBox = document.querySelector('.result-box');
        resultBox.innerHTML = `<div class="result-value">${result}</div>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WeightConverterTool();
});

export default WeightConverterTool;