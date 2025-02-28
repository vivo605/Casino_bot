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
      return PlayerColor()
    }
    
    await ctx.reply('Неизвестная команда.')
    
    /* Действия */

    async function PlayerColor(PlayerColor: string) {
      // if (ctx.message.text == 'Красный'){
      //   return 'Красный'
      // }
      // else{
      //   return 'Чёрный'
      // }
      switch(PlayerColor){
        case 'red':
          return 'Красный'
        case 'black':
          return 'Чёрный'
      }
      return PlayerColor
    }

    async function inputStartBalance() {
      const startBalance = Number(ctx.message.text)
        
      if (!isFinite(startBalance) || startBalance <= 0) {
        await ctx.reply('Введите число больше нуля.')
        return
      }
    
      store[chatId] = {
        start_balance: startBalance,
        balance: startBalance,
        step: 'startBalance',
      }
    }
  })
}