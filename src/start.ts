import { launchGame } from './game'
import { Telegraf } from 'telegraf'

import dotenv from 'dotenv'

dotenv.config()

const { BOT_TOKEN } = process.env

if (!BOT_TOKEN) {
  throw 'Добавьте BOT_TOKEN в .env'
}

const bot = new Telegraf(BOT_TOKEN)

launchGame(bot)

bot.launch(() => {
  console.log('Bot started 🚀')
})
