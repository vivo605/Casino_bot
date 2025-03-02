import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'

type Player = {
  readonly start_balance: number
  balance: number
  step: string
}

type PlayerColor = 'red' | 'black'

type Store = {
  [id: string]: Player
}

/*
  startBalance
  playerColor
  bet
  playerWantContinue
*/

export const launchGame = (bot: Telegraf) => {
  const store: Store = {}

  bot.start(async (ctx) => {
    await ctx.reply(
      'Привет пупсик))) Это казино) Давай нам все деньги или мы сами заберём)))'
    )
    await ctx.reply('Введите стартоывй баланс')
  })

  bot.on(message('text'), async (ctx) => {
    const chatId = ctx.chat.id
    const player = store[chatId]

    if (!player) {
      return inputStartBalance()
    }

    if (player.step === 'inputPlayerColor') {
      const userInputColor = ctx.message.text
      const color = await PlayerColor(userInputColor) 
      await ctx.reply(`Вы выбрали цвет: ${color}`)
      player.step = 'bet'
      return
    }

    await ctx.reply('Неизвестная команда.')
    
    /* Действия */

    async function PlayerColor(input: string): Promise<PlayerColor | null> {
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

    async function inputStartBalance() {
      const chatId = String(ctx.chat.id) // Приводим chatId к строке
      const startBalance = Number(ctx.message.text)
  
      if (!isFinite(startBalance) || startBalance <= 0) {
        await ctx.reply('Введите число больше нуля.')
        return
      }
  
      store[chatId] = {
        start_balance: startBalance,
        balance: startBalance,
        step: 'inputPlayerColor', // Переход к следующему шагу
      }
  
      await ctx.reply(`Баланс установлен: ${startBalance}. Теперь выберите цвет: "Красный" или "Чёрный".`)
    }
  })
}