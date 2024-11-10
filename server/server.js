const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3005;

const markdownDir = path.join(__dirname, '../md');
const dateRegex = /data created: (\d{4}-\d{2}-\d{2})/;

let cachedData = null;
let lastFetchTime = 0;
const CACHE_EXPIRATION_TIME = 10 * 60 * 1000; // 10 минут

function parseMarkdownFiles() {
    const currentYear = new Date().getFullYear();
    const currentTime = Date.now();

    if (cachedData && (currentTime - lastFetchTime) < CACHE_EXPIRATION_TIME) {
        return cachedData; // Возвращаем кешированные данные
    }

    const dates = new Set();
    const filesForDates = {};

    fs.readdirSync(markdownDir).forEach(file => {
        if (file.endsWith('.md')) {
            const content = fs.readFileSync(path.join(markdownDir, file), 'utf-8');
            const match = content.match(dateRegex);

            if (match) {
                const date = new Date(match[1]);
                if (date.getFullYear() === currentYear) {
                    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
                    dates.add(dateStr);
                    if (!filesForDates[dateStr]) {
                        filesForDates[dateStr] = [];
                    }
                    filesForDates[dateStr].push(file); // Добавляем файл к соответствующей дате
                }
            }
        }
    });

    // Преобразуем Set в массив
    cachedData = { dates: Array.from(dates), filesForDates };
    lastFetchTime = currentTime;

    return cachedData;
}

app.get('/data', (req, res) => {
    const data = parseMarkdownFiles();
    const result = {
        labels: data.dates,
        data: data.dates.map(date => data.filesForDates[date].length)
    };
    res.json(result);
});



app.use(express.static(path.join(__dirname, '../public')));
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
