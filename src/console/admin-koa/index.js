const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const views = require('koa-views');
const json = require('koa-json');
const convert = require('koa-convert');
const bodyparser = require('koa-bodyparser')();
const http = require('http');

const index = require('./routes/index');

// middlewares
app.use(convert(bodyparser));
app.use(convert(json()));

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}));

router.use('/', index.routes(), index.allowedMethods());

app.use(router.routes(), router.allowedMethods());

var server = http.createServer(app.callback());

server.listen(3000);