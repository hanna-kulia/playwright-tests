// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Завантажуємо потрібний .env файл залежно від ENV_NAME (за замовчуванням .env.qauto)
const envFile = process.env.ENV_NAME ? `.env.${process.env.ENV_NAME}` : '.env.qauto';
dotenv.config({ path: path.resolve(__dirname, envFile) });

export default defineConfig({
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: process.env.BASE_URL,
    httpCredentials: {
      username: process.env.HTTP_CREDENTIALS_USERNAME || '',
      password: process.env.HTTP_CREDENTIALS_PASSWORD || '',
    },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

