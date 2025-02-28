import { Telegraf, Markup, Context } from 'telegraf'
import { message } from 'telegraf/filters'
import { randomInt } from 'node:crypto' // min <= n < max
import dotenv from 'dotenv'

dotenv.config()

const { BOT_TOKEN } = process.env

if (!BOT_TOKEN) {
  throw 'Добавьте BOT_TOKEN в .env'
}

const userNumber: { [key: string]: number } = {}

const bot = new Telegraf(BOT_TOKEN)

bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))

// /log
bot.command('log', () => {
  console.log(userNumber)
})

// RegExp: https://learn.javascript.ru/regular-expressions

bot.action(/^\d+$/, async (ctx) => {
  await ctx.answerCbQuery()
  const chatId = ctx.chat!.id
  const n = Number(ctx.match[0])
  await answer(ctx, chatId, n)
})

bot.on(message('text'), async (ctx) => {
  const chatId = ctx.chat.id
  // ctx.message.from.username

  if (!(chatId in userNumber)) {
    await ctx.reply(
      `Привет, ${ctx.message.from.username}! Я загадал число, попробуй угадать) `+
      `Если не угодаешь то ты станешь чилом)`
    )
    userNumber[chatId] = randomInt(1, 10 + 1)
  }
  
  const n = Number(ctx.message.text)
  await answer(ctx, chatId, n)
})

bot.launch(() => {
  console.log('Bot started 🚀')
})

async function answer(ctx: Context, chatId: number, n: number) {
  if (!isFinite(n)){
    await ctx.reply('Ты читер! Нужно ввести число от 1 до 10')
  }
  else if (n === userNumber[chatId]) {
    const randomNumber = randomInt(1, 10 + 1)
    userNumber[chatId] = randomNumber
    await ctx.reply('Ты угадал')
  }
  else {
    await ctx.reply(
      n < userNumber[chatId]! ? 'Мое число больше.' : 'Мое число меньше.', 
      Markup.inlineKeyboard([
        [Markup.button.callback(String(n+1), String(n+1))],
        [Markup.button.callback(String(n-1), String(n-1))],
      ])
    )
  }
}


// bot.action(/^red|black|yes|no$/, async (ctx) => {})
// const actions = [
//   'red',
//   'black',
//   'yes',
//   'no',
// ] as const