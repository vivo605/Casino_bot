import { launchGame } from './game'
import { Telegraf, Markup } from 'telegraf'

import dotenv from 'dotenv'

dotenv.config()

const { BOT_TOKEN } = process.env

if (!BOT_TOKEN) {
  throw 'Добавьте BOT_TOKEN в .env'
}

const bot = new Telegraf(BOT_TOKEN)

bot.start((ctx) => ctx.reply('Открыто меню', Markup.keyboard([
  ['да', 'нет'],
  ['красный', 'желтый', 'зеленый'],
])))

// Markup.removeKeyboard()

bot.launch(() => {
  console.log('Bot started 🚀')
})

// /start