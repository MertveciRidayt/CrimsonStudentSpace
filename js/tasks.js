
/* =========================================
   CRIMSON STUDENT SPACE
   DATA AND TASK MANAGEMENT
========================================= */

let tasks = Storage.get("tasks", []);
let goals = Storage.get("goals", []);
let materials = Storage.get("materials", []);

function createId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

function saveAllData() {
    Storage.set("tasks", tasks);
    Storage.set("goals", goals);
    Storage.set("materials", materials);
}

function addTask(data) {
    tasks.unshift({
        id: createId(),
        title: data.title,
        description: data.description || "",
        subject: data.subject || "Загальне",
        deadline: data.deadline || "",
        priority: data.priority || "medium",
        completed: false,
        grade: "",
        createdAt: new Date().toISOString()
    });

    saveAllData();
}

function completeTask(id, grade = "") {
    const task = tasks.find(item => item.id === id);
    if (!task) return;

    task.completed = true;
    task.grade = grade;
    task.completedAt = new Date().toISOString();

    saveAllData();
}

function reopenTask(id) {
    const task = tasks.find(item => item.id === id);
    if (!task) return;

    task.completed = false;
    task.grade = "";
    task.completedAt = "";

    saveAllData();
}

function deleteTask(id) {
    tasks = tasks.filter(item => item.id !== id);
    saveAllData();
}

function addGoal(data) {
    goals.unshift({
        id: createId(),
        title: data.title,
        description: data.description || "",
        progress: 0,
        createdAt: new Date().toISOString()
    });

    saveAllData();
}

function updateGoalProgress(id, progress) {
    const goal = goals.find(item => item.id === id);
    if (!goal) return;

    goal.progress = Math.max(0, Math.min(100, Number(progress)));
    saveAllData();
}

function deleteGoal(id) {
    goals = goals.filter(item => item.id !== id);
    saveAllData();
}

function addMaterial(data) {
    materials.unshift({
        id: createId(),
        title: data.title,
        description: data.description || "",
        url: data.url || "",
        type: data.type || "Інше",
        createdAt: new Date().toISOString()
    });

    saveAllData();
}

function deleteMaterial(id) {
    materials = materials.filter(item => item.id !== id);
    saveAllData();
}

function getTaskStats() {
    return {
        total: tasks.length,
        pending: tasks.filter(task => !task.completed).length,
        completed: tasks.filter(task => task.completed).length
    };
}

function safeURL(value) {
    try {
        const url = new URL(value);
        return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch {
        return "";
    }
}
