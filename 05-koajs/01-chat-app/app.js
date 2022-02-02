//npm test -- --grep "koajs/chat-app"
const path = require('path');
const Koa = require('koa');
const app = new Koa();
const { EventEmitter } = require('events');

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
const chatEvent = new EventEmitter();

router.get('/subscribe', async (ctx, next) => {
  await new Promise((resolve) => chatEvent.once('message', (message) => {
    ctx.body = message;
    resolve(true);
  }));
});

router.post('/publish', async (ctx, next) => {
  if (ctx.request.body.message) {
    chatEvent.emit('message', ctx.request.body.message);
    ctx.body = 'Publish';
  } else {
    ctx.body = 'Need message';
    ctx.status = 400;
  }
});

app.use(router.routes());

module.exports = app;
