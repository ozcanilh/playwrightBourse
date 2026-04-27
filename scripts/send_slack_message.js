const axios = require('axios');
const fs = require('fs');
const path = require('path');

const reportPath = path.resolve(__dirname, '../public/results.json');
const runNumber = process.env.GITHUB_RUN_NUMBER;
const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

const repoName = process.env.GITHUB_REPOSITORY
  ? process.env.GITHUB_REPOSITORY.split('/')[1]
  : 'playwrightBourse';
const repoOwner = process.env.GITHUB_REPOSITORY_OWNER || '';
const playwrightReportUrl = `https://${repoOwner}.github.io/${repoName}/playwright_${runNumber}/`;
const allureReportUrl = `https://${repoOwner}.github.io/${repoName}/allure_${runNumber}/`;

const runBy = process.env.GITHUB_ACTOR || 'Unknown';
const branch = process.env.GITHUB_REF_NAME || 'Unknown';

if (!slackWebhookUrl || slackWebhookUrl.includes('YOUR')) {
  console.log('SLACK_WEBHOOK_URL not configured, skipping Slack notification.');
  process.exit(0);
}

if (!fs.existsSync(reportPath)) {
  console.error('Playwright JSON report not found at:', reportPath);
  process.exit(0);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

let total = 0;
let passed = 0;
let failed = 0;
let skipped = 0;
let flaky = 0;

const walk = (suites) => {
  for (const suite of suites || []) {
    walk(suite.suites);
    for (const spec of suite.specs || []) {
      for (const t of spec.tests || []) {
        total++;
        const status = t.status || (t.results && t.results[t.results.length - 1]?.status);
        if (status === 'expected') passed++;
        else if (status === 'unexpected') failed++;
        else if (status === 'skipped') skipped++;
        else if (status === 'flaky') flaky++;
      }
    }
  }
};

walk(report.suites);

const durationMs = report.stats?.duration || 0;
const duration = (durationMs / 1000 / 60).toFixed(2) + ' min';
const passPercent = total > 0 ? Math.floor((passed / total) * 100) + '%' : '0%';
const messageColor = failed > 0 ? ':x:' : ':white_check_mark:';

const text =
  `*Playwright Test Results: ${messageColor}*\n` +
  `*Total Tests:* ${total} | *Passed:* ${passed} | *Failed:* ${failed} | *Skipped:* ${skipped} | *Flaky:* ${flaky} | ` +
  `*Pass Percentage:* ${passPercent} | *Duration:* ${duration} | ` +
  `*Run By:* ${runBy} | *Branch:* ${branch} | ` +
  `<${playwrightReportUrl}|Playwright Report> | <${allureReportUrl}|Allure Report>`;

axios
  .post(
    slackWebhookUrl,
    {
      username: 'webhookbot',
      text,
      icon_emoji: ':information_source:',
      mrkdwn: true,
    },
    { headers: { 'Content-Type': 'application/json' } },
  )
  .then(() => console.log('Message sent to Slack successfully.'))
  .catch((error) => console.error('Error sending message to Slack:', error.message));
