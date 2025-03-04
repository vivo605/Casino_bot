// import { randomInt } from 'node:crypto' // [min..max)
import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'

type PlayerColor = 'red' | 'black'
type RandomColor = PlayerColor | 'green'
type step_player = 'inputPlayerColor' | 'inputBet' | 'playerWantContinue'

type Player = {
  readonly start_balance: number
  balance: number
  step: step_player
  selectedColor?: PlayerColor
}

type Store = {
  [id: string]: Player
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
      return inputStartBalance()
    }

    if (player.step === 'inputPlayerColor') {
      return inputPlayerColor(player)
    }

    if (player.step === 'inputBet') {
      return inputBet(player)
    }

    if (player.step === 'playerWantContinue') {
      return playerWantContinue(player)
    }

    await ctx.reply('Неизвестная команда.')

    // события

    async function inputStartBalance() {
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

    async function inputPlayerColor(player: Player) {
      const userInputColor = ctx.message.text
      const color = PlayerColor[userInputColor]

      if (!color) {
        await ctx.reply('Неверный цвет. Выберите "Красный" или "Чёрный".')
        return
      }

      player.selectedColor = color
      await ctx.reply(`Вы выбрали цвет: ${translateColor[color]}`)
      player.step = 'inputBet'
      await ctx.reply('Теперь введите вашу ставку.')
    }

    async function inputBet(player:Player) {
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
      await ctx.reply(`AI выбрал цвет: ${translateColor[aiColor]}`)

      if (player.selectedColor === aiColor) {
        player.balance += betAmount
        await ctx.reply(`Вы выиграли! Ваш новый баланс: ${player.balance}`)
      } else {
        player.balance -= betAmount
        await ctx.reply(`Вы проиграли. Ваш новый баланс: ${player.balance}`)
      }

      if (player.balance <= 0) {
        await ctx.reply('Ваш баланс равен нулю.')
        delete store[chatId]
        return
      }

      player.step = 'playerWantContinue'
      await ctx.reply('Хотите сыграть ещё? (Да/Нет)')
      return
    }

    async function playerWantContinue(player: Player) {
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
    }
  })
}

const PlayerColor: Record<string, PlayerColor> = {
  'Красный': 'red',
  'Чёрный': 'black',
}
// function PlayerColor(input: string): PlayerColor | null {
//   switch (input) {
//     case 'Красный':
//       return 'red'
//     case 'Чёрный':
//       return 'black'
//     default:
//       return null
//   }
// }

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

function getRandomIntInclusive(min: number, max: number) { 
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const translateColor: Record<RandomColor, string> = {
  red: 'красный',
  black: 'чёрный',
  green: 'зелённый',
}
// function translateColor(color: RandomColor): string {
//   switch (color) {
//     case 'red': return 'красный'
//     case 'black': return 'чёрный'
//     case 'green': return 'зелённый'
//   }
// }
