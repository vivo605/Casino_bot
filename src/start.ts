import { message } from 'telegraf/filters';
import { Telegraf } from 'telegraf'
import dotenv from 'dotenv'

dotenv.config()

const { BOT_TOKEN } = process.env

if (!BOT_TOKEN) {
  throw 'Добавьте BOT_TOKEN в .env'
}

const userNumber: { [key: string]: number } = {}

const bot = new Telegraf(BOT_TOKEN)

bot.start((ctx) => ctx.reply('Welcome'))

// /log
bot.command('log', () => {
  console.log(userNumber)
})

bot.on(message('text'), async (ctx) => {
  const chatId = ctx.chat.id

  if (!(chatId in userNumber)) {
    await ctx.reply(
      `Привет, ${ctx.message.from.username}! Я загадал число, попробуй угадать) `+
      `Если не угодаешь то ты станешь чилом)`
    )
  }
})


bot.launch(() => {
  console.log('Bot started 🚀')
})