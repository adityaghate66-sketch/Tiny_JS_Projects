/**
 * Markdown Studio - Live Markdown Editor
 * Phase 1: Core Functionality
 */

class MarkdownStudio {
    constructor() {
        this.input = document.getElementById('markdown-input');
        this.preview = document.getElementById('markdown-preview');
        this.emptyState = document.getElementById('empty-state');

        this.init();
    }

    init() {
        this.bindEvents();
        this.renderPreview();
        this.updateCounts();
        this.bindKeyboardShortcuts();
    }

    bindEvents() {
        // Render on input
        this.input?.addEventListener('input', () => {
            this.renderPreview();
            this.updateCounts();
            this.updateEmptyState();
        });

        // Save button
        document.getElementById('save-btn')?.addEventListener('click', () => {
            this.saveDocument();
        });

        // Download button
        document.getElementById('download-btn')?.addEventListener('click', () => {
            this.downloadDocument();
        });

        // Toolbar buttons
        document.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.insertAtCursor(e.target.dataset.action);
            });
        });
    }

    bindKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + B = Bold
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                this.insertAtCursor('bold');
            }
            // Ctrl/Cmd + I = Italic
            if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
                e.preventDefault();
                this.insertAtCursor('italic');
            }
            // Ctrl/Cmd + K = Code
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.insertAtCursor('code');
            }
        });
    }

    renderPreview() {
        const text = this.input.value;
        this.preview.innerHTML = this.markdownToHtml(text);
    }

    updateEmptyState() {
        if (this.emptyState) {
            this.emptyState.classList.toggle('hidden', this.input.value.trim().length > 0);
        }
    }

    markdownToHtml(markdown) {
        // Simple Markdown to HTML converter
        let html = markdown;

        // Code blocks (triple backticks)
        html = html.replace(/```([^`]+)```/g, (match, code) => {
            return `<pre><code>${this.escapeHtml(code.trim())}</code></pre>`;
        });

        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Headers
        html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>');

        // Horizontal rule
        html = html.replace(/^---$/gm, '<hr>');

        // Blockquotes
        html = html.replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>');

        // Bold
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

        // Italic
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

        // Images
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2">');

        // Unordered lists
        html = html.replace(/^\- (.*)$/gm, '<li>$1</li>');
        html = html.replace(/<li>.*<\/li>\n<li>.*<\/li>/g, (match) => {
            return match.replace(/\n/g, '');
        });
        html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
            const items = match.trim().split('\n');
            if (items.length > 1) {
                return `<ul>${items.join('')}</ul>`;
            }
            return match;
        });

        // Ordered lists
        html = html.replace(/^\d\. (.*)$/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
            const items = match.trim().split('\n');
            if (items.length > 1) {
                return `<ol>${items.join('')}</ol>`;
            }
            return match;
        });

        // Paragraphs - wrap blocks of text
        const paragraphs = html.split('\n').filter(line => line.trim());
        let result = '';
        let inBlock = false;

        paragraphs.forEach(line => {
            if (line.trim().startsWith('<') || line.trim() === '') {
                result += line + '\n';
                inBlock = true;
            } else {
                if (inBlock && result.endsWith('\n')) {
                    result = result.slice(0, -1);
                }
                result += `<p>${line.trim()}</p>\n`;
                inBlock = false;
            }
        });

        return result.trim();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    insertAtCursor(action) {
        const startPos = this.input.selectionStart;
        const endPos = this.input.selectionEnd;
        const currentValue = this.input.value;
        let newValue;

        switch (action) {
            case 'bold':
                newValue = `${currentValue.slice(0, startPos)}**⏎**${currentValue.slice(endPos)}`;
                break;
            case 'italic':
                newValue = `${currentValue.slice(0, startPos)}*⏎*${currentValue.slice(endPos)}`;
                break;
            case 'code':
                newValue = `${currentValue.slice(0, startPos)}`⏎`${currentValue.slice(endPos)}`;
                break;
            case 'link':
                newValue = `${currentValue.slice(0, startPos)}[Link Text](URL)${currentValue.slice(endPos)}`;
                break;
            case 'heading':
                newValue = `${currentValue.slice(0, startPos)}# Heading ${currentValue.slice(endPos)}`;
                break;
            case 'list':
                newValue = `${currentValue.slice(0, startPos)}- Item ${currentValue.slice(endPos)}`;
                break;
            default:
                newValue = currentValue;
        }

        this.input.value = newValue;
        this.input.focus();

        // Set cursor after the inserted text
        const cursorPos = startPos + '**⏎**'.length;
        this.input.setSelectionRange(cursorPos, cursorPos);

        this.renderPreview();
        this.updateCounts();
    }

    updateCounts() {
        const text = this.input.value;
        const chars = text.length;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const lines = text.split('\n').length;
        const readingTime = Math.ceil(words / 200); // Average reading speed: 200 WPM

        document.getElementById('char-count').textContent = chars;
        document.getElementById('word-count').textContent = words;
        document.getElementById('line-count').textContent = lines;
        document.getElementById('reading-time').textContent = `${readingTime} min`;
    }

    saveDocument() {
        const fileName = prompt('Enter document name:', 'document.md');
        if (fileName && fileName.trim()) {
            const data = {
                name: fileName.trim(),
                content: this.input.value,
                createdAt: new Date().toISOString(),
                type: 'markdown'
            };

            // Save to localStorage
            let documents = JSON.parse(localStorage.getItem('markdown_documents') || '[]');
            documents.push(data);
            localStorage.setItem('markdown_documents', JSON.stringify(documents));

            this.showToast('Document saved!', 'success');
        }
    }

    downloadDocument() {
        const text = this.input.value;
        if (!text.trim()) {
            this.showToast('Nothing to download', 'error');
            return;
        }

        const blob = new Blob([text], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.download = 'document.md';
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast('Document downloaded!', 'success');
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
const app = new MarkdownStudio();