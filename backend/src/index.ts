import { Hono } from 'hono'
import { userRouter } from './routes/user';
import { blogRouter } from './routes/blog';
import { cors } from 'hono/cors';

const app = new Hono<{
  Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string,
	}
}>();
app.use('/*', cors());
// app.use('/*', cors({
//   origin: (origin) => {
//     // allow localhost and your deployed frontend
//     const allowedOrigins = ['http://localhost:5173', 'https://yourfrontend.com'];
//     return allowedOrigins.includes(origin) ? origin : '';
//   },
//   credentials: true,
//   allowHeaders: ['Content-Type', 'Authorization'],
//   allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// }));

app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

export default app


