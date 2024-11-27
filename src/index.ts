import { Hono } from 'hono';
import { cors } from 'hono/cors';

import callback from './routes/callback.ts';
import proxy from './routes/proxy.ts';

const app = new Hono();

app.use('*', cors());

app.get('/', (c) => c.text('Hello Blog Comment Server!'));

app.all('/proxy/:link{.*}', proxy);
app.get('/callback', callback);

export default app;
