// Game Design Studio - Interactive Canvas Application

class GameDesigner {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.selectedElement = null;
        this.gameElements = [];
        this.gridSize = 50;
        this.backgroundColor = '#1a1a2e';
        
        this.elementTypes = {
            player: { emoji: '👤', color: '#6c5ce7', label: 'Player' },
            enemy: { emoji: '👾', color: '#e94560', label: 'Enemy' },
            coin: { emoji: '💰', color: '#f1c40f', label: 'Coin' },
            obstacle: { emoji: '🧱', color: '#95a5a6', label: 'Obstacle' },
            powerup: { emoji: '⭐', color: '#00b894', label: 'Power-up' },
            goal: { emoji: '🏁', color: '#0984e3', label: 'Goal' }
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.drawGrid();
        this.loadSavedDesigns();
        this.updateElementCount();
    }
    
    setupEventListeners() {
        // Element selection buttons
        document.querySelectorAll('.element-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.element-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.selectedElement = e.target.dataset.element;
            });
        });
        
        // Canvas click event
        this.canvas.addEventListener('click', (e) => {
            if (this.selectedElement) {
                this.placeElement(e);
            }
        });
        
        // Background color change
        document.getElementById('backgroundColor').addEventListener('change', (e) => {
            this.backgroundColor = e.target.value;
            this.redraw();
        });
        
        // Grid size change
        document.getElementById('gridSize').addEventListener('input', (e) => {
            this.gridSize = parseInt(e.target.value);
            document.getElementById('gridSizeValue').textContent = e.target.value;
            this.redraw();
        });
        
        // Action buttons
        document.getElementById('clearCanvas').addEventListener('click', () => this.clearCanvas());
        document.getElementById('saveDesign').addEventListener('click', () => this.saveDesign());
        document.getElementById('exportDesign').addEventListener('click', () => this.exportDesign());
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
    
    placeElement(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const element = {
            type: this.selectedElement,
            x: x,
            y: y,
            id: Date.now()
        };
        
        this.gameElements.push(element);
        this.redraw();
        this.updateElementCount();
        
        // Show feedback
        this.showNotification(`${this.elementTypes[this.selectedElement].label} placed!`);
    }
    
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(108, 92, 231, 0.1)';
        this.ctx.lineWidth = 1;
        
        // Draw vertical lines
        for (let x = 0; x <= this.canvas.width; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let y = 0; y <= this.canvas.height; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    drawElement(element) {
        const elementConfig = this.elementTypes[element.type];
        
        // Draw a circle background
        this.ctx.beginPath();
        this.ctx.arc(element.x, element.y, 20, 0, Math.PI * 2);
        this.ctx.fillStyle = elementConfig.color;
        this.ctx.fill();
        
        // Draw emoji
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(elementConfig.emoji, element.x, element.y);
        
        // Draw border
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
    
    redraw() {
        // Clear canvas
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Redraw grid
        this.drawGrid();
        
        // Redraw all elements
        this.gameElements.forEach(element => {
            this.drawElement(element);
        });
    }
    
    clearCanvas() {
        if (this.gameElements.length === 0) {
            this.showNotification('Canvas is already empty!', 'info');
            return;
        }
        
        if (confirm('Are you sure you want to clear the canvas?')) {
            this.gameElements = [];
            this.redraw();
            this.updateElementCount();
            this.showNotification('Canvas cleared!', 'success');
        }
    }
    
    saveDesign() {
        const gameName = document.getElementById('gameName').value || 'Untitled Game';
        const gameGenre = document.getElementById('gameGenre').value;
        
        if (this.gameElements.length === 0) {
            this.showNotification('Please add some elements before saving!', 'warning');
            return;
        }
        
        const design = {
            id: Date.now(),
            name: gameName,
            genre: gameGenre,
            elements: this.gameElements,
            backgroundColor: this.backgroundColor,
            gridSize: this.gridSize,
            thumbnail: this.canvas.toDataURL(),
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage
        const savedDesigns = this.getSavedDesigns();
        savedDesigns.push(design);
        localStorage.setItem('gameDesigns', JSON.stringify(savedDesigns));
        
        this.showNotification(`Design "${gameName}" saved successfully!`, 'success');
        this.loadSavedDesigns();
    }
    
    getSavedDesigns() {
        const designs = localStorage.getItem('gameDesigns');
        return designs ? JSON.parse(designs) : [];
    }
    
    loadSavedDesigns() {
        const designs = this.getSavedDesigns();
        const gallery = document.getElementById('designGallery');
        
        if (designs.length === 0) {
            gallery.innerHTML = '<p class="empty-message">No saved designs yet. Start creating!</p>';
            return;
        }
        
        gallery.innerHTML = '';
        
        designs.forEach(design => {
            const card = document.createElement('div');
            card.className = 'design-card';
            
            const img = document.createElement('img');
            img.src = design.thumbnail;
            img.alt = this.escapeHtml(design.name);
            
            const title = document.createElement('h3');
            title.textContent = design.name;
            
            const meta = document.createElement('div');
            meta.className = 'meta';
            meta.innerHTML = `
                <span>Genre: ${this.escapeHtml(design.genre)}</span><br>
                <span>Elements: ${design.elements.length}</span><br>
                <span>Created: ${new Date(design.timestamp).toLocaleDateString()}</span>
            `;
            
            const actions = document.createElement('div');
            actions.className = 'actions';
            
            const loadBtn = document.createElement('button');
            loadBtn.className = 'btn btn-primary';
            loadBtn.textContent = 'Load';
            loadBtn.addEventListener('click', () => this.loadDesign(design.id));
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-secondary';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => this.deleteDesign(design.id));
            
            actions.appendChild(loadBtn);
            actions.appendChild(deleteBtn);
            
            card.appendChild(img);
            card.appendChild(title);
            card.appendChild(meta);
            card.appendChild(actions);
            
            gallery.appendChild(card);
        });
    }
    
    loadDesign(id) {
        const designs = this.getSavedDesigns();
        const design = designs.find(d => d.id === id);
        
        if (design) {
            this.gameElements = design.elements;
            this.backgroundColor = design.backgroundColor;
            this.gridSize = design.gridSize;
            
            document.getElementById('gameName').value = design.name;
            document.getElementById('gameGenre').value = design.genre;
            document.getElementById('backgroundColor').value = design.backgroundColor;
            document.getElementById('gridSize').value = design.gridSize;
            document.getElementById('gridSizeValue').textContent = design.gridSize;
            
            this.redraw();
            this.updateElementCount();
            
            // Scroll to designer
            document.getElementById('designer').scrollIntoView({ behavior: 'smooth' });
            
            this.showNotification(`Design "${design.name}" loaded!`, 'success');
        }
    }
    
    deleteDesign(id) {
        if (confirm('Are you sure you want to delete this design?')) {
            let designs = this.getSavedDesigns();
            designs = designs.filter(d => d.id !== id);
            localStorage.setItem('gameDesigns', JSON.stringify(designs));
            this.loadSavedDesigns();
            this.showNotification('Design deleted!', 'success');
        }
    }
    
    exportDesign() {
        const gameName = document.getElementById('gameName').value || 'game-design';
        const gameGenre = document.getElementById('gameGenre').value;
        
        if (this.gameElements.length === 0) {
            this.showNotification('Please add some elements before exporting!', 'warning');
            return;
        }
        
        // Create export data
        const exportData = {
            name: gameName,
            genre: gameGenre,
            elements: this.gameElements,
            backgroundColor: this.backgroundColor,
            gridSize: this.gridSize,
            canvasSize: {
                width: this.canvas.width,
                height: this.canvas.height
            },
            exportDate: new Date().toISOString()
        };
        
        // Download as JSON
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.sanitizeFilename(gameName)}-design.json`;
        link.click();
        
        // Also export canvas as image
        const imageUrl = this.canvas.toDataURL('image/png');
        const imageLink = document.createElement('a');
        imageLink.href = imageUrl;
        imageLink.download = `${this.sanitizeFilename(gameName)}-preview.png`;
        imageLink.click();
        
        this.showNotification('Design exported successfully!', 'success');
    }
    
    updateElementCount() {
        document.getElementById('elementCount').textContent = this.gameElements.length;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    sanitizeFilename(filename) {
        // Remove any path traversal attempts and special characters
        return filename
            .replace(/[^a-zA-Z0-9\s-]/g, '') // Only allow alphanumeric, spaces, and hyphens
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .toLowerCase()
            .slice(0, 100); // Limit length to 100 characters
    }
    
    showNotification(message, type = 'info') {
        // Validate notification type
        const validTypes = ['info', 'success', 'warning'];
        const safeType = validTypes.includes(type) ? type : 'info';
        
        // Map types to colors
        const colors = {
            success: '#00b894',
            warning: '#fdcb6e',
            info: '#6c5ce7'
        };
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${safeType}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${colors[safeType]};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the game designer when DOM is loaded
let gameDesigner;
document.addEventListener('DOMContentLoaded', () => {
    gameDesigner = new GameDesigner();
});
