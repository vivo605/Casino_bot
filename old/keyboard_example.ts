const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf('YOUR_BOT_TOKEN');

bot.start((ctx) => {
    ctx.reply('Выберите действие:', Markup.keyboard([
        ['Кнопка 1', 'Кнопка 2'], // Первая строка кнопок
        ['Кнопка 3'] // Вторая строка
    ])
   .resize() // Уменьшает клавиатуру под размер экрана
  )
});

bot.launch();
