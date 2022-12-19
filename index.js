//import stuff
const mineflayer = require('mineflayer')
const { mineflayer: mineflayerViewer } = require('prismarine-viewer')
const { Client, Intents} = require('discord.js')
const intents = new Intents(['GUILDS', 'GUILD_MESSAGES'])
const client = new Client({
  intents
})

const bot = mineflayer.createBot({
  host: 'localhost',
  username: '', //email here for premium
  //password: 'pass', use this if you want to use premium account
  //auth: 'microsoft' , if you want to use microsoft alt (premium account)
  //version: '1.8.8' in case you want to use a version not 1.19.1
})

//Reconnect on disconnected
bot.on('end', function () {
    console.log("Disconnected. Waiting 10 seconds")
    bot.quit();
    lasttime = -1;
    moving = 0;
    connected=0;
    bot = mineflayer.createBot({
        host: 'localhost',
        username: '', //email here for premium
        //password: 'pass', use this if you want to use premium account
        //auth: 'microsoft' , if you want to use microsoft alt (premium account)
        //version: '1.8.8'
    });
    console.log("reconnected.")
});

let channel = '0' //discord channel id here

bot.on('time', () => {
});

bot.on('chat', (username, message) => {
  client.channels.cache.get(channel).send(username + " : " + message)
})

bot.on('message', (jsonMsg) => {
  
})

//Too lazy to do stuff so i just gonna do it like this
client.on('messageCreate', message => {
  if (message.channel.id !== channel) return
  if (message.author.id === client.user.id) return
  //Controlling a bot
  if(message.content.startsWith('!')) {
    if(message.content === '!forward') bot.setControlState('forward',true);
    if(message.content === '!backward') bot.setControlState('back',true);
    if(message.content === '!left') bot.setControlState('left',true);
    if(message.content === '!right') bot.setControlState('right',true);
    if(message.content === '!unsneak') bot.setControlState('sneak',false);
    if(message.content === '!sneak') bot.setControlState('sneak',false);
    if(message.content === '!jump') bot.setControlState('jump',true);
    if(message.content === '!stop') {
      bot.setControlState('forward',false);
      bot.setControlState('back',false);
      bot.setControlState('left',false);
      bot.setControlState('right',false);
      bot.setControlState('sneak',false);
      bot.setControlState('jump',false);
    }
    return
  }
  bot.chat(`${message.author.tag}: ${message.content}`)
})


bot.once('spawn', () => {
  mineflayerViewer(bot, { port: 3007, firstPerson: false }) 
  const path = [bot.entity.position.clone()]
  bot.on('move', () => {
    if (path[path.length - 1].distanceTo(bot.entity.position) > 1) {
      path.push(bot.entity.position.clone())
      bot.viewer.drawLine('path', path)
    }
  })
});

// Log errors and kick reasons:
bot.on('kicked', console.log)
bot.on('error', console.log)

client.login('your token')
