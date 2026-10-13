import { createApp } from './app.ts';
import { SERVICE_NAME } from './core/index.ts';

const DEFAULT_PORT = 3000;
const port = Number(process.env.PORT ?? DEFAULT_PORT);

createApp().listen(port, () => {
  console.info(`${SERVICE_NAME} listening on port ${String(port)}`);
});
