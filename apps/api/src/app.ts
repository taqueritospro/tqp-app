import express from 'express';
import { SERVICE_NAME } from './core/index.ts';

export const createApp = () => {
  const app = express();

  app.get('/', (_request, response) => {
    response.json({ service: SERVICE_NAME, status: 'ok' });
  });

  return app;
};
