let schedule = Storage.get('schedule');

const weekDays = [
    'Понеділок',
    'Вівторок',
    'Середа',
    'Четвер',
    'П’ятниця',
    'Субота',
    'Неділя'
];

const shortDays = [
    'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'НД'
];

let selectedDay = 0;

function saveSchedule() {
    Storage.set('schedule', schedule);
    renderSchedule();
}

function addLesson(data) {
    schedule.push({
        id: createId(),
        day: Number(data.day),
        title: data.title,
        teacher: data.teacher,
        time: data.time,
        room: data.room
    });

    saveSchedule();
}

function deleteLesson(id) {
    schedule = schedule.filter(lesson => lesson.id !== id);
    saveSchedule();
}

function renderSchedule() {
    const daysContainer = document.getElementById('scheduleDays');

    daysContainer.innerHTML = shortDays.map((day, index) => `
        <button class="day-button ${selectedDay === index ? 'active' : ''}"
            onclick="selectDay(${index})">
            <strong>${day}</strong>
            ${schedule.filter(l => l.day === index).length} пар
        </button>
    `).join('');

    document.getElementById('scheduleDayTitle').textContent =
        weekDays[selectedDay];

    const container = document.getElementById('scheduleList');

    const lessons = schedule
        .filter(l => l.day === selectedDay)
        .sort((a, b) => a.time.localeCompare(b.time));

    if (!lessons.length) {
        container.innerHTML = '<div class="empty-state">На цей день занять поки немає.</div>';
        return;
    }

    container.innerHTML = lessons.map(lesson => `
        <div class="lesson-item">
            <div class="lesson-time">${escapeHTML(lesson.time)}</div>

            <div class="lesson-info" style="flex:1">
                <strong>${escapeHTML(lesson.title)}</strong>
                <p>${escapeHTML(lesson.teacher)} · Аудиторія: ${escapeHTML(lesson.room)}</p>
            </div>

            <button class="small-action danger-text"
                onclick="deleteLesson(${lesson.id})">
                ✕
            </button>
        </div>
    `).join('');
}

function selectDay(index) {
    selectedDay = index;
    renderSchedule();
}