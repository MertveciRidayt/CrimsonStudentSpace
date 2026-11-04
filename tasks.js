let tasks = Storage.get('tasks');
let goals = Storage.get('goals');
let materials = Storage.get('materials');

let currentFilter = 'all';

function saveTasks() {
    Storage.set('tasks', tasks);
    renderTasks();
    renderCompleted();
    updateDashboard();
}

function saveGoals() {
    Storage.set('goals', goals);
    renderGoals();
    updateDashboard();
}

function saveMaterials() {
    Storage.set('materials', materials);
    renderMaterials();
}

function createId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

/* TASKS */

function addTask(data) {
    tasks.push({
        id: createId(),
        title: data.title,
        subject: data.subject,
        deadline: data.deadline,
        priority: data.priority,
        completed: false,
        grade: null
    });

    saveTasks();
}

function completeTask(id) {
    const task = tasks.find(t => t.id === id);

    if (task) {
        task.completed = true;
        saveTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
}

function setGrade(id) {
    const task = tasks.find(t => t.id === id);

    if (!task) return;

    const grade = prompt('Введи оцінку від 1 до 12:');

    if (grade === null || grade.trim() === '') return;

    const number = Number(grade);

    if (!Number.isInteger(number) || number < 1 || number > 12) {
        alert('Введи ціле число від 1 до 12.');
        return;
    }

    task.grade = number;
    saveTasks();
}

function renderTasks() {
    const container = document.getElementById('tasksList');

    if (!container) return;

    let filtered = tasks.filter(t => !t.completed);

    if (currentFilter === 'high') {
        filtered = filtered.filter(t => t.priority === 'high');
    }

    if (currentFilter === 'active') {
        filtered = filtered.filter(t => !t.completed);
    }

    if (!filtered.length) {
        container.innerHTML = '<div class="empty-state">Немає завдань. Час створити щось нове.</div>';
        return;
    }

    container.innerHTML = filtered.map(task => `
        <div class="task-item">
            <div class="task-main">
                <strong>${escapeHTML(task.title)}</strong>
                <small>
                    ${escapeHTML(task.subject)} · Дедлайн: ${task.deadline || 'Не вказано'}
                </small>
                <small class="priority">
                    ${task.priority === 'high' ? '● ВИСОКИЙ ПРІОРИТЕТ' : '● ЗВИЧАЙНИЙ ПРІОРИТЕТ'}
                </small>
            </div>

            <div class="task-actions">
                <button class="small-action" onclick="completeTask(${task.id})">✓</button>
                <button class="small-action danger-text" onclick="deleteTask(${task.id})">✕</button>
            </div>
        </div>
    `).join('');
}

/* COMPLETED */

function renderCompleted() {
    const container = document.getElementById('completedList');

    if (!container) return;

    const completed = tasks.filter(t => t.completed);

    if (!completed.length) {
        container.innerHTML = '<div class="empty-state">Тут поки що немає виконаних завдань.</div>';
        return;
    }

    container.innerHTML = completed.map(task => `
        <div class="task-item">
            <div class="task-main">
                <strong>${escapeHTML(task.title)}</strong>
                <small>${escapeHTML(task.subject)} · Завершено</small>
                <small class="priority">
                    Оцінка: ${task.grade !== null ? task.grade + '/12' : 'Ще не виставлена'}
                </small>
            </div>

            <div class="task-actions">
                <button class="small-action" onclick="setGrade(${task.id})">★ Оцінка</button>
                <button class="small-action danger-text" onclick="deleteTask(${task.id})">✕</button>
            </div>
        </div>
    `).join('');
}

/* GOALS */

function addGoal(data) {
    goals.push({
        id: createId(),
        title: data.title,
        description: data.description,
        progress: 0
    });

    saveGoals();
}

function changeGoal(id, amount) {
    const goal = goals.find(g => g.id === id);

    if (!goal) return;

    goal.progress = Math.min(100, Math.max(0, goal.progress + amount));

    saveGoals();
}

function deleteGoal(id) {
    goals = goals.filter(g => g.id !== id);
    saveGoals();
}

function renderGoals() {
    const container = document.getElementById('goalsList');

    if (!container) return;

    if (!goals.length) {
        container.innerHTML = '<div class="empty-state">Твої майбутні цілі починаються тут.</div>';
        return;
    }

    container.innerHTML = goals.map(goal => `
        <div class="goal-card">
            <span class="eyebrow">PERSONAL GOAL</span>
            <h3>${escapeHTML(goal.title)}</h3>
            <p>${escapeHTML(goal.description)}</p>

            <div class="progress-info goal-progress">
                <span>Прогрес</span>
                <strong>${goal.progress}%</strong>
            </div>

            <div class="progress-track">
                <div class="progress-fill" style="width:${goal.progress}%"></div>
            </div>

            <div class="goal-controls">
                <button onclick="changeGoal(${goal.id}, -10)">−10</button>
                <button onclick="changeGoal(${goal.id}, 10)">+10</button>
                <button onclick="deleteGoal(${goal.id})">✕</button>
            </div>
        </div>
    `).join('');
}

/* MATERIALS */

function addMaterial(data) {
    materials.push({
        id: createId(),
        title: data.title,
        subject: data.subject,
        url: data.url
    });

    saveMaterials();
}

function deleteMaterial(id) {
    materials = materials.filter(m => m.id !== id);
    saveMaterials();
}

function renderMaterials() {
    const container = document.getElementById('materialsList');

    if (!container) return;

    if (!materials.length) {
        container.innerHTML = '<div class="empty-state">Додай сюди корисні навчальні матеріали.</div>';
        return;
    }

    container.innerHTML = materials.map(material => `
        <div class="material-card">
            <span class="eyebrow">STUDY RESOURCE</span>
            <h3>${escapeHTML(material.title)}</h3>
            <p>${escapeHTML(material.subject)}</p>

            ${material.url ? `
                <a href="${safeURL(material.url)}" target="_blank" rel="noopener noreferrer">
                    Відкрити матеріал ↗
                </a>
            ` : ''}

            <div style="margin-top:15px">
                <button class="small-action danger-text"
                    onclick="deleteMaterial(${material.id})">
                    Видалити
                </button>
            </div>
        </div>
    `).join('');
}

/* DASHBOARD */

function updateDashboard() {
    const active = tasks.filter(t => !t.completed);
    const completed = tasks.filter(t => t.completed);

    document.getElementById('activeCount').textContent = active.length;
    document.getElementById('completedCount').textContent = completed.length;
    document.getElementById('goalsCount').textContent = goals.length;

    const grades = completed
        .filter(t => t.grade !== null)
        .map(t => t.grade);

    const average = grades.length
        ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1)
        : '—';

    document.getElementById('averageGrade').textContent = average;

    const total = tasks.length;
    const percent = total
        ? Math.round(completed.length / total * 100)
        : 0;

    document.getElementById('progressPercent').textContent = percent + '%';
    document.getElementById('progressBar').style.width = percent + '%';

    document.getElementById('progressMessage').textContent =
        total ? `Вже виконано ${completed.length} із ${total} завдань.` :
        'Почни виконувати завдання, щоб побачити прогрес.';

    const dashboard = document.getElementById('dashboardTasks');

    if (!dashboard) return;

    const upcoming = active
        .slice()
        .sort((a, b) => (a.deadline || '9999').localeCompare(b.deadline || '9999'))
        .slice(0, 4);

    dashboard.innerHTML = upcoming.length
        ? upcoming.map(task => `
            <div class="task-item">
                <div class="task-main">
                    <strong>${escapeHTML(task.title)}</strong>
                    <small>${escapeHTML(task.subject)} · ${task.deadline || 'Без дедлайну'}</small>
                </div>
                <button class="small-action" onclick="completeTask(${task.id})">✓</button>
            </div>
        `).join('')
        : '<div class="empty-state">Усі завдання виконані або ще не додані.</div>';
}

/* SECURITY HELPERS */

function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[char]);
}

function safeURL(value) {
    try {
        const url = new URL(value);

        if (url.protocol === 'https:' || url.protocol === 'http:') {
            return escapeHTML(url.href);
        }
    } catch {}

    return '#';
}