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

// https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
Date.prototype.getWeekNumber = function(){
  var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
  var dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
};

function createImageURL(location) {
  // TODO: The images are not usually updated in time so we would need a to fallback on previous weeks data
  const currentWeek = (new Date).getWeekNumber() - 1; //Data is always from the previous week
  let url = `https://unisport.fi/sites/default/files/styles/content_image_2xl/public/media/images/Viikko%20${currentWeek}%20-%20${location}.jpg`;
  return url;
};

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

bot.on('/start', (msg) => msg.reply.text('Welcome!'));
bot.on('/kluuvi', (msg) => {
  return msg.reply.photo(createImageURL("Kluuvi"));
});
bot.on('/kumpula', (msg) => {
  return msg.reply.photo(createImageURL("Kumpula"));
});
bot.on('/meilahti', (msg) => {
  return msg.reply.photo(createImageURL("Meilahti"));
});
bot.on('/otaniemi', (msg) => {
  return msg.reply.photo(createImageURL("Otaniemi"));
});
bot.on('/toolo', (msg) => {
  return msg.reply.photo(createImageURL("Töölö"));
});

bot.start();