/**
 * SpendWise - Smart Expense Tracker
 * Phase 2: Advanced Functionality
 */

class ExpenseTracker {
    constructor() {
        this.transactions = this.loadTransactions();
        this.budget = parseFloat(localStorage.getItem('spendwise_budget')) || 0;
        this.theme = localStorage.getItem('spendwise_theme') || 'light';
        this.init();
    }

    init() {
        this.updateSummary();
        this.renderTransactions();
        this.bindEvents();
        this.updateBudgetProgress();
        this.renderCharts();
        this.setTheme(this.theme);
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

        // Budget setting
        const setBudgetBtn = document.getElementById('set-budget');
        setBudgetBtn?.addEventListener('click', () => {
            this.setBudget();
        });

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle?.addEventListener('click', () => {
            this.toggleTheme();
        });

        // CSV Export
        const exportBtn = document.getElementById('export-csv');
        exportBtn?.addEventListener('click', () => {
            this.exportToCSV();
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

        if (!transaction.description || isNaN(transaction.amount) || transaction.amount <= 0) {
            this.showToast('Please enter a valid amount and description', 'error');
            return;
        }

        this.transactions.push(transaction);
        this.saveTransactions();
        this.updateSummary();
        this.updateBudgetProgress();
        this.renderTransactions();
        this.renderCharts();
        this.clearForm();
        this.showToast('Transaction added successfully!', 'success');
    }

    deleteTransaction(id) {
        this.transactions = this.transactions.filter(t => t.id !== id);
        this.saveTransactions();
        this.updateSummary();
        this.updateBudgetProgress();
        this.renderTransactions();
        this.renderCharts();
        this.showToast('Transaction deleted!', 'info');
    }

    editTransaction(id) {
        const transaction = this.transactions.find(t => t.id === id);
        if (!transaction) return;

        const newAmount = prompt('Enter new amount:', transaction.amount);
        const newDesc = prompt('Enter new description:', transaction.description);

        if (newAmount && !isNaN(parseFloat(newAmount)) && parseFloat(newAmount) > 0) {
            transaction.amount = parseFloat(newAmount);
            transaction.description = newDesc || transaction.description;
            transaction.editedAt = new Date().toISOString();
            this.saveTransactions();
            this.updateSummary();
            this.updateBudgetProgress();
            this.renderTransactions();
            this.renderCharts();
            this.showToast('Transaction updated!', 'success');
        }
    }

    updateSummary() {
        const totalIncome = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

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

    updateBudgetProgress() {
        const totalExpenses = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const budgetSection = document.getElementById('budget-progress-section');
        const budgetInput = document.getElementById('budget-input');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        const warningMessage = document.getElementById('warning-message');

        budgetInput.value = this.budget;

        if (this.budget > 0 && totalExpenses > 0) {
            budgetSection.style.display = 'block';
            const percentage = Math.min((totalExpenses / this.budget) * 100, 100);
            progressFill.style.width = `${percentage}%`;

            progressText.textContent = `$${totalExpenses.toFixed(2)} / $${this.budget.toFixed(2)}`;

            if (percentage >= 90) {
                progressFill.className = 'progress-fill danger';
                warningMessage.textContent = '⚠️ Budget warning: 90% of monthly budget reached!';
                warningMessage.className = 'warning-message danger';
            } else if (percentage >= 75) {
                progressFill.className = 'progress-fill warning';
                warningMessage.textContent = '⚠️ Approaching budget limit';
                warningMessage.className = 'warning-message warning';
            } else {
                progressFill.className = 'progress-fill';
                warningMessage.textContent = '';
            }
        } else {
            budgetSection.style.display = 'none';
        }
    }

    setBudget() {
        const budgetInput = document.getElementById('budget-input');
        const newBudget = parseFloat(budgetInput.value);

        if (!isNaN(newBudget) && newBudget > 0) {
            this.budget = newBudget;
            localStorage.setItem('spendwise_budget', this.budget.toString());
            this.updateBudgetProgress();
            this.renderCharts();
            this.showToast(`Monthly budget set to $${this.budget.toFixed(2)}`, 'success');
        } else {
            this.showToast('Please enter a valid budget amount', 'error');
        }
    }

    setDateFilter(type) {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        return this.transactions.filter(t => {
            const date = new Date(t.date);
            return t.type === type && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });
    }

    renderCharts() {
        const monthlyExpenses = this.getMonthlyExpenses();
        const categoryExpenses = this.getCategoryExpenses();

        // Trend Chart
        const trendCtx = document.getElementById('trend-chart');
        if (trendCtx) {
            const trendChart = new Chart(trendCtx, {
                type: 'line',
                data: {
                    labels: monthlyExpenses.labels,
                    datasets: [{
                        label: 'Expenses',
                        data: monthlyExpenses.data,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true,
                        tension: 0.4
                    }, {
                        label: 'Income',
                        data: monthlyExpenses.incomeData,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // Category Chart
        const categoryCtx = document.getElementById('category-chart');
        if (categoryCtx) {
            const colors = ['#4f46e5', '#10b981', '#ef4444', '#f59e0b', '#3b82f6'];
            new Chart(categoryCtx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(categoryExpenses),
                    datasets: [{
                        data: Object.values(categoryExpenses),
                        backgroundColor: colors,
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }

    getMonthlyExpenses() {
        const expTransactions = this.transactions.filter(t => t.type === 'expense');
        const incTransactions = this.transactions.filter(t => t.type === 'income');

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const expenseData = new Array(12).fill(0);
        const incomeData = new Array(12).fill(0);

        expTransactions.forEach(t => {
            const date = new Date(t.date);
            expenseData[date.getMonth()] += t.amount;
        });

        incTransactions.forEach(t => {
            const date = new Date(t.date);
            incomeData[date.getMonth()] += t.amount;
        });

        return {
            labels: months,
            data: expenseData,
            incomeData: incomeData
        };
    }

    getCategoryExpenses() {
        const expenses = this.transactions.filter(t => t.type === 'expense');
        const categoryData = {};

        expenses.forEach(t => {
            const category = this.formatCategory(t.category);
            categoryData[category] = (categoryData[category] || 0) + t.amount;
        });

        return categoryData;
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
                    <div class="date">${this.formatDate(t.date)}</div>
                </div>
                <div class="transaction-actions">
                    <button class="action-btn edit-btn" onclick="app.editTransaction(${t.id})">✏️</button>
                    <button class="action-btn delete-btn" onclick="app.deleteTransaction(${t.id})">&times;</button>
                </div>
                <div class="transaction-amount ${t.type}">
                    ${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}
                </div>
            </div>
        `).join('');

        // Re-attach delete event handlers after render
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.onclick = null; // Prevent duplicate handlers
        });
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

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showToast(message, type = 'info') {
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

    setTheme(theme) {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
            localStorage.setItem('spendwise_theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
            localStorage.setItem('spendwise_theme', 'light');
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(this.theme);
    }

    exportToCSV() {
        if (this.transactions.length === 0) {
            this.showToast('No transactions to export', 'error');
            return;
        }

        const headers = ['ID', 'Type', 'Amount', 'Description', 'Category', 'Date'];
        const rows = this.transactions.map(t => [
            t.id,
            t.type,
            t.amount,
            `"${t.description}"`,
            t.category,
            t.date
        ].join(','));

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `spendwise-transactions-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast('CSV exported successfully!', 'success');
    }
}

// Initialize app
const app = new ExpenseTracker();