/**
 * SpendWise - Smart Expense Tracker
 * Phase 1: Core Functionality
 */

class ExpenseTracker {
    constructor() {
        this.transactions = this.loadTransactions();
        this.init();
    }

    init() {
        this.updateSummary();
        this.renderTransactions();
        this.bindEvents();
    }

    bindEvents() {
        // Add transaction form
        const form = document.getElementById('transaction-form');
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTransaction();
        });

        // Search functionality
        const searchInput = document.getElementById('search');
        searchInput?.addEventListener('input', () => {
            this.filterTransactions();
        });

        // Category filter
        const categoryFilter = document.getElementById('filter-category');
        categoryFilter?.addEventListener('change', () => {
            this.filterTransactions();
        });

        // Clear filters button
        const clearFilters = document.getElementById('clear-filters');
        clearFilters?.addEventListener('click', () => {
            this.clearFilters();
        });
    }

    addTransaction() {
        const typeSelect = document.getElementById('type');
        const amountInput = document.getElementById('amount');
        const descInput = document.getElementById('description');
        const categorySelect = document.getElementById('category');

        const transaction = {
            id: Date.now(),
            type: typeSelect.value,
            amount: parseFloat(amountInput.value),
            description: descInput.value,
            category: categorySelect.value,
            date: new Date().toISOString()
        };

        if (!transaction.description || isNaN(transaction.amount)) {
            this.showError('Please enter valid amount and description');
            return;
        }

        this.transactions.push(transaction);
        this.saveTransactions();
        this.updateSummary();
        this.renderTransactions();
        this.clearForm();
    }

    deleteTransaction(id) {
        this.transactions = this.transactions.filter(t => t.id !== id);
        this.saveTransactions();
        this.updateSummary();
        this.renderTransactions();
    }

    updateSummary() {
        const totalIncome = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => t.amount, 0);

        const balance = totalIncome - totalExpenses;

        this.setAmount('total-income', totalIncome);
        this.setAmount('total-expenses', totalExpenses);
        this.setAmount('total-balance', balance);
    }

    setAmount(elementId, amount) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const sign = elementId.includes('expense') || elementId.includes('balance') ? '-' : '+';
        element.textContent = `${sign}$$${Math.abs(amount).toFixed(2)}`;
    }

    renderTransactions() {
        const list = document.getElementById('transaction-list');
        if (!list) return;

        const filtered = this.filterTransactions();

        if (filtered.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <p>No transactions found.</p>
                    <button class="btn-add" id="add-first">Add First Transaction</button>
                </div>
            `;
            document.getElementById('add-first')?.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            return;
        }

        list.innerHTML = filtered.map(t => `
            <div class="transaction-item">
                <div class="transaction-details">
                    <div class="description">${this.escapeHtml(t.description)}</div>
                    <div class="category">${this.formatCategory(t.category)}</div>
                </div>
                <div class="transaction-amount ${t.type}">
                    ${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}
                    <button class="action-btn delete-btn" onclick="app.deleteTransaction(${t.id})">&times;</button>
                </div>
            </div>
        `).join('');
    }

    filterTransactions() {
        const search = document.getElementById('search')?.value.toLowerCase() || '';
        const category = document.getElementById('filter-category')?.value || 'all';

        return this.transactions.filter(t => {
            const matchesSearch = t.description.toLowerCase().includes(search);
            const matchesCategory = category === 'all' || t.category === category;
            return matchesSearch && matchesCategory;
        });
    }

    clearFilters() {
        document.getElementById('search').value = '';
        document.getElementById('filter-category').value = 'all';
        this.renderTransactions();
    }

    clearForm() {
        document.getElementById('transaction-form').reset();
    }

    loadTransactions() {
        const stored = localStorage.getItem('spendwise_transactions');
        return stored ? JSON.parse(stored) : [];
    }

    saveTransactions() {
        localStorage.setItem('spendwise_transactions', JSON.stringify(this.transactions));
    }

    formatCategory(category) {
        return category.charAt(0).toUpperCase() + category.slice(1);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showError(message) {
        alert(message); // Simple error display
    }
}

// Initialize app
const app = new ExpenseTracker();