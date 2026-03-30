import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { config } from 'dotenv';
import express from 'express';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

loadNorthstarEnv();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const mediaRoot = resolveMediaRoot();
  app.enableCors({
    origin: [
      'http://127.0.0.1:3010',
      'http://localhost:3010',
      'http://127.0.0.1:8081',
      'http://localhost:8081',
      'http://127.0.0.1:8082',
      'http://localhost:8082',
      'http://127.0.0.1:8083',
      'http://localhost:8083',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  if (mediaRoot) {
    app.use('/media', express.static(mediaRoot));
  }
  app.enableShutdownHooks();
  const port = process.env.PORT ?? 3001;
  const host = process.env.HOST ?? '0.0.0.0';
  await app.listen(port, host);
  console.log(`Northstar API listening on http://${host}:${port}`);
}

bootstrap();

function loadNorthstarEnv() {
  const candidates = [
    resolve(process.cwd(), '.env'),
    resolve(process.cwd(), '../../.env'),
    resolve(__dirname, '../../../.env'),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      config({ path: candidate, override: false });
      return;
    }
  }
}

function resolveMediaRoot() {
  const candidates = [
    resolve(process.cwd(), 'services', 'api', 'public', 'media'),
    resolve(process.cwd(), 'public', 'media'),
    resolve(__dirname, '../public/media'),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}
