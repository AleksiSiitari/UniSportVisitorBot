const http = require('http');
const TeleBot = require('telebot');

const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

bot.on('/start', (msg) => msg.reply.text('Welcome!'));
bot.on('/kluuvi', (msg) => {
  return msg.reply.photo('https://unisport.fi/sites/default/files/styles/content_image_l/public/media/images/Viikko%2038%20-%20Kluuvi.jpg?itok=7ne4C-jt/get');
});
bot.on('/kumpula', (msg) => {
  return msg.reply.photo('https://unisport.fi/sites/default/files/styles/content_image_l/public/media/images/Viikko%2038%20-%20Kumpula.jpg?itok=gWAdCQja/get');
});
bot.on('/meilahti', (msg) => {
  return msg.reply.photo('https://unisport.fi/sites/default/files/styles/content_image_l/public/media/images/Viikko%2038%20-%20Meilahti.jpg?itok=-jVdotjz/get');
});
bot.on('/otaniemi', (msg) => {
  return msg.reply.photo('https://unisport.fi/sites/default/files/styles/content_image_l/public/media/images/Viikko%2038%20-%20Otaniemi.jpg?itok=0w9KWdQT/get');
});
bot.on('/toolo', (msg) => {
  return msg.reply.photo('https://unisport.fi/sites/default/files/styles/content_image_l/public/media/images/Viikko%2038%20-%20T%C3%B6%C3%B6l%C3%B6.jpg?itok=NfR4-zlT/get');
});

bot.start();