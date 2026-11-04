/* NAVIGATION */

const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');

function openPage(pageName) {
    pages.forEach(page => {
        page.classList.toggle('active', page.id === pageName);
    });

    navItems.forEach(item => {
        item.classList.toggle(
            'active',
            item.dataset.page === pageName
        );
    });

    if (pageName === 'dashboard') updateDashboard();
    if (pageName === 'tasks') renderTasks();
    if (pageName === 'completed') renderCompleted();
    if (pageName === 'goals') renderGoals();
    if (pageName === 'materials') renderMaterials();
    if (pageName === 'schedule') renderSchedule();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

navItems.forEach(item => {
    item.addEventListener('click', () => {
        openPage(item.dataset.page);
    });
});

document.querySelectorAll('[data-go]').forEach(button => {
    button.addEventListener('click', () => {
        openPage(button.dataset.go);
    });
});

/* DATE */

const now = new Date();

document.getElementById('currentDate').textContent =
    now.toLocaleDateString('uk-UA', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

/* THEME SWITCH */

const themeToggle = document.getElementById('themeToggle');
const themeName = document.getElementById('themeName');

function applyTheme(theme) {
    document.body.dataset.theme = theme;

    themeName.textContent =
        theme === 'garden' ? 'GAME MODE' : 'GARDEN MODE';

    Storage.setTheme(theme);
}

applyTheme(Storage.getTheme());

themeToggle.addEventListener('click', () => {
    const newTheme =
        document.body.dataset.theme === 'garden'
            ? 'game'
            : 'garden';

    applyTheme(newTheme);
});

/* MODAL */

const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalFields = document.getElementById('modalFields');
const modalForm = document.getElementById('modalForm');

let currentModal = '';

function field(label, name, type = 'text', required = true) {
    return `
        <div class="form-field">
            <label>${label}</label>
            <input
                type="${type}"
                name="${name}"
                ${required ? 'required' : ''}
            >
        </div>
    `;
}

function selectField(label, name, options) {
    return `
        <div class="form-field">
            <label>${label}</label>
            <select name="${name}" required>
                ${options.map(option => `
                    <option value="${option.value}">
                        ${option.label}
                    </option>
                `).join('')}
            </select>
        </div>
    `;
}

function textareaField(label, name) {
    return `
        <div class="form-field">
            <label>${label}</label>
            <textarea name="${name}"></textarea>
        </div>
    `;
}

function openModal(type) {
    currentModal = type;

    const configurations = {

        task: {
            title: 'Нове завдання',
            fields:
                field('Назва завдання', 'title') +
                field('Предмет', 'subject') +
                field('Дедлайн', 'deadline', 'date', false) +
                selectField('Пріоритет', 'priority', [
                    {value:'normal', label:'Звичайний'},
                    {value:'high', label:'Високий'}
                ])
        },

        goal: {
            title: 'Нова ціль',
            fields:
                field('Назва цілі', 'title') +
                textareaField('Опис цілі', 'description')
        },

        material: {
            title: 'Новий матеріал',
            fields:
                field('Назва матеріалу', 'title') +
                field('Предмет', 'subject') +
                field('Посилання', 'url', 'url', false)
        },

        lesson: {
            title: 'Нова пара',
            fields:
                field('Назва предмета', 'title') +
                field('Викладач', 'teacher', 'text', false) +
                field('Час початку', 'time', 'time') +
                field('Аудиторія', 'room', 'text', false) +
                selectField('День тижня', 'day', weekDays.map((day, index) => ({
                    value: index,
                    label: day
                })))
        }

    };

    const config = configurations[type];

    modalTitle.textContent = config.title;
    modalFields.innerHTML = config.fields;

    if (type === 'lesson') {
        modalFields.querySelector('[name="day"]').value = selectedDay;
    }

    modalOverlay.classList.add('open');
}

function closeModal() {
    modalOverlay.classList.remove('open');
    modalForm.reset();
    currentModal = '';
}

document.getElementById('closeModal').addEventListener('click', closeModal);

modalOverlay.addEventListener('click', event => {
    if (event.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeModal();
});

/* FORM SUBMISSION */

modalForm.addEventListener('submit', event => {
    event.preventDefault();

    const data = Object.fromEntries(
        new FormData(modalForm).entries()
    );

    if (currentModal === 'task') addTask(data);
    if (currentModal === 'goal') addGoal(data);
    if (currentModal === 'material') addMaterial(data);
    if (currentModal === 'lesson') addLesson(data);

    closeModal();
});

/* ADD BUTTONS */

document.getElementById('addTask').addEventListener('click', () => {
    openModal('task');
});

document.getElementById('addGoal').addEventListener('click', () => {
    openModal('goal');
});

document.getElementById('addMaterial').addEventListener('click', () => {
    openModal('material');
});

document.getElementById('addLesson').addEventListener('click', () => {
    openModal('lesson');
});

/* TASK FILTERS */

document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {

        document.querySelectorAll('[data-filter]').forEach(item => {
            item.classList.remove('active');
        });

        button.classList.add('active');

        currentFilter = button.dataset.filter;

        renderTasks();
    });
});

/* INITIALIZATION */

function initializeApp() {
    renderTasks();
    renderCompleted();
    renderGoals();
    renderMaterials();
    renderSchedule();
    updateDashboard();
}

initializeApp();