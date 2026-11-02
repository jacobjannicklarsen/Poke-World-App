
if (typeof Chart !== "undefined") Chart.defaults.color = "#a0afb9";

async function showChart(url, canvasId, chartType, title) {
    const canvas = document.getElementById(canvasId);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Server returned status " + response.status);
        }
        const data = await response.json();

        new Chart(canvas, {
            type: chartType,
            data: {
                labels: data.map(row => row.label),
                datasets: [{
                    label: title,
                    data: data.map(row => row.value)
                }]
            },
            options: {
                scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
            }
        });
    } catch (error) {
        console.error(error);
        canvas.outerHTML = "<p>Could not load data. Is the server running (npm start)?</p>";
    }
}

showChart("/stats/avg-attack",       "attackChart",    "bar", "Average attack");
showChart("/stats/type-count",       "typeChart",      "bar", "Pokémon count");
showChart("/stats/top-trainers",     "trainerChart",   "bar", "Pokémon count");
showChart("/stats/body-shape-speed", "bodyShapeChart", "bar", "Average speed");