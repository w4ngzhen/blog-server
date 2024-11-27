import { Hono } from 'hono';
import { cors } from 'hono/cors';

import callback from './routes/gh/callback.ts';
import proxy from './routes/gh/proxy.ts';

const app = new Hono();

app.use('*', cors());

app.get('/', (c) => c.text('Hello Blog Comment Server!'));

app.all('/gh/proxy/:link{.*}', proxy);
app.get('/gh/callback', callback);

export default app;
