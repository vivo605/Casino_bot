import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { RandomColor, PlayerColor } from './types'

type Player = {
  readonly start_balance: number
  balance: number
  step: string
  selectedColor?: PlayerColor
}

type Store = {
  [id: string]: Player
}

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const launchGame = (bot: Telegraf) => {
  const store: Store = {}

  bot.start(async (ctx) => {
    await ctx.reply('Привет пупсик))) Это казино) Давай нам все деньги или мы сами заберём)))')
    await ctx.reply('Введите стартовый баланс')
  })

  bot.on(message('text'), async (ctx) => {
    const chatId = String(ctx.chat.id)
    const player = store[chatId]

    if (!player) {
      return inputStartBalance(ctx)
    }

    if (player.step === 'inputPlayerColor') {
      const userInputColor = ctx.message.text
      const color = await PlayerColor(ctx, userInputColor)
      if (color) {
        player.selectedColor = color
        await ctx.reply(`Вы выбрали цвет: ${color}`)
        player.step = 'bet'
        await ctx.reply('Теперь введите вашу ставку.')
      }
      return
    }

    if (player.step === 'bet') {
      const betAmount = Number(ctx.message.text)
      if (!isFinite(betAmount)) {
        await ctx.reply('Введите число.')
        return
      }
      if (betAmount <= 0 || betAmount > player.balance) {
        await ctx.reply('Ставка должна быть больше нуля и не превышать ваш баланс.')
        return
      }

      const aiColor = colorAi()
      await ctx.reply(`AI выбрал цвет: ${aiColor}`)

      if (player.selectedColor === aiColor) {
        player.balance += betAmount
        await ctx.reply(`Вы выиграли! Ваш новый баланс: ${player.balance}`)
      } else {
        player.balance -= betAmount
        await ctx.reply(`Вы проиграли. Ваш новый баланс: ${player.balance}`)
      }

      if (player.balance <= 0) {
        await ctx.reply('Ваш баланс равен нулю. Игра окончена.')
        delete store[chatId]
        return
      }

      player.step = 'playerWantContinue'
      await ctx.reply('Хотите сыграть ещё? (Да/Нет)')
      return
    }

    if (player.step === 'playerWantContinue') {
      const userInput = ctx.message.text.toLowerCase()
      if (userInput === 'да') {
        player.step = 'inputPlayerColor'
        await ctx.reply('Выберите цвет: "Красный" или "Чёрный".')
      } else if (userInput === 'нет') {
        await ctx.reply('Спасибо за игру! Ваш финальный баланс: ' + player.balance)
        delete store[chatId]
      } else {
        await ctx.reply('Пожалуйста, ответьте "Да" или "Нет".')
      }
      return
    }

    await ctx.reply('Неизвестная команда.')
  })

  async function PlayerColor(ctx: any, input: string): Promise<PlayerColor | null> {
    switch (input) {
      case 'Красный':
        return 'red'
      case 'Чёрный':
        return 'black'
      default:
        await ctx.reply('Неверный цвет. Выберите "Красный" или "Чёрный".')
        return null
    }
  }

  async function inputStartBalance(ctx: any) {
    const chatId = String(ctx.chat.id)
    const startBalance = Number(ctx.message.text)

    if (!isFinite(startBalance)) {
      await ctx.reply('Введите число.')
      return
    }
    if (startBalance <= 0) {
      await ctx.reply('Баланс должен быть больше нуля.')
      return
    }

    store[chatId] = {
      start_balance: startBalance,
      balance: startBalance,
      step: 'inputPlayerColor',
    }

    await ctx.reply(`Баланс установлен: ${startBalance}. Теперь выберите цвет: "Красный" или "Чёрный".`)
  }

  function colorAi(): RandomColor {
    const randomValue = getRandomIntInclusive(0, 100)

    if (randomValue <= 30) {
      return 'black'
    } else if (randomValue <= 60) {
      return 'red'
    } else {
      return 'green'
    }
  }
}