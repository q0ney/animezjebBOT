const tmi = require('tmi.js');

const config = {
  options: { debug: true },
  connection: {
    reconnect: true,
  },
  identity: {
    username: 'botname',
    password: 'oauth',
  },
  channels: ['#channel'],
};

const client = new tmi.client(config);

client.connect();





client.on('connected', (address, port) => {
  console.log(`Connected to ${address}:${port}`);
  sendMessageWithDelay('#channel', 'siema polonczylem sie z czatem', 2000);
  sendMessageWithDelay('#channel', 'som tu jakies alternatywki? SNIFFA', 2000);
});

client.on('message', (channel, userstate, message, self) => {
  if (!self) {
    handleCommands(channel, userstate['display-name'], message);
  }
});

const messageQueue = [];

function sendMessageWithDelay(channel, message, delay) {
  messageQueue.push({ channel, message, delay });

  if (messageQueue.length === 1) {
    processQueue();
  }
}

function processQueue() {
  if (messageQueue.length === 0) {
    return;
  }

  const { channel, message, delay } = messageQueue[0];
  client.say(channel, message);

  setTimeout(() => {
    messageQueue.shift(); 
    processQueue(); 
  }, delay);
}

const zbanowani = ['cekolak', 'itacherbiceps', 'shini_waifu'];
zbanowani.sort();

const juzbylZjeb = []

function handleCommands(channel, username, message) {
  const trimmedMessage = message.trim().toLowerCase();
  let elo = zbanowani.find(user => user === username);

  
    if(!elo){
        const mentionBot = /^@animezjebbot/i; 
        if (mentionBot.test(trimmedMessage)) {
          sendMessageWithDelay(channel, `czego`, 1000);
        }

      if (trimmedMessage === '!zjeb') {
        const zjebPrecentage = Math.floor(Math.random() * 101); 
        const byljusz = juzbylZjeb.find(user => user.nick === username);

        if(!byljusz){
            sendMessageWithDelay(channel, `@${username} jest zjebem w ${zjebPrecentage}% aha`, 1000);
            const obj = {};
            obj["nick"] = username;
            obj["procent"] = zjebPrecentage;
            juzbylZjeb.push(obj);
        }else {
            sendMessageWithDelay(channel, `@${username} jest zjebem w ${byljusz.procent}% aha`, 1000);

        }
      }
    
      if (trimmedMessage === 'sigma') {
        sendMessageWithDelay(channel, `@q0ney sigma @itacherbiceps ligma`, 1000);
      }
    
      if (trimmedMessage === '!cekolak') {
        sendMessageWithDelay(channel, `@cekolak pierdolsie`, 1000);
      }
    
    }
 
}
