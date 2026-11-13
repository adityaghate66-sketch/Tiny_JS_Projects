/**
 * Phase 2: Base Calculator Class
 * Foundation for all calculator tools with localStorage integration
 */

import StorageManager from '../utils/storage.js';
import ExportUtility from '../utils/export.js';
import Validators from '../utils/validators.js';

class BaseCalculator {
    constructor(name, toolId, defaultOptions = {}) {
        this.name = name;
        this.toolId = toolId;
        this.options = {
            autoSave: true,
            exportable: true,
            ...defaultOptions
        };
        this.inputs = {};
        this.lastResult = null;
        this._init();
    }

    _init() {
        // Load saved state
        this._loadState();

        // Restore event listeners
        this._bindEvents();
    }

    _loadState() {
        const saved = StorageManager.get(this.toolId, {});
        if (saved.inputs) {
            this.inputs = saved.inputs;
            this._restoreInputs();
        }
        if (saved.lastResult !== null) {
            this.lastResult = saved.lastResult;
            this._showResult(this.lastResult);
        }
    }

    _saveState() {
        if (this.options.autoSave) {
            StorageManager.set(this.toolId, {
                inputs: this.inputs,
                lastResult: this.lastResult,
                timestamp: new Date().toISOString()
            });
        }
    }

    setInput(name, value) {
        this.inputs[name] = value;
        this._updateInputDisplay(name, value);
    }

    getInput(name) {
        return this.inputs[name] || '';
    }

    _bindEvents() {
        // Override in subclasses
    }

    calculate() {
        // Override in subclasses
        throw new Error('calculate() must be implemented by subclass');
    }

    getResult() {
        return this.lastResult;
    }

    _showResult(result) {
        const resultBox = document.querySelector('.result-box');
        if (resultBox) {
            resultBox.innerHTML = `
                <div class="result-label">${this.name} Result:</div>
                <div class="result-value">${result.formatted || result}</div>
                ${result.unit ? `<div class="result-unit">${result.unit}</div>` : ''}
            `;
        }
        this._saveState();
    }

    export() {
        if (!this.options.exportable) return;

        const data = {
            tool: this.name,
            inputs: this.inputs,
            result: this.lastResult,
            timestamp: new Date().toISOString()
        };

        // Try PDF first, fallback to JSON
        ExportUtility.downloadJSON(data, `${this.toolId}-result.json`);
    }

    clear() {
        this.inputs = {};
        this.lastResult = null;
        StorageManager.remove(this.toolId);
        this._resetInputs();
    }

    toHTML() {
        return `
            <div class="tool-container">
                <h2>${this.name}</h2>
                <div class="inputs"></div>
                <div class="actions">
                    <button class="btn calculate">Calculate</button>
                    <button class="btn export">Export</button>
                    <a href="../index.html" class="btn back-btn">Back</a>
                </div>
                <div class="result-box"></div>
            </div>
        `;
    }

    _restoreInputs() {
        Object.entries(this.inputs).forEach(([name, value]) => {
            this._updateInputDisplay(name, value);
        });
    }

    _resetInputs() {
        const inputGroups = document.querySelectorAll('.form-group input');
        inputGroups.forEach(input => {
            const name = input.dataset.field;
            input.value = '';
        });
    }

    _updateInputDisplay(name, value) {
        const input = document.querySelector(`[data-field="${name}"]`);
        if (input) {
            input.value = value;
        }
    }
}

export default BaseCalculator;