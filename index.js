const TelegramBot = require('node-telegram-bot-api')
const {gameOptions, playAgainBtn} = require('./options')
const token = '2009362660:AAFUhCrU52dq3VBAVj-5TbxRHvRTsxahCfc'

const bot = new TelegramBot(token, {polling: true})

const chats = []

const createNumber = async (chatId) => {
  bot.sendMessage(chatId, `Now I will think of a number from 1 to 9. Try to guess it ;)`)
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber
  await bot.sendMessage(chatId, `Now you can guess `, gameOptions)
}

const start = () => {
  bot.setMyCommands([
    {command: '/start', description : 'Start this bot'},
    {command: '/info', description : 'Get info about user'},
    {command: '/game', description : 'Play "guess a number" game'}
  ])

  
  bot.on('message', async msg => {
  
    const text = msg.text
    const chatId = msg.chat.id
  
    switch(text){
      case '/start':
        return bot.sendMessage(chatId, `Welcome, I am Barskiy bot :) `)
        break;
      case '/info':
        return bot.sendMessage(chatId, `Your name is ${msg.from.first_name} ${msg.from.last_name} `)
        break;
      case '/game':
        return createNumber(chatId)
        break;
    }
    return bot.sendMessage(chatId, `I can't understand you. Please try again (`)
  
  })

  bot.on('callback_query',  msg => {
    const data = msg.data
    const chatId = msg.message.chat.id

    if(data === '/again'){
      return createNumber(chatId)
    } else if(+data === chats[chatId]) {
       bot.sendMessage(chatId, `Congratulations, you guessed number ${data}!!!!!`)
      return bot.sendSticker(chatId, './sticker/AnimatedSticker.tgs')
    } else{
      return bot.sendMessage(chatId, `Unfortunately, bot thought of number ${chats[chatId]}.\nYou can try again :)`, playAgainBtn)
    }
  })

}

start()