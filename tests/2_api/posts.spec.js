const { test, expect, request } = require('@playwright/test');
const env = require('../../config/env');

let apiContext;

test.beforeAll(async () => {
  apiContext = await request.newContext({
    baseURL: env.apiBaseURL,
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
  });
});

test.afterAll(async () => {
  await apiContext.dispose();
});

test('GET /posts returns 200, an array, and first item contains "id"', async () => {
  const response = await test.step('GET /posts', async () => {
    return apiContext.get('/posts');
  });

  await test.step('Assert status and body shape', async () => {
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toHaveProperty('id');
    expect(typeof body[0].id).toBe('number');
  });
});
