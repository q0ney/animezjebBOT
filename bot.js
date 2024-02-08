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
  channels: ['#channelname'],
};

const client = new tmi.client(config);

client.connect();

client.on('connected', (address, port) => {
  console.log(`Connected to ${address}:${port}`);
  sendMessageWithDelay('#channelname', 'siema polonczylem sie z czatem', 2000); // wiadomosc powitalna jak bot sie polaczy
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

const zbanowani = []; // zbanowani uzytkownicy ktorzy nie moga korzystac z bota
zbanowani.sort();
let raffleArray = [] // array z osobami ktore biora udzial w losowaniu
let raffleOn = false

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

      const alreadyJoined = raffleArray.find(e => e === username) // sprawdzenie czy juz dolaczyl

      //ROZPOCZECIE LOSOWANIA
      if(!raffleOn){
        if (trimmedMessage === "!sraffle"){
          raffleOn = true
          sendMessageWithDelay(channel, `Rozpoczento losowanie na talon wpsiz "!dajciemigo" aby dołączyć`, 1000);
        }
      }

      //DOLACZANIE DO LOSOWANIA
      if(raffleOn){
        if(trimmedMessage === "!dajciemigo"){
          if(alreadyJoined){
            sendMessageWithDelay(channel, `@${username} jusz dolonczyles opanuj sie aok`, 1000);
          }else {
            sendMessageWithDelay(channel, `@${username} pomyslnie dolonczyles powodzenia`, 1000);
            raffleArray.push(username)
          }
        }
      }
      //ZATRZYMANIE LOSOWANIA
      if(raffleOn){
        if(trimmedMessage === "!stopraffle"){
            sendMessageWithDelay(channel, `Zatrzymano losowanie aok`, 1000);
            raffleOn = false
            raffleArray = []
        }
      }

      //LOSOWANIE ZWYCIEZCY
      if(raffleArray.length > 0 && raffleOn){
        if(trimmedMessage === "!drawwinner"){
          let winner = raffleArray[Math.round(Math.random()*(raffleArray.length-1))]
          sendMessageWithDelay(channel, `Talon wygrał @${winner} brawo Clap`, 1000);
          raffleOn = false
          raffleArray = []

        }
      }
    
    }
 
}
