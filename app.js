const http = require('http');
const config = require('./config');
const TeleBot = require('telebot');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

const bot = new TeleBot(config.TELEGRAM_BOT_TOKEN);

bot.on('/start', (msg) => msg.reply.text('Welcome!'));