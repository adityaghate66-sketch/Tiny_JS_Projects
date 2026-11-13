/**
 * FlowBoard - Drag-and-Drop Task Manager
 * Phase 2: Advanced Functionality
 */

class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.history = [];
        this.redoStack = [];
        this.init();
    }

    init() {
        this.renderTasks();
        this.renderBoards();
        this.bindEvents();
        this.setupDragAndDrop();
        this.renderAnalytics();
    }

    bindEvents() {
        // Add task form
        const form = document.getElementById('task-form');
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        // Search functionality
        document.getElementById('search-tasks')?.addEventListener('input', (e) => {
            this.filterTasks(e.target.value);
        });

        // Undo button
        document.getElementById('undo-btn')?.addEventListener('click', () => {
            this.undo();
        });

        // Redo button
        document.getElementById('redo-btn')?.addEventListener('click', () => {
            this.redo();
        });

        // Export button
        document.getElementById('export-btn')?.addEventListener('click', () => {
            this.exportData();
        });

        // Import button
        document.getElementById('import-btn')?.addEventListener('click', () => {
            this.importDialog();
        });
    }

    addTask() {
        const titleInput = document.getElementById('task-title');
        const priorityInput = document.getElementById('task-priority');
        const dueInput = document.getElementById('task-due');

        const title = titleInput.value.trim();
        if (!title) {
            this.showToast('Please enter a task title', 'error');
            return;
        }

        const task = {
            id: Date.now(),
            title: title,
            description: '',
            priority: priorityInput.value,
            dueDate: dueInput.value || null,
            status: 'todo',
            createdAt: new Date().toISOString(),
            order: this.getTasksInColumn('todo').length
        };

        this.tasks.push(task);
        this.saveToHistory('add', task.id, {...task});
        this.saveTasks();
        this.renderTasks();
        this.renderAnalytics();

        titleInput.value = '';
        priorityInput.value = 'medium';
        dueInput.value = '';

        this.showToast('Task added successfully!', 'success');
    }

    deleteTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveToHistory('delete', id, task);
        this.saveTasks();
        this.renderTasks();
        this.renderAnalytics();
        this.showToast('Task deleted!', 'info');
    }

    editTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        const newTitle = prompt('Edit task title:', task.title);
        if (newTitle && newTitle.trim() !== '') {
            task.title = newTitle.trim();
            task.editedAt = new Date().toISOString();
            this.saveToHistory('edit', id, {...task});
            this.saveTasks();
            this.renderTasks();
            this.renderAnalytics();
            this.showToast('Task updated!', 'success');
        }
    }

    toggleComplete(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            const oldStatus = task.status;
            const oldState = {...task};
            task.status = task.status === 'completed' ? 'todo' : 'completed';
            if (task.status === 'completed') {
                task.completedAt = new Date().toISOString();
            } else {
                delete task.completedAt;
            }
            this.saveToHistory('toggle', id, {...task}, oldState, null, oldStatus);
            this.saveTasks();
            this.renderTasks();
            this.renderAnalytics();
            this.showToast('Task status changed!', 'info');
        }
    }

    moveTask(id, newStatus) {
        const task = this.tasks.find(t => t.id === id);
        if (task && task.status !== newStatus) {
            const oldStatus = task.status;
            const oldState = {...task};
            task.status = newStatus;
            task.movedAt = new Date().toISOString();
            this.saveToHistory('move', id, {...task}, oldState, null, oldStatus);
            this.saveTasks();
        }
    }

    getTasksInColumn(status) {
        return this.tasks.filter(t => t.status === status);
    }

    filterTasks(query) {
        const filtered = this.tasks.filter(t =>
            t.title.toLowerCase().includes(query.toLowerCase())
        );

        const container = document.getElementById('todo-tasks');
        if (container && query === '') {
            this.renderTasks();
            return;
        }
    }

    renderTasks() {
        this.columns.forEach(column => {
            const container = document.getElementById(`${column}-tasks`);
            if (!container) return;

            const columnTasks = this.getTasksInColumn(column).sort((a, b) => (a.order || 0) - (b.order || 0));

            if (columnTasks.length === 0) {
                container.innerHTML = `<div class="empty-state">No tasks here</div>`;
            } else {
                container.innerHTML = columnTasks.map(task => `
                    <div class="task"
                         data-id="${task.id}"
                         data-status="${task.status}"
                         draggable="true">
                        <div class="task-title ${task.status === 'completed' ? 'completed' : ''}">
                            ${this.escapeHtml(task.title)}
                        </div>
                        <div class="task-meta">
                            <span class="task-priority ${task.priority}">${task.priority}</span>
                            ${task.dueDate ? `<span class="task-due">Due: ${this.formatDate(task.dueDate)}</span>` : ''}
                        </div>
                        <div class="task-actions">
                            <button class="action-sm edit-btn" onclick="app.editTask(${task.id})" title="Edit">✏️</button>
                            <button class="action-sm check-btn" onclick="app.toggleComplete(${task.id})" title="Toggle Complete">
                                ${task.status === 'completed' ? '↺' : '✓'}
                            </button>
                            <button class="action-sm delete-btn" onclick="app.deleteTask(${task.id})" title="Delete">🗑️</button>
                        </div>
                    </div>
                `).join('');

                this.attachDragEvents(container);
            }
        });
    }

    renderBoards() {
        // Render multiple boards section if needed
        // For Phase 1, we keep the single board structure
    }

    renderAnalytics() {
        const analyticsContainer = document.getElementById('analytics-section');
        if (!analyticsContainer) return;

        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(t => t.status === 'completed').length;
        const inProgressTasks = this.tasks.filter(t => t.status === 'in-progress').length;
        const todoTasks = this.tasks.filter(t => t.status === 'todo').length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        const overdueTasks = this.tasks.filter(t =>
            t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
        );

        analyticsContainer.innerHTML = `
            <h3>Task Analytics</h3>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${totalTasks}</div>
                    <div class="stat-label">Total Tasks</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${completionRate}%</div>
                    <div class="stat-label">Completion Rate</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${completedTasks}</div>
                    <div class="stat-label">Completed</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${overdueTasks.length}</div>
                    <div class="stat-label">Overdue</div>
                </div>
            </div>
        `;
    }

    attachDragEvents(container) {
        const tasks = container.querySelectorAll('.task');

        tasks.forEach(task => {
            task.addEventListener('dragstart', (e) => {
                this.handleDragStart(e, task);
            });

            task.addEventListener('dragend', (e) => {
                this.handleDragEnd(e);
            });
        });
    }

    setupDragAndDrop() {
        const columns = document.querySelectorAll('.column');

        columns.forEach(column => {
            column.addEventListener('dragover', (e) => {
                e.preventDefault();
                this.handleDragOver(e, column);
            });

            column.addEventListener('drop', (e) => {
                e.preventDefault();
                const taskId = parseInt(e.dataTransfer.getData('text/plain'));
                const newStatus = column.dataset.column;

                if (taskId && newStatus) {
                    this.moveTask(taskId, newStatus);
                    this.renderTasks();
                }
            });

            column.addEventListener('dragleave', (e) => {
                this.handleDragLeave(e, column);
            });
        });
    }

    handleDragStart(e, task) {
        const taskId = parseInt(task.dataset.id);
        e.dataTransfer.setData('text/plain', taskId.toString());
        e.dataTransfer.effectAllowed = 'move';

        setTimeout(() => {
            if (e.target.classList.contains('task')) {
                e.target.classList.add('dragging');
            }
        }, 0);
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    handleDragOver(e, column) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        column.classList.add('drag-over');
    }

    handleDragLeave(e, column) {
        column.classList.remove('drag-over');
    }

    undo() {
        if (this.history.length === 0) {
            this.showToast('Nothing to undo', 'error');
            return;
        }

        const lastAction = this.history.pop();
        this.redoStack.push(lastAction);

        switch (lastAction.action) {
            case 'add':
                this.deleteTask(lastAction.taskId);
                break;
            case 'delete':
                this.tasks.push(lastAction.taskData);
                break;
            case 'edit':
                // Restore old state
                const task = this.tasks.find(t => t.id === lastAction.taskId);
                if (task && lastAction.oldState) {
                    Object.assign(task, lastAction.oldState);
                    this.saveTasks();
                    this.renderTasks();
                    this.renderAnalytics();
                }
                this.showToast('Undo applied', 'info');
                return;
            case 'toggle':
                // Toggle back to original state
                const toggleTask = this.tasks.find(t => t.id === lastAction.taskId);
                if (toggleTask && lastAction.oldStatus) {
                    toggleTask.status = lastAction.oldStatus;
                    if (lastAction.oldStatus === 'todo') {
                        delete toggleTask.completedAt;
                    }
                    this.saveTasks();
                    this.renderTasks();
                    this.renderAnalytics();
                }
                this.showToast('Undo applied', 'info');
                return;
            case 'move':
                // Restore old position
                const movedTask = this.tasks.find(t => t.id === lastAction.taskId);
                if (movedTask && lastAction.oldStatus) {
                    movedTask.status = lastAction.oldStatus;
                    this.saveTasks();
                    this.renderTasks();
                    this.renderAnalytics();
                }
                this.showToast('Undo applied', 'info');
                return;
        }

        this.saveTasks();
        this.renderTasks();
        this.renderAnalytics();
        this.showToast('Undo applied', 'info');
    }

    redo() {
        if (this.redoStack.length === 0) {
            this.showToast('Nothing to redo', 'error');
            return;
        }

        const nextAction = this.redoStack.pop();
        this.history.push(nextAction);

        switch (nextAction.action) {
            case 'add':
                // Re-add the task
                if (!this.tasks.find(t => t.id === nextAction.taskId) && nextAction.data) {
                    this.tasks.push(nextAction.data);
                }
                this.saveTasks();
                this.renderTasks();
                this.renderAnalytics();
                break;
            case 'delete':
                this.deleteTask(nextAction.taskId);
                break;
            case 'edit':
                const task = this.tasks.find(t => t.id === nextAction.taskId);
                if (task && nextAction.newState) {
                    Object.assign(task, nextAction.newState);
                    this.saveTasks();
                    this.renderTasks();
                    this.renderAnalytics();
                }
                this.showToast('Redo applied', 'info');
                return;
            case 'toggle':
                const toggleTask = this.tasks.find(t => t.id === nextAction.taskId);
                if (toggleTask && nextAction.newStatus) {
                    toggleTask.status = nextAction.newStatus;
                    if (nextAction.newStatus === 'completed') {
                        toggleTask.completedAt = new Date().toISOString();
                    } else {
                        delete toggleTask.completedAt;
                    }
                    this.saveTasks();
                    this.renderTasks();
                    this.renderAnalytics();
                }
                this.showToast('Redo applied', 'info');
                return;
            case 'move':
                const movedTask = this.tasks.find(t => t.id === nextAction.taskId);
                if (movedTask && nextAction.newStatus) {
                    movedTask.status = nextAction.newStatus;
                    this.saveTasks();
                    this.renderTasks();
                    this.renderAnalytics();
                }
                this.showToast('Redo applied', 'info');
                return;
        }

        this.saveTasks();
        this.renderTasks();
        this.renderAnalytics();
        this.showToast('Redo applied', 'info');
    }

    saveToHistory(action, taskId, data = null, oldState = null, newState = null, oldStatus = null) {
        const state = {
            action,
            taskId: taskId,
            data: data,
            oldState: oldState,
            newState: newState,
            oldStatus: oldStatus,
            newStatus: data?.status,
            timestamp: new Date().toISOString()
        };

        this.history.push(state);
        this.redoStack = []; // Clear redo stack on new action

        // Limit history size
        if (this.history.length > 100) {
            this.history.shift();
        }
    }

    exportData() {
        const exportData = {
            tasks: this.tasks,
            exportedAt: new Date().toISOString(),
            version: '1.0'
        };

        const jsonStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.download = 'flowboard-export.json';
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast('Data exported successfully!', 'success');
    }

    importData(jsonData) {
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

            if (data.tasks && Array.isArray(data.tasks)) {
                this.tasks = data.tasks;
                this.saveTasks();
                this.renderTasks();
                this.renderAnalytics();
                this.showToast(`Imported ${data.tasks.length} tasks!`, 'success');
            } else {
                this.showToast('Invalid import data format', 'error');
            }
        } catch (e) {
            this.showToast('Invalid JSON file', 'error');
        }
    }

    importDialog() {
        const jsonText = prompt('Paste your FlowBoard export JSON:');
        if (jsonText && jsonText.trim()) {
            this.importData(jsonText);
        }
    }

    loadTasks() {
        const stored = localStorage.getItem('flowboard_tasks');
        return stored ? JSON.parse(stored) : [];
    }

    saveTasks() {
        localStorage.setItem('flowboard_tasks', JSON.stringify(this.tasks));
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
const app = new TaskManager();