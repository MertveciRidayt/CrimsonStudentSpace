
/* =========================================
   CRIMSON STUDENT SPACE
   DATE HELPERS
========================================= */

function formatDate(dateString) {
    if (!dateString) return "Без терміну";

    const date = new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
        return "Без терміну";
    }

    return new Intl.DateTimeFormat("uk-UA", {
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(date);
}

function getCurrentDate() {
    return new Intl.DateTimeFormat("uk-UA", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(new Date());
}
