/**
 * Phase 2: Unit Converter Base Class
 * Foundation for temperature, weight, currency converters
 */

import BaseCalculator from './calculator.js';

class Converter extends BaseCalculator {
    constructor(name, toolId, baseUnit, conversions) {
        super(name, toolId, { autoSave: true, exportable: true });
        this.baseUnit = baseUnit;
        this.conversions = conversions; // { targetUnit: rate, ... }
    }

    _bindEvents() {
        const convertBtn = document.querySelector('.calculate');
        const input = document.querySelector('[data-field="input_value"]');
        const fromSelect = document.querySelector('[data-field="from_unit"]');
        const toSelect = document.querySelector('[data-field="to_unit"]');

        if (input) input.value = this.getInput('input_value') || '';
        if (fromSelect) fromSelect.value = this.getInput('from_unit') || this.baseUnit;
        if (toSelect) toSelect.value = this.getInput('to_unit') || 'celsius';

        convertBtn?.addEventListener('click', () => this.calculate());
    }

    calculate() {
        const value = this.getInput('input_value');
        const fromUnit = this.getInput('from_unit');
        const toUnit = this.getInput('to_unit');

        if (value === '' || !value) {
            this._showError('Please enter a value');
            return;
        }

        const baseValue = this._toBase(parseFloat(value), fromUnit);
        const result = this._fromBase(baseValue, toUnit);

        this.lastResult = {
            input: parseFloat(value),
            from: fromUnit,
            to: toUnit,
            result: result.value,
            unit: toUnit,
            formatted: result.formatted,
            ratio: result.ratio
        };

        this.setInput('input_value', value);
        this.setInput('from_unit', fromUnit);
        this.setInput('to_unit', toUnit);
        this._showResult(this.lastResult);
    }

    _toBase(value, unit) {
        // Override in subclasses
        return value;
    }

    _fromBase(value, unit) {
        // Override in subclasses
        return { value, formatted: value.toFixed(2), ratio: 1 };
    }

    static toNumber(value, defaultValue = 0) {
        const num = parseFloat(value);
        return isNaN(num) ? defaultValue : num;
    }

    static isValidNumber(value) {
        const num = parseFloat(value);
        return !isNaN(num) && isFinite(num);
    }
}

// Temperature Converter
class TemperatureConverter extends Converter {
    constructor() {
        super('Temperature Converter', 'temp-converter', 'celsius', {
            fahrenheit: 1,
            kelvin: 2
        });
    }

    _toBase(value, unit) {
        switch (unit.toLowerCase()) {
            case 'celsius': return value;
            case 'fahrenheit': return (value - 32) * 5 / 9;
            case 'kelvin': return value - 273.15;
            default: return value;
        }
    }

    _fromBase(value, unit) {
        switch (unit.toLowerCase()) {
            case 'celsius':
                return { value, formatted: value.toFixed(2), ratio: 1 };
            case 'fahrenheit':
                return { value: value * 9/5 + 32, formatted: (value * 9/5 + 32).toFixed(2), ratio: 1.8 };
            case 'kelvin':
                return { value: value + 273.15, formatted: (value + 273.15).toFixed(2), ratio: 1 };
            default: return { value, formatted: value.toFixed(2), ratio: 1 };
        }
    }

    getUnits() {
        return ['celsius', 'fahrenheit', 'kelvin'];
    }

    formatTemp(value, unit) {
        return `${value.toFixed(2)}°${unit.charAt(0).toUpperCase()}`;
    }
}

// Weight Converter
class WeightConverter extends Converter {
    constructor() {
        super('Weight Converter', 'weight-converter', 'kg', {
            grams: 1000,
            pounds: 2.20462,
            ounces: 35.274
        });
    }

    _toBase(value, unit) {
        const unitLower = unit.toLowerCase();
        switch (unitLower) {
            case 'kilograms':
            case 'kg': return value;
            case 'grams':
            case 'g': return value / 1000;
            case 'pounds':
            case 'lbs': return value / 2.20462;
            case 'ounces':
            case 'oz': return value / 35.274;
            default: return value;
        }
    }

    _fromBase(value, unit) {
        const unitLower = unit.toLowerCase();
        switch (unitLower) {
            case 'kilograms':
            case 'kg':
                return { value, formatted: value.toFixed(2), ratio: 1 };
            case 'grams':
            case 'g':
                return { value: value * 1000, formatted: (value * 1000).toFixed(2), ratio: 1000 };
            case 'pounds':
            case 'lbs':
                return { value: value * 2.20462, formatted: (value * 2.20462).toFixed(2), ratio: 2.20462 };
            case 'ounces':
            case 'oz':
                return { value: value * 35.274, formatted: (value * 35.274).toFixed(2), ratio: 35.274 };
            default: return { value, formatted: value.toFixed(2), ratio: 1 };
        }
    }

    getUnits() {
        return ['kg', 'g', 'pounds', 'oz'];
    }
}

export { Converter, TemperatureConverter, WeightConverter };
export default Converter;