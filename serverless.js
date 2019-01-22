const TelegramBot = require('node-telegram-bot-api');
const database = require('./app/configs/database');
const handlers = require('./app/handlers');

const TOKEN = process.env.TOKEN;

class AsyncTelegramBot {
    constructor(token, options = {}) {
        this._bot = new TelegramBot(token, options);
        this._onText = [];
        this._onEvent = [];
    }

    onText(regexp, callback) {
        this._onText.push({regexp, callback});
    }

    on(event, listener) {
        this._onEvent.push({event, listener});
    }

    async sendMessage(...args) {
        await this._bot.sendMessage(...args);
    }

    async sendLocation(...args) {
        await this._bot.sendLocation(...args);
    }

    async processUpdate(update) {
        const message = update.message;
        const callbackQuery = update.callback_query;

        if (message) {
            await Promise.all(this._onEvent
                .filter(({event, listener}) => event === 'message')
                .map(async ({event, listener}) => {
                    await listener(message)
                }));
            for (const {regexp, callback} of this._onText) {
                if (message.text.match(regexp)) {
                    await callback(message);
                    break;
                }
            }
        }
        if (callbackQuery) {
            await Promise.all(this._onEvent
                .filter(({event, listener}) => event === 'callback_query')
                .map(async ({event, listener}) => {
                    await listener(callbackQuery);
                }));
        }
    }
}

let state = 0;

const bot = new AsyncTelegramBot(TOKEN, {
    polling: false
});

exports.handler = async (event, context) => {
    
    if (state === 0) {
        await database.connect();
        await handlers.initialize();
        await handlers.setMessageHandlers(bot);
        await handlers.setCallbackHandlers(bot);
        state = 1;
    }

    const update = JSON.parse(event.body);

    await bot.processUpdate(update);

    return {
        "statusCode": 200,
    };
};