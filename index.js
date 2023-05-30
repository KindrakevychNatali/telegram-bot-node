const express = require('express');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');

const token = '5925714593:AAHZAvP7PErROUV1nu98_eMH8hHDKPX9I1w';
const webAppUrl = 'https://telegram-bot-react-k110bb67q-kindrakevychnatali.vercel.app';

const bot = new TelegramBot(token, {polling: true});

const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.chat.id;

    if( text === '/start') {
        await bot.sendMessage(chatId, 'Push button and please fullfill form', {
            reply_markup: {
                keyboard: [
                    [{text: 'Open Form', web_app: {url: webAppUrl + '/form'}}]
                ]
            }
        });
    
        await bot.sendMessage(chatId, 'Check our e-shop click link bellow', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Make order', web_app: {url: webAppUrl}}]
                ]
            }
        })
    }
    
    if(msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data)
            console.log(data)
            await bot.sendMessage(chatId, 'Thank for you feedback!')
            await bot.sendMessage(chatId, 'Your country: ' + data?.country);
            await bot.sendMessage(chatId, 'Your city: ' + data?.street);

            setTimeout(async () => {
                await bot.sendMessage(chatId, 'All information you can get here ->');
            }, 3000)
        } catch (e) {
            console.log(e);
        }
    }
});

app.post('/web-data', async (req, res) => {
    const {queryId, products = [], totalPrice} = req.body;
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Successed pursue',
            input_message_content: {
                message_text: `Congratulation you finished your pursue ${totalPrice}, ${products.map(item => item.title).join(', ')}`
            }
        })
        return res.status(200).json({});
    } catch (e) {
        return res.status(500).json({})
    }
})

const PORT = 8000;

app.listen(PORT, () => console.log('server started on PORT ' + PORT))
