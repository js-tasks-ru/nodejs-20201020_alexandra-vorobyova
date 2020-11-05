const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let promises = [];

router.get('/subscribe', async (ctx, next) => {
    const message = await new Promise((resolve) => {
        promises.push(resolve);
    });
    ctx.status = 200;
    ctx.body = message;
    return next();
});

router.post('/publish', async (ctx, next) => {
    const message = ctx.request.body.message;

    if (!message) {
        return next();
    }

    for await (const p of promises) {
        p(ctx.request.body.message);
    }

    promises = [];
    ctx.status = 201;
    ctx.body = 'ok';
    return next();
});

app.use(router.routes());

module.exports = app;
