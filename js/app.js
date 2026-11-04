
/* =========================================
   CRIMSON STUDENT SPACE
   MAIN APPLICATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const sections = {
        tasks: {
            title: "Завдання",
            description: "Твій особистий простір для навчання та планування.",
            index: "01 / 05"
        },
        pending: {
            title: "Невиконані завдання",
            description: "Усе, що ще очікує на твою увагу.",
            index: "02 / 05"
        },
        goals: {
            title: "Мої цілі",
            description: "Великі плани починаються з маленьких кроків.",
            index: "03 / 05"
        },
        completed: {
            title: "Виконані завдання",
            description: "Твій архів завершених справ та отриманих оцінок.",
            index: "04 / 05"
        },
        materials: {
            title: "Матеріали",
            description: "Твоя особиста бібліотека навчальних ресурсів.",
            index: "05 / 05"
        }
    };

    const sectionKeys = Object.keys(sections);

    let currentSection = "tasks";
    let currentTheme = localStorage.getItem("crimson_theme") || "crimson";
    let carouselIndex = 0;
    let currentFormType = "";

    const body = document.body;
    const themeToggle = document.getElementById("themeToggle");
    const themeName = document.getElementById("themeName");
    const sectionTitle = document.getElementById("sectionTitle");
    const sectionDescription = document.getElementById("sectionDescription");
    const sectionIndex = document.getElementById("sectionIndex");
    const modalOverlay = document.getElementById("modalOverlay");
    const modalTitle = document.getElementById("modalTitle");
    const formFields = document.getElementById("formFields");
    const dataForm = document.getElementById("dataForm");

    /* =====================================
       GAME SELECTOR CREATION
    ===================================== */

    const workspace = document.querySelector(".workspace");

    const gameSelector = document.createElement("section");
    gameSelector.className = "game-selector";
    gameSelector.innerHTML = `
        <div class="game-topline">
            <span>CRIMSON COLLECTION</span>
            <span>SELECT YOUR DESTINATION</span>
        </div>

        <div class="game-center">
            <span id="gameSubtitle">YOUR PERSONAL SPACE</span>
            <h2 id="gameTitle">Завдання</h2>
            <p id="gameDescription">Твій особистий простір</p>
        </div>

        <div>
            <div class="game-carousel" id="gameCarousel"></div>

            <div class="game-controls">
                <button class="game-arrow" id="gamePrevious" aria-label="Попередній розділ">←</button>
                <span class="game-counter" id="gameCounter">01 / 05</span>
                <button class="game-arrow" id="gameNext" aria-label="Наступний розділ">→</button>
            </div>
        </div>
    `;

    workspace.insertBefore(gameSelector, workspace.firstChild);

    const gameCarousel = document.getElementById("gameCarousel");
    const gameTitle = document.getElementById("gameTitle");
    const gameDescription = document.getElementById("gameDescription");
    const gameCounter = document.getElementById("gameCounter");

    const gameBackgrounds = [
        "linear-gradient(120deg, #4d1028, #170811 60%, #8d1e3e)",
        "linear-gradient(120deg, #28101f, #09060d 60%, #64162e)",
        "linear-gradient(120deg, #601b36, #170914 60%, #a52a4b)",
        "linear-gradient(120deg, #36101e, #0a070d 60%, #7d1735)",
        "linear-gradient(120deg, #4a1734, #0a070d 60%, #8d244a)"
    ];

    function renderCarousel() {
        gameCarousel.innerHTML = "";

        sectionKeys.forEach((key, index) => {
            const button = document.createElement("button");
            button.className = `game-card ${index === carouselIndex ? "active" : ""}`;

            button.innerHTML = `
                <span class="game-card-number">SECTION 0${index + 1}</span>
                <span class="game-card-title">${sections[key].title}</span>
            `;

            button.addEventListener("click", () => {
                selectSection(key);
            });

            gameCarousel.appendChild(button);
        });

        const selected = sections[sectionKeys[carouselIndex]];

        gameTitle.textContent = selected.title;
        gameDescription.textContent = selected.description;
        gameCounter.textContent = `0${carouselIndex + 1} / 05`;

        gameSelector.style.setProperty(
            "--game-background",
            gameBackgrounds[carouselIndex]
        );
    }

    function moveCarousel(direction) {
        carouselIndex =
            (carouselIndex + direction + sectionKeys.length) % sectionKeys.length;

        selectSection(sectionKeys[carouselIndex]);
    }

    document.getElementById("gamePrevious").addEventListener("click", () => {
        moveCarousel(-1);
    });

    document.getElementById("gameNext").addEventListener("click", () => {
        moveCarousel(1);
    });

    /* =====================================
       SECTION NAVIGATION
    ===================================== */

    function selectSection(key) {
        if (!sections[key]) return;

        currentSection = key;
        carouselIndex = sectionKeys.indexOf(key);

        document.querySelectorAll(".nav-item").forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.section === key
            );
        });

        document.querySelectorAll(".content-section").forEach(section => {
            section.classList.remove("active");
        });

        const sectionElement = document.getElementById(`${key}Section`);
        if (sectionElement) {
            sectionElement.classList.add("active");
        }

        sectionTitle.textContent = sections[key].title;
        sectionDescription.textContent = sections[key].description;
        sectionIndex.textContent = sections[key].index;

        renderCarousel();
    }

    document.querySelectorAll(".nav-item").forEach(button => {
        button.addEventListener("click", () => {
            selectSection(button.dataset.section);
        });
    });

    /* =====================================
       THEME SWITCH
    ===================================== */

    function applyTheme(theme) {
        currentTheme = theme === "game" ? "game" : "crimson";

        body.dataset.theme = currentTheme;

        themeName.textContent =
            currentTheme === "crimson" ? "CRIMSON" : "GAME SELECTOR";

        gameSelector.style.display =
            currentTheme === "game" ? "flex" : "none";

        localStorage.setItem("crimson_theme", currentTheme);
    }

    themeToggle.addEventListener("click", () => {
        applyTheme(currentTheme === "crimson" ? "game" : "crimson");
    });

    /* =====================================
       DATE
    ===================================== */

    document.getElementById("currentDate").textContent = getCurrentDate();

    /* =====================================
       EMPTY STATES
    ===================================== */

    function emptyState(title, description) {
        return `
            <div class="empty-state">
                <h3>${title}</h3>
                <p>${description}</p>
            </div>
        `;
    }

    /* =====================================
       TASK RENDERING
    ===================================== */

    function renderTask(task, completedMode = false) {
        const priorityLabels = {
            high: "ВИСОКИЙ",
            medium: "СЕРЕДНІЙ",
            low: "НИЗЬКИЙ"
        };

        const priority = priorityLabels[task.priority] || "СЕРЕДНІЙ";

        return `
            <article class="task-card">
                <div class="task-info">
                    <h3>${escapeHTML(task.title)}</h3>
                    <p>${escapeHTML(task.description || "Без опису")}</p>

                    <div class="task-meta">
                        <span>${escapeHTML(task.subject || "Загальне")}</span>
                        <span>Термін: ${escapeHTML(formatDate(task.deadline))}</span>
                        ${!completedMode ? `
                            <span class="priority ${task.priority}">
                                ${priority}
                            </span>
                        ` : ""}
                    </div>
                </div>

                <div class="task-actions">
                    ${completedMode ? `
                        <span class="grade">
                            ${task.grade ? escapeHTML(task.grade) : "—"}
                        </span>
                        <button class="icon-button" data-action="reopen-task"
                            data-id="${task.id}" title="Повернути до завдань">↶</button>
                    ` : `
                        <button class="icon-button" data-action="complete-task"
                            data-id="${task.id}" title="Виконати">✓</button>
                    `}

                    <button class="icon-button" data-action="delete-task"
                        data-id="${task.id}" title="Видалити">×</button>
                </div>
            </article>
        `;
    }

    function renderTasks() {
        const stats = getTaskStats();

        document.getElementById("totalTasks").textContent = stats.total;
        document.getElementById("pendingTasks").textContent = stats.pending;
        document.getElementById("completedTasks").textContent = stats.completed;

        const activeTasks = tasks.filter(task => !task.completed);
        const completed = tasks.filter(task => task.completed);

        document.getElementById("taskList").innerHTML =
            activeTasks.length
                ? activeTasks.map(task => renderTask(task)).join("")
                : emptyState("Поки що порожньо", "Додай своє перше завдання.");

        document.getElementById("pendingList").innerHTML =
            activeTasks.length
                ? activeTasks.map(task => renderTask(task)).join("")
                : emptyState("Усе виконано", "Наразі немає невиконаних завдань.");

        document.getElementById("completedList").innerHTML =
            completed.length
                ? completed.map(task => renderTask(task, true)).join("")
                : emptyState("Архів поки порожній", "Виконані завдання з'являться тут.");
    }

    /* =====================================
       GOALS
    ===================================== */

    function renderGoals() {
        const container = document.getElementById("goalList");

        if (!goals.length) {
            container.innerHTML = emptyState(
                "Цілі ще не додані",
                "Створи першу ціль і відстежуй свій прогрес."
            );
            return;
        }

        container.innerHTML = goals.map(goal => `
            <article class="goal-card">
                <div class="goal-top">
                    <div class="goal-info">
                        <h3>${escapeHTML(goal.title)}</h3>
                        <p>${escapeHTML(goal.description || "Без опису")}</p>
                    </div>

                    <div class="task-actions">
                        <strong>${goal.progress}%</strong>
                        <button class="icon-button" data-action="delete-goal"
                            data-id="${goal.id}">×</button>
                    </div>
                </div>

                <input
                    type="range"
                    min="0"
                    max="100"
                    value="${goal.progress}"
                    data-action="goal-progress"
                    data-id="${goal.id}"
                    aria-label="Прогрес цілі"
                    style="width:100%; accent-color:#c52e52; margin-top:15px;"
                >

                <div class="goal-progress">
                    <div class="goal-progress-fill"
                        style="width:${goal.progress}%"></div>
                </div>
            </article>
        `).join("");
    }

    /* =====================================
       MATERIALS
    ===================================== */

    function renderMaterials() {
        const container = document.getElementById("materialList");

        if (!materials.length) {
            container.innerHTML = emptyState(
                "Бібліотека порожня",
                "Додай посилання або навчальний матеріал."
            );
            return;
        }

        container.innerHTML = materials.map(material => {
            const safeLink = safeURL(material.url);

            return `
                <article class="material-card">
                    <div class="material-icon">✦</div>

                    <div class="material-info">
                        <h3>${escapeHTML(material.title)}</h3>
                        <p>${escapeHTML(material.description || material.type)}</p>
                        ${safeLink ? `
                            <p>
                                <a href="${escapeHTML(safeLink)}"
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   style="color:#e36a87;">
                                   Відкрити матеріал ↗
                                </a>
                            </p>
                        ` : ""}
                    </div>

                    <button class="icon-button" data-action="delete-material"
                        data-id="${material.id}">×</button>
                </article>
            `;
        }).join("");
    }

    function renderAll() {
        renderTasks();
        renderGoals();
        renderMaterials();
    }

    /* =====================================
       MODAL FORMS
    ===================================== */

    function openModal(type) {
        currentFormType = type;
        formFields.innerHTML = "";

        const forms = {
            task: {
                title: "Нове завдання",
                fields: `
                    <div class="form-group">
                        <label>НАЗВА ЗАВДАННЯ</label>
                        <input name="title" required maxlength="100"
                            placeholder="Наприклад: Виконати практичну роботу">
                    </div>

                    <div class="form-group">
                        <label>ОПИС</label>
                        <textarea name="description"
                            placeholder="Додаткова інформація"></textarea>
                    </div>

                    <div class="form-group">
                        <label>ПРЕДМЕТ / КАТЕГОРІЯ</label>
                        <input name="subject" placeholder="Інформатика">
                    </div>

                    <div class="form-group">
                        <label>ДЕДЛАЙН</label>
                        <input type="date" name="deadline">
                    </div>

                    <div class="form-group">
                        <label>ПРІОРИТЕТ</label>
                        <select name="priority">
                            <option value="high">Високий</option>
                            <option value="medium" selected>Середній</option>
                            <option value="low">Низький</option>
                        </select>
                    </div>
                `
            },

            goal: {
                title: "Нова ціль",
                fields: `
                    <div class="form-group">
                        <label>НАЗВА ЦІЛІ</label>
                        <input name="title" required maxlength="100"
                            placeholder="Наприклад: Вивчити JavaScript">
                    </div>

                    <div class="form-group">
                        <label>ОПИС</label>
                        <textarea name="description"
                            placeholder="Чого ти хочеш досягти?"></textarea>
                    </div>
                `
            },

            material: {
                title: "Новий матеріал",
                fields: `
                    <div class="form-group">
                        <label>НАЗВА</label>
                        <input name="title" required maxlength="100"
                            placeholder="Назва матеріалу">
                    </div>

                    <div class="form-group">
                        <label>ОПИС</label>
                        <textarea name="description"
                            placeholder="Короткий опис"></textarea>
                    </div>

                    <div class="form-group">
                        <label>ПОСИЛАННЯ</label>
                        <input name="url" type="url"
                            placeholder="https://example.com">
                    </div>

                    <div class="form-group">
                        <label>ТИП МАТЕРІАЛУ</label>
                        <select name="type">
                            <option>Конспект</option>
                            <option>Відео</option>
                            <option>Документ</option>
                            <option>Посилання</option>
                            <option>Інше</option>
                        </select>
                    </div>
                `
            }
        };

        const selected = forms[type];

        modalTitle.textContent = selected.title;
        formFields.innerHTML = selected.fields;

        modalOverlay.classList.add("active");
    }

    function closeModal() {
        modalOverlay.classList.remove("active");
        dataForm.reset();
        currentFormType = "";
    }

    document.getElementById("addTaskButton").addEventListener("click", () => {
        openModal("task");
    });

    document.getElementById("addGoalButton").addEventListener("click", () => {
        openModal("goal");
    });

    document.getElementById("addMaterialButton").addEventListener("click", () => {
        openModal("material");
    });

    document.getElementById("closeModal").addEventListener("click", closeModal);

    modalOverlay.addEventListener("click", event => {
        if (event.target === modalOverlay) closeModal();
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeModal();

        if (currentTheme === "game" && !modalOverlay.classList.contains("active")) {
            if (event.key === "ArrowRight") moveCarousel(1);
            if (event.key === "ArrowLeft") moveCarousel(-1);
        }
    });

    dataForm.addEventListener("submit", event => {
        event.preventDefault();

        const data = Object.fromEntries(new FormData(dataForm).entries());

        if (!data.title?.trim()) return;

        if (currentFormType === "task") addTask(data);
        if (currentFormType === "goal") addGoal(data);
        if (currentFormType === "material") addMaterial(data);

        renderAll();
        closeModal();
    });

    /* =====================================
       ACTIONS
    ===================================== */

    document.addEventListener("click", event => {
        const button = event.target.closest("[data-action]");
        if (!button) return;

        const id = button.dataset.id;
        const action = button.dataset.action;

        if (action === "delete-task") {
            if (confirm("Видалити це завдання?")) deleteTask(id);
        }

        if (action === "complete-task") {
            const grade = prompt(
                "Введи отриману оцінку (можна залишити порожнім):",
                ""
            );

            if (grade === null) return;

            completeTask(id, grade.trim());
        }

        if (action === "reopen-task") {
            reopenTask(id);
        }

        if (action === "delete-goal") {
            if (confirm("Видалити цю ціль?")) deleteGoal(id);
        }

        if (action === "delete-material") {
            if (confirm("Видалити цей матеріал?")) deleteMaterial(id);
        }

        renderAll();
    });

    document.addEventListener("input", event => {
        const input = event.target;

        if (input.dataset.action !== "goal-progress") return;

        updateGoalProgress(input.dataset.id, input.value);

        const card = input.closest(".goal-card");
        const percentage = card.querySelector(".task-actions strong");
        const progressFill = card.querySelector(".goal-progress-fill");

        percentage.textContent = `${input.value}%`;
        progressFill.style.width = `${input.value}%`;
    });

    /* =====================================
       INITIALIZATION
    ===================================== */

    renderAll();
    renderCarousel();
    selectSection("tasks");
    applyTheme(currentTheme);

});
