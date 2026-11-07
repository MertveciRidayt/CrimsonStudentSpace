/* =========================================
   CRIMSON STUDENT SPACE — PROFILE SYSTEM
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const overlay = document.getElementById("profileOverlay");
    const openButton = document.getElementById("profileOpen");
    const closeButton = document.getElementById("profileClose");

    if (!overlay || !openButton || !closeButton) {
        console.error("Profile elements not found.");
        return;
    }

    // Отримання та збереження даних

    const loadData = (key, fallback) => {
        try {
            const saved = localStorage.getItem(`crimson_profile_${key}`);
            return saved ? JSON.parse(saved) : fallback;
        } catch {
            return fallback;
        }
    };

    const saveData = (key, value) => {
        localStorage.setItem(
            `crimson_profile_${key}`,
            JSON.stringify(value)
        );
    };

    let grades = loadData("grades", []);
    let profileGoals = loadData("goals", []);

    // Відкриття та закриття кабінету

    function openProfile() {
        overlay.classList.add("open");
        document.body.style.overflow = "hidden";
        renderProfile();
    }

    function closeProfile() {
        overlay.classList.remove("open");
        document.body.style.overflow = "";
    }

    openButton.addEventListener("click", openProfile);

    openButton.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openProfile();
        }
    });

    closeButton.addEventListener("click", closeProfile);

    overlay.addEventListener("click", event => {
        if (event.target === overlay) {
            closeProfile();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && overlay.classList.contains("open")) {
            closeProfile();
        }
    });

    // Перемикання вкладок

    const tabs = document.querySelectorAll(".profile-tab");
    const panels = document.querySelectorAll(".profile-panel");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const selected = tab.dataset.profileTab;

            tabs.forEach(item => item.classList.remove("active"));
            panels.forEach(panel => panel.classList.remove("active"));

            tab.classList.add("active");

            const selectedPanel = document.getElementById(
                `profile-${selected}`
            );

            if (selectedPanel) {
                selectedPanel.classList.add("active");
            }

            renderProfile();
        });
    });

    // Дані студента

    const profileForm = document.getElementById("profileForm");

    const firstName = document.getElementById("studentFirstName");
    const lastName = document.getElementById("studentLastName");
    const course = document.getElementById("studentCourse");

    function loadStudentInfo() {
        const info = loadData("student", {});

        firstName.value = info.firstName || "";
        lastName.value = info.lastName || "";
        course.value = info.course || "";
    }

    profileForm.addEventListener("submit", event => {
        event.preventDefault();

        saveData("student", {
            firstName: firstName.value.trim(),
            lastName: lastName.value.trim(),
            course: course.value.trim()
        });

        alert("Інформацію про студента збережено!");
    });

    // Допоміжна функція захисту HTML

    function escapeText(value) {
        return String(value).replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[character]);
    }

    // Додавання оцінок

    const gradeForm = document.getElementById("gradeForm");

    gradeForm.addEventListener("submit", event => {
        event.preventDefault();

        const subject = document.getElementById("gradeSubject").value.trim();
        const value = Number(document.getElementById("gradeValue").value);
        const date = document.getElementById("gradeDate").value;

        if (!subject || !Number.isInteger(value) || value < 1 || value > 12) {
            alert("Введіть предмет та оцінку від 1 до 12.");
            return;
        }

        grades.push({
            id: Date.now(),
            subject,
            value,
            date
        });

        saveData("grades", grades);

        gradeForm.reset();
        renderGrades();
        renderSummary();
    });

    function renderGrades() {
        const list = document.getElementById("gradesList");

        if (!grades.length) {
            list.innerHTML = `
                <div class="profile-empty">
                    Поки що оцінок немає. Додай свій перший результат.
                </div>
            `;
            return;
        }

        list.innerHTML = grades.map(grade => `
            <div class="profile-item">
                <div>
                    <strong>${escapeText(grade.subject)}</strong>
                    <small>${escapeText(grade.date || "Дата не вказана")}</small>
                </div>

                <span class="profile-item-score">
                    ${grade.value}/12
                </span>

                <button class="profile-delete"
                    type="button"
                    data-delete-grade="${grade.id}">
                    ×
                </button>
            </div>
        `).join("");
    }

    document.getElementById("gradesList").addEventListener("click", event => {
        const button = event.target.closest("[data-delete-grade]");

        if (!button) return;

        const id = Number(button.dataset.deleteGrade);

        grades = grades.filter(grade => grade.id !== id);

        saveData("grades", grades);
        renderGrades();
        renderSummary();
    });

    // Додавання особистих цілей

    const goalForm = document.getElementById("profileGoalForm");

    goalForm.addEventListener("submit", event => {
        event.preventDefault();

        const title = document.getElementById("profileGoalTitle").value.trim();
        const description = document.getElementById("profileGoalDescription").value.trim();

        if (!title) return;

        profileGoals.push({
            id: Date.now(),
            title,
            description
        });

        saveData("goals", profileGoals);

        goalForm.reset();
        renderGoals();
        renderSummary();
    });

    function renderGoals() {
        const list = document.getElementById("profileGoalsList");

        if (!profileGoals.length) {
            list.innerHTML = `
                <div class="profile-empty">
                    Ти ще не додав жодної цілі.
                </div>
            `;
            return;
        }

        list.innerHTML = profileGoals.map(goal => `
            <div class="profile-item">
                <div>
                    <strong>${escapeText(goal.title)}</strong>
                    <small>${escapeText(goal.description || "Без опису")}</small>
                </div>

                <button class="profile-delete"
                    type="button"
                    data-delete-goal="${goal.id}">
                    ×
                </button>
            </div>
        `).join("");
    }

    document.getElementById("profileGoalsList").addEventListener("click", event => {
        const button = event.target.closest("[data-delete-goal]");

        if (!button) return;

        const id = Number(button.dataset.deleteGoal);

        profileGoals = profileGoals.filter(goal => goal.id !== id);

        saveData("goals", profileGoals);
        renderGoals();
        renderSummary();
    });

    // Навчальна статистика

    function renderSummary() {
        const average = grades.length
            ? grades.reduce((sum, grade) => sum + grade.value, 0) / grades.length
            : null;

        const existingTasks = loadData("tasks", []);

        const completedCount = existingTasks.filter(
            task => task.completed === true
        ).length;

        document.getElementById("summaryGrades").textContent =
            grades.length;

        document.getElementById("summaryAverage").textContent =
            average === null ? "—" : average.toFixed(1);

        document.getElementById("summaryGoals").textContent =
            profileGoals.length;

        document.getElementById("summaryTasks").textContent =
            completedCount;
    }

    // Загальне оновлення

    function renderProfile() {
        renderGrades();
        renderGoals();
        renderSummary();
    }

    loadStudentInfo();
    renderProfile();

});