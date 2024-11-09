fetch('/data')
    .then(response => response.json())
    .then(chartData => {
        const ctx = document.getElementById('chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Количество файлов',
                    data: chartData.data,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: false,
                    tension: 0.1,
                    pointRadius: 5,
                    pointHoverRadius: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'График количества .md файлов'
                    },
                    tooltip: {
                        callbacks: {
                            title: function(tooltipItem) {
                                return `Дата: ${tooltipItem[0].label}`;
                            },
                            label: function(tooltipItem) {
                                return `Количество файлов: ${tooltipItem.raw}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Дата'
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Количество'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    })
    .catch(error => console.error('Error fetching data:', error));

