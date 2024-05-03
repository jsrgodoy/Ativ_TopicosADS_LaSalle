document.addEventListener("DOMContentLoaded", function() {

    // Função para buscar os dados do servidor
function fetchData() {
    fetch("http://localhost:3000/data") // Substitua pela URL correta da sua API
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar os dados.");
            }
            return response.json();
        })
        .then(data => {
            // Atualizar o gráfico com os dados recebidos do servidor
            updateChart(data);
        })
        .catch(error => {
            console.error("Erro:", error);
        });
}

// Função para atualizar o gráfico com os dados recebidos do servidor
function updateChart(data) {
    const ctx = document.getElementById("myChart").getContext("2d");

    const myChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: data.labels,
            datasets: [{
                label: "Número de Músicas",
                data: data.values,
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true // Ajuste o eixo Y para começar do zero
                }
            }
        }
    });
}

// Chamada para buscar os dados quando a página é carregada
fetchData();

})