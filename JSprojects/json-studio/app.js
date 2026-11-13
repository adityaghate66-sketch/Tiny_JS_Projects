/**
 * JSON Studio - Developer JSON Toolkit
 * Phase 2: Advanced Functionality
 */

class JSONStudio {
    constructor() {
        this.input = document.getElementById('json-input');
        this.output = document.getElementById('json-output');
        this.validationStatus = document.getElementById('validation-status');
        this.validationResult = document.getElementById('validation-result');
        this.currentData = null;
        this.searchTerm = '';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadDefaultJSON();
        this.bindKeyboardShortcuts();
    }

    bindEvents() {
        // Validate on input
        this.input?.addEventListener('input', () => {
            this.validateJSON();
        });

        // Search functionality
        document.getElementById('json-search')?.addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.renderTree();
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

        // Tree controls
        document.getElementById('expand-all-btn')?.addEventListener('click', () => {
            this.expandAll();
        });

        document.getElementById('collapse-all-btn')?.addEventListener('click', () => {
            this.collapseAll();
        });

        // Clear search
        document.getElementById('clear-search')?.addEventListener('click', () => {
            this.searchTerm = '';
            if (document.getElementById('json-search')) {
                document.getElementById('json-search').value = '';
            }
            this.renderTree();
        });

        // Compare button
        document.getElementById('compare-btn')?.addEventListener('click', () => {
            this.compareJSON();
        });

        // Sample datasets
        document.querySelectorAll('[data-sample]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.loadSample(e.target.dataset.sample);
            });
        });
    }

    bindKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + B = Beautify
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                document.getElementById('beautify-btn')?.click();
            }
            // Ctrl/Cmd + M = Minify
            if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
                e.preventDefault();
                document.getElementById('minify-btn')?.click();
            }
            // Ctrl/Cmd + C = Copy
            if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                e.preventDefault();
                document.getElementById('copy-btn')?.click();
            }
        });
    }

    validateJSON() {
        const text = this.input.value.trim();
        if (!text) {
            this.updateValidation(false, null);
            return null;
        }

        try {
            const parsed = JSON.parse(text);
            this.currentData = parsed;
            this.renderStats(parsed);
            this.updateValidation(true, null);
            this.updateUI();
            return parsed;
        } catch (error) {
            this.currentData = null;
            this.updateValidation(false, error.message);
            return null;
        }
    }

    updateValidation(isValid, errorMessage) {
        const container = document.getElementById('validation-result');
        if (isValid) {
            container.className = 'validation-result valid';
            this.validationStatus.outerHTML = `
                <div class="validation-content status valid">
                    <span>✅ Valid JSON</span>
                </div>
            `;
        } else {
            container.className = 'validation-result invalid';
            const message = errorMessage || 'Invalid JSON';
            this.validationStatus.outerHTML = `
                <div class="validation-content status invalid">
                    <span>❌ ${message}</span>
                </div>
            `;
        }
    }

    beautifyJSON() {
        const parsed = this.validateJSON();
        if (parsed === null) {
            const outputText = this.output.value.trim();
            if (outputText) {
                try {
                    const beautified = JSON.stringify(JSON.parse(outputText), null, 2);
                    this.output.value = beautified;
                    this.showToast('Formatted from output area', 'info');
                } catch (e) {
                    this.showToast('No valid JSON to format', 'error');
                }
            } else {
                this.showToast('No valid JSON to format', 'error');
            }
            return;
        }

        const beautified = JSON.stringify(parsed, null, 2);
        this.input.value = beautified;
        this.output.value = beautified;
        this.showToast('JSON beautified!', 'success');
    }

    minifyJSON() {
        const parsed = this.validateJSON();
        if (parsed === null) {
            const outputText = this.output.value.trim();
            if (outputText) {
                try {
                    const minified = JSON.stringify(JSON.parse(outputText));
                    this.output.value = minified;
                    this.showToast('Minified from output area', 'info');
                } catch (e) {
                    this.showToast('No valid JSON to minify', 'error');
                }
            } else {
                this.showToast('No valid JSON to minify', 'error');
            }
            return;
        }

        const minified = JSON.stringify(parsed);
        this.input.value = minified;
        this.output.value = minified;
        this.showToast('JSON minified!', 'success');
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
        this.currentData = null;
        this.validationStatus.textContent = 'Enter JSON to validate';
        this.validationResult.className = 'validation-result';
        this.updateStatsDisplay(null);
        this.updateUI();
        this.showToast('Input cleared', 'info');
    }

    resetToDefault() {
        this.input.value = '';
        this.output.value = '';
        this.loadDefaultJSON();
        this.showToast('Reset to default', 'info');
    }

    renderStats(data) {
        const stats = this.calculateStats(data);
        this.updateStatsDisplay(stats);
    }

    updateStatsDisplay(stats) {
        const section = document.getElementById('stats-section');
        if (section) {
            section.style.display = stats ? 'block' : 'none';
        }

        if (stats) {
            document.getElementById('stat-objects').textContent = stats.objects;
            document.getElementById('stat-arrays').textContent = stats.arrays;
            document.getElementById('stat-depth').textContent = stats.depth;
            document.getElementById('stat-keys').textContent = stats.keys;
        }
    }

    calculateStats(data) {
        function countStats(obj, depth = 1) {
            let objects = 0;
            let arrays = 0;
            let keys = 0;
            let maxDepth = depth;

            if (typeof obj === 'object' && obj !== null) {
                if (Array.isArray(obj)) {
                    arrays = 1;
                    obj.forEach(item => {
                        const childStats = countStats(item, depth + 1);
                        objects += childStats.objects;
                        arrays += childStats.arrays;
                        keys += childStats.keys;
                        maxDepth = Math.max(maxDepth, childStats.depth);
                    });
                } else {
                    objects = 1;
                    for (const key in obj) {
                        keys++;
                        const childStats = countStats(obj[key], depth + 1);
                        objects += childStats.objects;
                        arrays += childStats.arrays;
                        keys += childStats.keys;
                        maxDepth = Math.max(maxDepth, childStats.depth);
                    }
                }
            }

            return { objects, arrays, keys, depth: maxDepth };
        }

        return countStats(data);
    }

    updateUI() {
        document.getElementById('stats-section').style.display = this.currentData ? 'block' : 'none';
        document.getElementById('tree-section').style.display = this.currentData ? 'block' : 'none';
        document.getElementById('search-section').style.display = this.currentData ? 'block' : 'none';
    }

    renderTree() {
        const treeContainer = document.getElementById('json-tree');
        if (!treeContainer || !this.currentData) return;

        treeContainer.innerHTML = this.buildTree(this.currentData, this.searchTerm);
    }

    buildTree(data, searchTerm = '') {
        function highlight(text) {
            if (!searchTerm) return text;
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            return text.replace(regex, '<mark class="highlight">$1</mark>');
        }

        function build(obj, indent = 0) {
            if (obj === null) return `<div class="tree-node null">null</div>`;

            if (typeof obj === 'object') {
                if (Array.isArray(obj)) {
                    if (obj.length === 0) return `<div class="tree-node empty">[]</div>`;

                    let html = `<div class="tree-array" style="margin-left: ${indent * 20}px">
                        <span class="array-bracket">[</span>`;
                    obj.forEach((item, index) => {
                        html += `<span class="array-item">${build(item, indent + 1)}</span>`;
                        if (index < obj.length - 1) {
                            html += ',';
                        }
                    });
                    html += `<span class="array-bracket">]</span></div>`;
                    return html;
                } else {
                    if (Object.keys(obj).length === 0) return `<div class="tree-node empty">{}</div>`;

                    let html = `<div class="tree-object" style="margin-left: ${indent * 20}px">
                        <span class="object-bracket">{</span>`;
                    const keys = Object.keys(obj);
                    keys.forEach((key, index) => {
                        const value = obj[key];
                        html += `
                            <div class="tree-key-value">
                                <span class="tree-key">${highlight(key)}:</span>
                                ${build(value, indent + 1)}
                            </div>`;
                        if (index < keys.length - 1) {
                            html += '<span class="comma">,</span>';
                        }
                    });
                    html += `<span class="object-bracket">}</span></div>`;
                    return html;
                }
            } else if (typeof obj === 'string') {
                return `<span class="tree-string">${highlight('"' + obj + '"')}</span>`;
            } else if (typeof obj === 'number') {
                return `<span class="tree-number">${highlight(obj.toString())}</span>`;
            } else if (typeof obj === 'boolean') {
                return `<span class="tree-boolean">${highlight(obj.toString())}</span>`;
            }
            return '<span>unknown</span>';
        }
        return build(data);
    }

    expandAll() {
        document.querySelectorAll('.tree-node, .tree-object, .tree-array').forEach(el => {
            el.classList.add('expanded');
        });
    }

    collapseAll() {
        document.querySelectorAll('.tree-node, .tree-object, .tree-array').forEach(el => {
            el.classList.remove('expanded');
        });
    }

    compareJSON() {
        const json1 = document.getElementById('compare-json1').value;
        const json2 = document.getElementById('compare-json2').value;
        const results = document.getElementById('compare-results');

        if (!json1 || !json2) {
            this.showToast('Please enter both JSON objects to compare', 'error');
            return;
        }

        try {
            const obj1 = JSON.parse(json1);
            const obj2 = JSON.parse(json2);

            const diffs = this.findDifferences(obj1, obj2, '');

            if (diffs.length === 0) {
                results.innerHTML = '<div class="compare-result match">✅ JSON objects are identical</div>';
            } else {
                results.innerHTML = `
                    <div class="compare-result diff">
                        <h4>Differences Found (${diffs.length}):</h4>
                        <ul>
                            ${diffs.map(d => `
                                <li class="diff-item">
                                    <span class="diff-path">${d.path}</span>
                                    <span class="diff-value">${d.type}: ${d.value}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `;
            }
            this.showToast('Comparison complete', 'info');
        } catch (e) {
            this.showToast('Invalid JSON for comparison', 'error');
        }
    }

    findDifferences(obj1, obj2, path) {
        const diffs = [];

        function compare(o1, o2, currentPath) {
            if (typeof o1 !== typeof o2) {
                diffs.push({ path: currentPath, type: 'type', value: `${typeof o1} vs ${typeof o2}` });
                return;
            }

            if (o1 === null || o2 === null) {
                if (o1 !== o2) {
                    diffs.push({ path: currentPath, type: 'value', value: `${o1} vs ${o2}` });
                }
                return;
            }

            if (typeof o1 !== 'object') {
                if (o1 !== o2) {
                    diffs.push({ path: currentPath, type: 'value', value: `${o1} vs ${o2}` });
                }
                return;
            }

            const keys1 = new Set(Object.keys(o1));
            const keys2 = new Set(Object.keys(o2));

            for (const key of keys1) {
                if (!keys2.has(key)) {
                    diffs.push({ path: `${currentPath}.${key}`, type: 'missing', value: 'only in first' });
                } else {
                    compare(o1[key], o2[key], `${currentPath}.${key}`);
                }
            }

            for (const key of keys2) {
                if (!keys1.has(key)) {
                    diffs.push({ path: `${currentPath}.${key}`, type: 'missing', value: 'only in second' });
                }
            }
        }

        compare(obj1, obj2, '');
        return diffs;
    }

    loadSample(name) {
        const samples = {
            user: {
                name: "John Doe",
                email: "john.doe@example.com",
                age: 30,
                isActive: true,
                tags: ["developer", "admin"],
                profile: {
                    avatar: "avatar.png",
                    bio: "Software developer with 5 years experience"
                },
                createdAt: "2024-01-15T10:00:00.000Z"
            },
            product: {
                id: "prod_001",
                name: "Wireless Headphones",
                price: 99.99,
                currency: "USD",
                inStock: true,
                variants: [
                    { color: "black", sku: "WH-BK-01" },
                    { color: "white", sku: "WH-WH-01" }
                ],
                metadata: {
                    brand: "AudioTech",
                    weight: "250g",
                    warranty: "1 year"
                }
            },
            blog: {
                title: "Understanding JavaScript Closures",
                author: {
                    name: "Jane Smith",
                    bio: "Frontend Developer"
                },
                tags: ["javascript", "webdev", "programming"],
                content: "A comprehensive guide to closures in JavaScript...",
                published: true,
                views: 1250,
                comments: [
                    { author: "User1", text: "Great explanation!", date: "2024-01-10" },
                    { author: "User2", text: "Very helpful, thanks!", date: "2024-01-11" }
                ],
                publishedAt: "2024-01-12T08:00:00.000Z"
            }
        };

        if (samples[name]) {
            const formatted = JSON.stringify(samples[name], null, 2);
            this.input.value = formatted;
            this.output.value = formatted;
            this.currentData = samples[name];
            this.renderStats(samples[name]);
            this.updateValidation(true, null);
            this.updateUI();
            this.renderTree();
            this.showToast(`Loaded ${name} sample`, 'success');
        }
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
                clipboard: true,
                treeViewer: true,
                comparison: true
            },
            author: "Developer",
            created: "2024-01-01"
        };

        const formatted = JSON.stringify(defaultJSON, null, 2);
        this.input.value = formatted;
        this.output.value = formatted;
        this.currentData = defaultJSON;
        this.renderStats(defaultJSON);
        this.updateValidation(true, null);
        this.updateUI();
        this.renderTree();
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