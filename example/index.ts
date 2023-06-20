import denoExpress, { Context, NextFunction } from '../src/mod.ts';

const app = denoExpress()

app.use((ctx, next) => {
  console.log('$---use 1');
  next()
})

app.use((ctx, next) => {
  console.log('$---use 2');
  next()
})

app.get('/', (ctx: Context, next: NextFunction) => {
  console.log('$---home get');
  ctx.reponse = '111'
  next()
})

app.get('/user', (ctx: Context, next: NextFunction) => {
  console.log('$---user get');
  ctx.send('user 2222')
})

app.listen({ port: 3000 }, () => {
  console.log('服务运行于： http://localhost:3000');
})