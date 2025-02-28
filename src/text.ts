import { RandomColor, translateColor } from './types'

// export const greetingMessage = 'Привет пупсик))) Это казино) Давай нам все деньги или мы сами заберём)))'

export const getResultColor = (color: RandomColor) => {
  return `Выпал ${translateColor(color)} цвет!`
}

export const winnerText = 'Ты молодец, ты победил)'
export const looserText = 'Ты проиграл спасибо за ваши деньги)'

export const getByeMessage = (balance: number, startBalance: number) =>{
  if (balance <= 0){
    return 'Окак, ты бомж)))) Возвращайся с деньгами!'
  }
  else if (balance > startBalance){
    return 'Ты выйграл?)) Иди отсюда))'
  }
  else{
    return 'Ты проиграл?) Ну тогда давай за деньгами иди и обратно сюда отыграть)))'
  }
}
