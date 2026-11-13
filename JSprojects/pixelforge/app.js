/**
 * PixelForge - Browser-Based Image Editor
 * Phase 1: Core Functionality
 */

class ImageEditor {
    constructor() {
        this.canvas = document.getElementById('editor-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.history = [];
        this.redoStack = [];
        this.currentImage = null;
        this.filters = {
            brightness: 100,
            contrast: 100,
            saturation: 100,
            filter: 'none'
        };
        this.rotation = 0;
        this.flipX = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadDefaultImage();
    }

    bindEvents() {
        // Upload area click
        const uploadArea = document.getElementById('upload-area');
        uploadArea.addEventListener('click', () => {
            document.getElementById('image-input').click();
        });

        // File input change
        document.getElementById('image-input').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.loadImage(e.target.files[0]);
            }
        });

        // Drag and drop
        this.setupDragAndDrop();

        // Adjustment sliders
        document.getElementById('brightness').addEventListener('input', (e) => {
            this.filters.brightness = parseInt(e.target.value);
            document.getElementById('brightness-value').textContent = `${e.target.value}%`;
            this.applyFilters();
        });

        document.getElementById('contrast').addEventListener('input', (e) => {
            this.filters.contrast = parseInt(e.target.value);
            document.getElementById('contrast-value').textContent = `${e.target.value}%`;
            this.applyFilters();
        });

        document.getElementById('saturation').addEventListener('input', (e) => {
            this.filters.saturation = parseInt(e.target.value);
            document.getElementById('saturation-value').textContent = `${e.target.value}%`;
            this.applyFilters();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.applyFilter(filter);
                this.updateFilterButtons();
            });
        });

        // Transform buttons
        document.getElementById('rotate-btn').addEventListener('click', () => {
            this.rotateImage();
        });

        document.getElementById('flip-btn').addEventListener('click', () => {
            this.flipImage();
        });

        // Action buttons
        document.getElementById('undo-btn').addEventListener('click', () => {
            this.undo();
        });

        document.getElementById('redo-btn').addEventListener('click', () => {
            this.redo();
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetImage();
        });

        document.getElementById('download-btn').addEventListener('click', () => {
            this.downloadImage();
        });
    }

    setupDragAndDrop() {
        const uploadArea = document.getElementById('upload-area');

        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        // Highlight drop area when item is dragged over it
        uploadArea.addEventListener('dragenter', highlightDropArea);
        uploadArea.addEventListener('dragover', highlightDropArea);
        uploadArea.addEventListener('dragleave', unhighlightDropArea);
        uploadArea.addEventListener('drop', handleDrop);

        function highlightDropArea() {
            uploadArea.classList.add('drag-over');
        }

        function unhighlightDropArea() {
            uploadArea.classList.remove('drag-over');
        }

        function handleDrop(e) {
            unhighlightDropArea();
            const dt = e.dataTransfer;
            const files = dt.files;

            if (files.length > 0) {
                this.loadImage(files[0]);
            }
        }
    }

    loadDefaultImage() {
        // Create a default placeholder canvas
        this.ctx.fillStyle = '#1e293b';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#64748b';
        this.ctx.font = '16px Poppins';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Upload an image to start editing', this.canvas.width / 2, this.canvas.height / 2);

        this.showToast('Upload an image using the button or drag & drop', 'info');
    }

    loadImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const fileType = file.type.split('/')[1] || 'png';
                this.currentImage = {
                    src: img,
                    type: fileType,
                    originalData: ctx => {
                        ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
                    }
                };
                this.saveToHistory();
                this.resizeCanvasToImage(img);
                this.redrawImage();
                this.showToast('Image loaded successfully!', 'success');
            }
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    resizeCanvasToImage(img) {
        // Calculate the best fit for the image on the canvas
        const maxWidth = 1200;
        const maxHeight = 800;

        let width = img.width;
        let height = img.height;

        const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
        width *= ratio;
        height *= ratio;

        this.canvas.width = width;
        this.canvas.height = height;

        this.ctx.drawImage(img, 0, 0, width, height);

        // Reset transformations
        this.rotation = 0;
        this.flipX = false;
        this.filters = {
            brightness: 100,
            contrast: 100,
            saturation: 100,
            filter: 'none'
        };

        // Reset slider values
        document.getElementById('brightness').value = 100;
        document.getElementById('contrast').value = 100;
        document.getElementById('saturation').value = 100;
        document.getElementById('brightness-value').textContent = '100%';
        document.getElementById('contrast-value').textContent = '100%';
        document.getElementById('saturation-value').textContent = '100%';

        // Show edit panel
        document.getElementById('adjustments-section').style.display = 'block';
        document.getElementById('filters-section').style.display = 'block';
        document.getElementById('transform-section').style.display = 'block';
        document.getElementById('actions-section').style.display = 'block';
        document.getElementById('canvas-overlay').style.display = 'none';
    }

    redrawImage() {
        if (!this.currentImage) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Calculate center
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        // Save context
        this.ctx.save();

        // Move to center
        this.ctx.translate(cx, cy);

        // Apply rotation
        if (this.rotation !== 0) {
            this.ctx.rotate(this.rotation * Math.PI / 180);
        }

        // Apply flip
        if (this.flipX) {
            this.ctx.scale(-1, 1);
        }

        // Move back
        this.ctx.translate(-cx, -cy);

        // Draw the image
        this.ctx.drawImage(this.currentImage.src, 0, 0, this.canvas.width, this.canvas.height);

        // Apply color filters
        const brightness = this.filters.brightness / 100;
        const contrast = this.filters.contrast / 100;
        const saturation = this.filters.saturation / 100;

        // Reset transform
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);

        // Apply brightness, contrast, saturation as CSS-like filter
        const filter = [];
        if (brightness !== 1) filter.push(`brightness(${brightness})`);
        if (contrast !== 1) filter.push(`contrast(${contrast})`);
        if (saturation !== 1) filter.push(`saturate(${saturation})`);

        if (filter.length > 0) {
            this.ctx.filter = filter.join(' ');
            this.ctx.globalCompositeOperation = 'multiply';
            this.ctx.drawImage(this.currentImage.src, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.filter = 'none';
        }

        // Apply named filter
        if (this.filters.filter !== 'none') {
            this.ctx.filter = this.getFilterValue(this.filters.filter);
            this.ctx.globalCompositeOperation = 'multiply';
            this.ctx.drawImage(this.currentImage.src, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.filter = 'none';
        }

        // Restore context
        this.ctx.restore();
    }

    applyFilters() {
        this.redrawImage();
    }

    getFilterValue(filter) {
        switch (filter) {
            case 'grayscale':
                return 'grayscale(100%)';
            case 'sepia':
                return 'sepia(100%)';
            case 'blur':
                return 'blur(5px)';
            default:
                return 'none';
        }
    }

    applyFilter(filter) {
        const previousFilter = this.filters.filter;
        this.filters.filter = filter;

        if (filter === 'none') {
            this.filters = {
                brightness: 100,
                contrast: 100,
                saturation: 100,
                filter: 'none'
            };
            document.getElementById('brightness').value = 100;
            document.getElementById('contrast').value = 100;
            document.getElementById('saturation').value = 100;
            document.getElementById('brightness-value').textContent = '100%';
            document.getElementById('contrast-value').textContent = '100%';
            document.getElementById('saturation-value').textContent = '100%';
        }

        this.applyFilters();
    }

    updateFilterButtons() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.style.borderColor = '#334155';
        });

        const activeBtn = document.querySelector(`.filter-btn[data-filter="${this.filters.filter}"]`);
        if (activeBtn) {
            activeBtn.style.borderColor = '#10b981';
        }
    }

    rotateImage() {
        this.rotation += 90;
        if (this.rotation >= 360) this.rotation -= 360;
        this.saveToHistory();
        this.applyFilters();
        this.showToast(`Rotated ${this.rotation}°`, 'info');
    }

    flipImage() {
        this.flipX = !this.flipX;
        this.saveToHistory();
        this.applyFilters();
        this.showToast(this.flipX ? 'Image flipped horizontally' : 'Image orientation restored', 'info');
    }

    resetImage() {
        if (!this.currentImage || !this.currentImage.originalData) return;

        this.filters = {
            brightness: 100,
            contrast: 100,
            saturation: 100,
            filter: 'none'
        };
        this.rotation = 0;
        this.flipX = false;

        document.getElementById('brightness').value = 100;
        document.getElementById('contrast').value = 100;
        document.getElementById('saturation').value = 100;
        document.getElementById('brightness-value').textContent = '100%';
        document.getElementById('contrast-value').textContent = '100%';
        document.getElementById('saturation-value').textContent = '100%';

        this.applyFilters();
        this.updateFilterButtons();
        this.showToast('Image reset to original', 'info');
    }

    undo() {
        if (this.history.length <= 1) {
            this.showToast('Nothing to undo', 'error');
            return;
        }

        this.history.pop();
        this.redoStack.push(this.filters);
        this.restoreFromHistory();
        this.showToast('Undo applied', 'info');
    }

    redo() {
        if (this.redoStack.length === 0) {
            this.showToast('Nothing to redo', 'error');
            return;
        }

        this.history.push({...this.filters});
        const state = this.redoStack.pop();
        this.filters = state;

        document.getElementById('brightness').value = this.filters.brightness;
        document.getElementById('contrast').value = this.filters.contrast;
        document.getElementById('saturation').value = this.filters.saturation;
        document.getElementById('brightness-value').textContent = `${this.filters.brightness}%`;
        document.getElementById('contrast-value').textContent = `${this.filters.contrast}%`;
        document.getElementById('saturation-value').textContent = `${this.filters.saturation}%`;

        this.applyFilters();
        this.updateFilterButtons();
        this.showToast('Redo applied', 'info');
    }

    saveToHistory() {
        const state = {
            filters: {...this.filters},
            rotation: this.rotation,
            flipX: this.flipX
        };
        this.history.push(state);
        this.redoStack = []; // Clear redo stack on new action
    }

    restoreFromHistory() {
        this.redoStack = [];
        const state = this.history[this.history.length - 1];
        if (state) {
            this.filters = {...state.filters};
            this.rotation = state.rotation;
            this.flipX = state.flipX;

            document.getElementById('brightness').value = this.filters.brightness;
            document.getElementById('contrast').value = this.filters.contrast;
            document.getElementById('saturation').value = this.filters.saturation;
            document.getElementById('brightness-value').textContent = `${this.filters.brightness}%`;
            document.getElementById('contrast-value').textContent = `${this.filters.contrast}%`;
            document.getElementById('saturation-value').textContent = `${this.filters.saturation}%`;

            this.applyFilters();
            this.updateFilterButtons();
        }
    }

    downloadImage() {
        if (!this.currentImage || this.canvas.width === 0) {
            this.showToast('No image to download', 'error');
            return;
        }

        const fileName = 'pixelforge-image.png';

        // Get the filtered image data
        const dataURL = this.canvas.toDataURL('image/png', 0.9);

        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataURL;
        link.click();

        this.showToast('Image downloaded successfully!', 'success');
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

// Initialize editor
const editor = new ImageEditor();