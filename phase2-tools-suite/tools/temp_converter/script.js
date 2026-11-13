/**
 * Phase 2: Temperature Converter Script
 */

import { TemperatureConverter } from '../../tools/converter.js';

class TemperatureConverterTool {
    constructor() {
        this.converter = new TemperatureConverter();
        this._bindEvents();
    }

    _bindEvents() {
        const calculateBtn = document.querySelector('.calculate');
        const inputValue = document.querySelector('[data-field="input_value"]');
        const fromSelect = document.querySelector('[data-field="from_unit"]');
        const toSelect = document.querySelector('[data-field="to_unit"]');

        if (inputValue) inputValue.value = localStorage.getItem('phase2_temp_input') || '';
        if (fromSelect) fromSelect.value = localStorage.getItem('phase2_temp_from') || 'celsius';
        if (toSelect) toSelect.value = localStorage.getItem('phase2_temp_to') || 'fahrenheit';

        calculateBtn?.addEventListener('click', () => this.calculate());
        inputValue?.addEventListener('input', () => this.autoConvert());
    }

    calculate() {
        const input = document.querySelector('[data-field="input_value"]').value;
        const from = document.querySelector('[data-field="from_unit"]').value;
        const to = document.querySelector('[data-field="to_unit"]').value;

        if (!input || isNaN(parseFloat(input))) {
            this._showResult('Please enter a valid temperature');
            return;
        }

        const value = parseFloat(input);
        const result = this.converter._fromBase(
            this.converter._toBase(value, from),
            to
        );

        this._showResult(`${value}°${from.charAt(0).toUpperCase()} = ${result.formatted}°${to.charAt(0).toUpperCase()}`);

        localStorage.setItem('phase2_temp_input', input);
        localStorage.setItem('phase2_temp_from', from);
        localStorage.setItem('phase2_temp_to', to);
    }

    autoConvert() {
        const input = document.querySelector('[data-field="input_value"]').value;
        if (input && !isNaN(parseFloat(input))) {
            setTimeout(() => this.calculate(), 300);
        }
    }

    _showResult(result) {
        const resultBox = document.querySelector('.result-box');
        resultBox.innerHTML = `<div class="result-value">${result}</div>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TemperatureConverterTool();
});

export default TemperatureConverterTool;