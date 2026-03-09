// State Management
let tasks = JSON.parse(localStorage.getItem('daystream_tasks')) || [];
let categories = JSON.parse(localStorage.getItem('daystream_categories')) || [
    { id: 'work', name: 'Work', color: '#6366f1', emoji: '💼', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 'rest', name: 'Rest', color: '#10b981', emoji: '😴', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    { id: 'chores', name: 'Chores', color: '#f59e0b', emoji: '🧹', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    { id: 'social', name: 'Social', color: '#ec4899', emoji: '🎉', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }
];
let currentWeekOffset = 0;
let selectedCategoryId = null;

// DOM Elements
const taskForm = document.getElementById('taskForm');
const editForm = document.getElementById('editForm');
const categoryForm = document.getElementById('categoryForm');
const tooltip = document.getElementById('tooltip');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeWeekDisplay();
    initializeTimeHeader();
    initializeDays();
    renderCategorySelector();
    renderLegend();
    renderTimeline();
    setupEventListeners();
    updateCurrentTimeLine();
    setInterval(updateCurrentTimeLine, 60000);
});

// Week Navigation
function getWeekDates(offset = 0) {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1 + (offset * 7));
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return { start: startOfWeek, end: endOfWeek };
}

function initializeWeekDisplay() {
    const { start, end } = getWeekDates(currentWeekOffset);
    const formatDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const prefix = currentWeekOffset === 0 ? '' : currentWeekOffset < 0 ? '← ' : '→ ';
    document.getElementById('weekDisplay').textContent = 
        `${prefix}${formatDate(start)} - ${formatDate(end)}${currentWeekOffset === 0 ? ' (Current)' : ''}`;
}

function changeWeek(direction) {
    currentWeekOffset += direction;
    initializeWeekDisplay();
    renderTimeline();
}

// Timeline Initialization
function initializeTimeHeader() {
    const header = document.getElementById('timeHeader');
    header.innerHTML = '';
    for (let i = 0; i < 24; i++) {
        const marker = document.createElement('div');
        marker.className = 'time-marker';
        marker.textContent = i === 0 ? '12a' : i < 12 ? `${i}a` : i === 12 ? '12p' : `${i-12}p`;
        header.appendChild(marker);
    }
}

function initializeDays() {
    const container = document.getElementById('daysContainer');
    container.innerHTML = '';
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    days.forEach((day, index) => {
        const row = document.createElement('div');
        row.className = 'day-row';
        row.innerHTML = `
            <div class="day-label">${day}</div>
            <div class="day-timeline" data-day="${index}"></div>
        `;
        container.appendChild(row);
    });
}

// Category Management
function saveCategories() {
    localStorage.setItem('daystream_categories', JSON.stringify(categories));
}

function renderCategorySelector() {
    const container = document.getElementById('dynamicCategorySelect');
    container.innerHTML = '';
    
    categories.forEach(cat => {
        const option = document.createElement('div');
        option.className = 'category-option';
        option.style.background = cat.gradient;
        option.innerHTML = `<span>${cat.emoji}</span> ${cat.name}`;
        option.dataset.categoryId = cat.id;
        
        if (selectedCategoryId === cat.id) {
            option.classList.add('selected');
        }
        
        option.addEventListener('click', () => {
            document.querySelectorAll('.category-option').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            selectedCategoryId = cat.id;
            document.getElementById('selectedCategory').value = cat.id;
        });
        
        container.appendChild(option);
    });
}

function renderLegend() {
    const container = document.getElementById('legendContainer');
    container.innerHTML = '';
    
    categories.forEach(cat => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        item.innerHTML = `
            <div class="legend-color" style="background: ${cat.gradient}; box-shadow: 0 0 10px ${cat.color}"></div>
            <span>${cat.emoji} ${cat.name}</span>
        `;
        container.appendChild(item);
    });
}

// Category Modal
function openCategoryModal() {
    document.getElementById('categoryModal').classList.add('show');
    renderCategoryList();
    renderEmojiPicker();
    lucide.createIcons();
}

function closeCategoryModal() {
    document.getElementById('categoryModal').classList.remove('show');
}

function renderCategoryList() {
    const list = document.getElementById('categoryList');
    list.innerHTML = '';
    
    categories.forEach(cat => {
        const item = document.createElement('div');
        item.className = 'category-item';
        item.innerHTML = `
            <span class="category-tag" style="background: ${cat.gradient}">
                ${cat.emoji} ${cat.name}
            </span>
            <button class="delete-cat-btn" onclick="deleteCategory('${cat.id}')" title="Delete category">
                <i data-lucide="trash-2"></i>
            </button>
        `;
        list.appendChild(item);
    });
    lucide.createIcons();
}

function renderEmojiPicker() {
    const emojis = ['💼', '😴', '🧹', '🎉', '📚', '💪', '🍽️', '🎮', '🎨', '🎵', '✈️', '💰', '🔥', '⭐', '💡', '🎯', '🚀', '🌟', '❤️', '🌈', '🏃', '🧘', '📞', '💻', '🏠', '🌙', '☕', '🍎', '⚡', '🔔'];
    const picker = document.getElementById('emojiPicker');
    picker.innerHTML = '';
    
    emojis.forEach(emoji => {
        const span = document.createElement('span');
        span.className = 'emoji-option';
        span.textContent = emoji;
        span.onclick = () => {
            document.querySelectorAll('.emoji-option').forEach(e => e.classList.remove('selected'));
            span.classList.add('selected');
            document.getElementById('selectedEmoji').value = emoji;
        };
        picker.appendChild(span);
    });
}

function adjustBrightness(col, amt) {
    let usePound = false;
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
    let num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    let b = ((num >> 8) & 0x00FF) + amt;
    let g = (num & 0x0000FF) + amt;
    if (r > 255) r = 255; else if (r < 0) r = 0;
    if (b > 255) b = 255; else if (b < 0) b = 0;
    if (g > 255) g = 255; else if (g < 0) g = 0;
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
}

// Edit Modal
function openEditModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    document.getElementById('editTaskId').value = task.id;
    document.getElementById('editTaskName').value = task.name;
    document.getElementById('editDaySelect').value = task.day;
    document.getElementById('editStartTime').value = task.startTime;
    document.getElementById('editEndTime').value = task.endTime;
    document.getElementById('editTaskDetails').value = task.details || '';
    
    // Populate category select
    const catSelect = document.getElementById('editCategorySelect');
    catSelect.innerHTML = '';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = `${cat.emoji} ${cat.name}`;
        if (cat.id === task.category) option.selected = true;
        catSelect.appendChild(option);
    });
    
    document.getElementById('editModal').classList.add('show');
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('show');
}

function deleteCurrentTask() {
    const id = parseInt(document.getElementById('editTaskId').value);
    if (confirm('Are you sure you want to delete this activity?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTimeline();
        closeEditModal();
    }
}

// Event Listeners
function setupEventListeners() {
    // Add Task Form
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask();
    });

    // Edit Task Form
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveEdit();
    });

    // Category Form
    categoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('newCatName').value;
        const color = document.getElementById('newCatColor').value;
        const emoji = document.getElementById('selectedEmoji').value || '⭐';
        
        const darkColor = adjustBrightness(color, -30);
        const gradient = `linear-gradient(135deg, ${color} 0%, ${darkColor} 100%)`;
        
        categories.push({
            id: Date.now().toString(),
            name,
            color,
            emoji,
            gradient
        });
        
        saveCategories();
        renderCategorySelector();
        renderLegend();
        renderCategoryList();
        categoryForm.reset();
    });

    // Close modals on outside click
    window.onclick = (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
        }
    };

    // Set default day to today
    const today = new Date().getDay();
    document.getElementById('daySelect').value = today === 0 ? 6 : today - 1;
}

function addTask() {
    const name = document.getElementById('taskName').value;
    const day = parseInt(document.getElementById('daySelect').value);
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const details = document.getElementById('taskDetails').value;

    if (!selectedCategoryId) {
        shakeElement(document.getElementById('dynamicCategorySelect'));
        return;
    }

    if (startTime >= endTime) {
        alert('End time must be after start time');
        return;
    }

    tasks.push({
        id: Date.now(),
        name,
        day,
        startTime,
        endTime,
        category: selectedCategoryId,
        details,
        weekOffset: currentWeekOffset,
        createdAt: new Date().toISOString()
    });

    saveTasks();
    renderTimeline();
    taskForm.reset();
    selectedCategoryId = null;
    document.querySelectorAll('.category-option').forEach(o => o.classList.remove('selected'));
    
    const today = new Date().getDay();
    document.getElementById('daySelect').value = today === 0 ? 6 : today - 1;
}

function saveEdit() {
    const id = parseInt(document.getElementById('editTaskId').value);
    const task = tasks.find(t => t.id === id);
    
    if (task) {
        task.name = document.getElementById('editTaskName').value;
        task.day = parseInt(document.getElementById('editDaySelect').value);
        task.startTime = document.getElementById('editStartTime').value;
        task.endTime = document.getElementById('editEndTime').value;
        task.category = document.getElementById('editCategorySelect').value;
        task.details = document.getElementById('editTaskDetails').value;
        
        saveTasks();
        renderTimeline();
        closeEditModal();
    }
}

function deleteCategory(id) {
    if (categories.length <= 1) {
        alert('You must keep at least one category');
        return;
    }
    
    // Check if category is in use
    const inUse = tasks.some(t => t.category === id);
    if (inUse) {
        if (!confirm('This category is used by some activities. Deleting will set those to the first category. Continue?')) {
            return;
        }
        // Reassign tasks
        const firstCat = categories.find(c => c.id !== id);
        tasks.forEach(t => {
            if (t.category === id) t.category = firstCat.id;
        });
        saveTasks();
        renderTimeline();
    }
    
    categories = categories.filter(c => c.id !== id);
    saveCategories();
    renderCategorySelector();
    renderLegend();
    renderCategoryList();
}

function saveTasks() {
    localStorage.setItem('daystream_tasks', JSON.stringify(tasks));
}

function cancelEdit() {
    taskForm.reset();
    selectedCategoryId = null;
    document.querySelectorAll('.category-option').forEach(o => o.classList.remove('selected'));
}

// Timeline Rendering with Stacking
function renderTimeline() {
    // Clear existing
    document.querySelectorAll('.time-slot, .current-time-line').forEach(el => el.remove());

    // Filter tasks for current week
    const weekTasks = tasks.filter(t => (t.weekOffset || 0) === currentWeekOffset);
    
    const tasksByDay = [[], [], [], [], [], [], []];
    weekTasks.forEach(task => {
        tasksByDay[task.day].push(task);
    });

    tasksByDay.forEach((dayTasks, dayIndex) => {
        const timeline = document.querySelector(`.day-timeline[data-day="${dayIndex}"]`);
        if (!timeline) return;
        
        // Sort by start time
        dayTasks.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
        
        // Calculate overlaps and assign rows
        const rows = [];
        dayTasks.forEach(task => {
            const start = timeToMinutes(task.startTime);
            const end = timeToMinutes(task.endTime);
            
            let rowIndex = 0;
            let placed = false;
            
            while (!placed) {
                if (!rows[rowIndex]) rows[rowIndex] = [];
                
                const hasOverlap = rows[rowIndex].some(existing => {
                    const exStart = timeToMinutes(existing.startTime);
                    const exEnd = timeToMinutes(existing.endTime);
                    return (start < exEnd && end > exStart);
                });
                
                if (!hasOverlap) {
                    rows[rowIndex].push(task);
                    task.row = rowIndex;
                    placed = true;
                } else {
                    rowIndex++;
                }
            }
        });
        
        // Adjust timeline height
        const rowHeight = 32;
        const padding = 10;
        timeline.style.height = `${Math.max(60, rows.length * rowHeight + padding)}px`;
        
        // Render tasks
        dayTasks.forEach(task => {
            const slot = createTimeSlot(task);
            timeline.appendChild(slot);
        });
    });
}

function createTimeSlot(task) {
    const slot = document.createElement('div');
    const category = categories.find(c => c.id === task.category) || categories[0];
    
    slot.className = 'time-slot';
    slot.style.background = category.gradient;
    
    const startMinutes = timeToMinutes(task.startTime);
    const endMinutes = timeToMinutes(task.endTime);
    const duration = endMinutes - startMinutes;
    
    const leftPercent = (startMinutes / 1440) * 100;
    const widthPercent = (duration / 1440) * 100;
    const topPosition = (task.row * 32) + 5;
    
    slot.style.left = `${leftPercent}%`;
    slot.style.width = `${widthPercent}%`;
    slot.style.top = `${topPosition}px`;
    slot.textContent = `${category.emoji} ${task.name}`;
    
    // Events
    slot.addEventListener('mouseenter', (e) => showTooltip(e, task, duration, category));
    slot.addEventListener('mouseleave', hideTooltip);
    slot.addEventListener('mousemove', moveTooltip);
    slot.addEventListener('click', () => openEditModal(task.id));
    
    return slot;
}

function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
}

// Tooltip
function showTooltip(e, task, durationMinutes, category) {
    document.getElementById('tooltipIcon').textContent = category.emoji;
    document.getElementById('tooltipTitle').textContent = task.name;
    document.getElementById('tooltipTime').innerHTML = `
        <strong>${task.startTime} - ${task.endTime}</strong> · ${formatDuration(durationMinutes)}
    `;
    
    const detailsEl = document.getElementById('tooltipDetails');
    if (task.details) {
        detailsEl.textContent = task.details;
        detailsEl.style.display = 'block';
    } else {
        detailsEl.style.display = 'none';
    }
    
    const catEl = document.getElementById('tooltipCategory');
    catEl.style.background = category.gradient;
    catEl.innerHTML = `${category.emoji} ${category.name}`;
    
    tooltip.classList.add('show');
    moveTooltip(e);
}

function moveTooltip(e) {
    const rect = tooltip.getBoundingClientRect();
    let x = e.clientX + 15;
    let y = e.clientY - 10;
    
    // Prevent overflow
    if (x + rect.width > window.innerWidth) x = e.clientX - rect.width - 15;
    if (y + rect.height > window.innerHeight) y = e.clientY - rect.height - 15;
    
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
}

function hideTooltip() {
    tooltip.classList.remove('show');
}

// Current Time Line
function updateCurrentTimeLine() {
    document.querySelectorAll('.current-time-line').forEach(el => el.remove());
    
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const currentDay = now.getDay() === 0 ? 6 : now.getDay() - 1;
    const leftPercent = (currentMinutes / 1440) * 100;
    
    // Only show if viewing current week
    if (currentWeekOffset !== 0) return;
    
    const timeline = document.querySelector(`.day-timeline[data-day="${currentDay}"]`);
    if (timeline) {
        const line = document.createElement('div');
        line.className = 'current-time-line';
        line.style.left = `${leftPercent}%`;
        
        const label = document.createElement('div');
        label.className = 'current-time-label';
        label.textContent = 'NOW';
        line.appendChild(label);
        
        timeline.appendChild(line);
    }
}

// Utility
function shakeElement(el) {
    el.style.animation = 'shake 0.5s';
    setTimeout(() => el.style.animation = '', 500);
}

// Add shake animation to CSS via JS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);