/**
 * FlowBoard - Drag-and-Drop Task Manager
 * Phase 1: Core Functionality
 */

class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.columns = ['todo', 'in-progress', 'completed'];
        this.init();
    }

    init() {
        this.renderTasks();
        this.bindEvents();
        this.setupDragAndDrop();
    }

    bindEvents() {
        // Add task form
        const form = document.getElementById('task-form');
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
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
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();

        titleInput.value = '';
        priorityInput.value = 'medium';
        dueInput.value = '';

        this.showToast('Task added successfully!', 'success');
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
        this.renderTasks();
        this.showToast('Task deleted!', 'info');
    }

    editTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        const newTitle = prompt('Edit task title:', task.title);
        if (newTitle && newTitle.trim() !== '') {
            task.title = newTitle.trim();
            this.saveTasks();
            this.renderTasks();
            this.showToast('Task updated!', 'success');
        }
    }

    toggleComplete(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.status = task.status === 'completed' ? 'todo' : 'completed';
            this.saveTasks();
            this.renderTasks();
            this.showToast('Task status changed!', 'info');
        }
    }

    moveTask(id, newStatus) {
        const task = this.tasks.find(t => t.id === id);
        if (task && task.status !== newStatus) {
            task.status = newStatus;
            this.saveTasks();
        }
    }

    renderTasks() {
        // Render tasks in each column
        this.columns.forEach(column => {
            const container = document.getElementById(`${column}-tasks`);
            if (!container) return;

            const columnTasks = this.tasks.filter(t => t.status === column);

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

                // Re-attach drag events after render
                this.attachDragEvents(container);
            }
        });
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
        column.classList.add('drag-over');
    }

    handleDragLeave(e, column) {
        column.classList.remove('drag-over');
    }

    loadTasks() {
        const stored = localStorage.getItem('flowboard_tasks');
        return stored ? JSON.parse(stored) : this.getDefaultTasks();
    }

    getDefaultTasks() {
        return [];
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