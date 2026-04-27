# Playwright Bourse - Test Automation Project

Playwright test automation framework covering Tasks 4-7 of the assignment.

## Quick Start

```bash
npm install
npm run pw:install                # Install Playwright browsers
npm run pw:open                   # Open Playwright UI mode
npm run pw:run                    # Run all tests (all projects)
npm run pw:run:chromium           # Run all tests in Chromium
npm run pw:run:firefox            # Run all tests in Firefox
npm run pw:run:webkit             # Run all tests in WebKit
npm run pw:run:headed             # Run with browser visible
npm run pw:report                 # Open the last Playwright HTML report
npm run allure:serve              # Generate + serve Allure report (live)
npm run allure:generate           # Generate Allure HTML to ./allure-report
npm run allure:open               # Open the generated Allure report
npm run clean:reports             # Clean reports
```

## Run A Single Test (Spec)

```bash
npm run pw:run:spec -- "tests/0_text-box/text-box.spec.js"
npm run pw:run:spec -- "tests/1_practice-form/practice-form.spec.js" --project=chromium
npm run pw:run:spec -- "tests/2_api/posts.spec.js"
```

## Project Structure

```
playwrightBourse/
├── .github/workflows/
│   └── playwright.yml             # GitHub Actions CI/CD pipeline
├── .husky/
│   └── pre-commit                 # Git pre-commit hook (Prettier via lint-staged)
├── tests/
│   ├── 0_text-box/                # Task 4 - Text Box UI test
│   ├── 1_practice-form/           # Task 5 - Practice Form positive/negative
│   └── 2_api/                     # Task 6 - API tests via request context
├── pages/                         # Page Objects (selectors only)
│   ├── textBoxPage.js
│   └── practiceFormPage.js
├── fixtures/                      # Static data (e.g. upload test files)
│   └── data/avatar.png
├── scripts/
│   └── send_slack_message.js      # Slack notification (CI)
├── playwright.config.js           # Playwright configuration 
```

## Architecture: Why This Pattern?

**Page Objects = Selectors Only** | **Playwright = Built-in `page` + `test.step`**

```javascript
const { test, expect } = require('@playwright/test');
const { TextBoxPage } = require('../pages/textBoxPage');

// Page object – locators only
// Test – use the built-in `page` fixture and `test.step` for report sections

test('example', async ({ page }) => {
  const p = new TextBoxPage(page);
  await test.step('Fill and submit', async () => {
    await p.fullNameInput.fill('Ozcan');
    await p.submitButton.click();
  });
});
```

**Why?**

- **No custom `test.extend`:** The official `page`, `context`, and `request` fixtures are enough for these specs
- **Reporting:** `test.step()` shows nested steps in the HTML report and trace (Playwright’s own mechanism)
- **Auto-waiting:** `expect(locator)` retries automatically; no fixed sleeps

## Task Coverage

### Task 7 - Failure Diagnostics (`playwright.config.js`)

- `screenshot: 'only-on-failure'`
- `trace: 'on-first-retry'` -> open with `npx playwright show-trace`
- `video: 'retain-on-failure'`
- `retries: 2` on CI
- `reporter: ['list', ['html'], ['json']]` -> `playwright-report/`

When a test fails, every artifact lives under `test-results/<test>/`:

- `screenshot.png`
- `trace.zip` (full timeline + DOM snapshots + network)
- `video.webm`

## Configuration

### GitHub Pages (CI Reports)

1. **Settings -> Pages**
2. **Source:** Deploy from a branch
3. **Branch:** `gh-pages`, Folder: `/` (root)

Reports: `https://<username>.github.io/<repo>/index_<run_number>/`

### Slack Notifications

Set GitHub secrets:

- `SLACK_WEBHOOK_URL` - Slack incoming webhook URL

## CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/playwright.yml`):

1. **`playwright-tests`** runs across **3 native shards** (`--shard=i/3`) using Playwright's blob reporter.
2. **`merge-reports`** downloads the blob artifacts, runs `playwright merge-reports --reporter html` to produce a single HTML report, deploys it to GitHub Pages, and posts a Slack summary.

Triggered on:

- Push to `main`
- Pull request to `main`
- Manual `workflow_dispatch`
- **Daily schedule:** every day at 03:00 UTC (06:00 Istanbul) via cron

Two reports are published per run:

- `playwright_<run>/`  -> Playwright built-in HTML report
- `allure_<run>/`      -> Allure report (with history/trends)

## Features

- Page Object Model (selectors only)
- `test.step()` for structured reporting (built-in)
- Native sharding (3 shards in CI)
- Multi-browser projects: Chromium, Firefox, WebKit
- HTML + JSON + List + Allure reporters, blob reporter for CI merging
- Trace, screenshot and video on failure
- Auto-retries (2x) in CI
- Prettier + Husky pre-commit hooks

---
