const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/send-order', (req, res) => {
    const { name, phone, items } = req.body;

    if (!name || !phone || !items) {
        return res.status(400).send('Missing required fields');
    }

    const message = `
📦 Новый заказ:
👤 Имя: ${name}
📞 Телефон: ${phone}
🛒 Заказ: ${items.map(item => `\n- ${item}`).join('')}
    `;

    const BOT_TOKEN = process.env.BOT_TOKEN;
    const ADMIN_ID = process.env.ADMIN_ID;

    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: ADMIN_ID,
            text: message,
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Отправлено в Telegram:', data);
        res.status(200).send('Заказ отправлен');
    })
    .catch(error => {
        console.error('Ошибка при отправке:', error);
        res.status(500).send('Ошибка при отправке');
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
