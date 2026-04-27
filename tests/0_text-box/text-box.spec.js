const { test, expect } = require('@playwright/test');
const { TextBoxPage } = require('../../pages/textBoxPage');

test.describe('Text Box Form', () => {
  const formData = {
    fullName: 'Ozcan Ilhan',
    email: 'ozcan.ilhan@example.com',
    currentAddress: 'Levent Mah. 1. Cad. No:10, Istanbul',
    permanentAddress: 'Bagdat Cad. No:42, Kadikoy, Istanbul',
  };

  test.beforeEach(async ({ page }) => {
    const p = new TextBoxPage(page);
    await page.goto(p.url);
    await expect(p.fullNameInput).toBeVisible();
  });

  test('Fills the form, submits, and validates submitted values are displayed', async ({
    page,
  }) => {
    const p = new TextBoxPage(page);

    await test.step('Fill all fields and submit', async () => {
      await p.fullNameInput.fill(formData.fullName);
      await p.emailInput.fill(formData.email);
      await p.currentAddressInput.fill(formData.currentAddress);
      await p.permanentAddressInput.fill(formData.permanentAddress);
      await p.submitButton.click();
    });

    await test.step('Assert output section shows submitted values', async () => {
      await expect(p.outputBox).toBeVisible();
      await expect(p.outputName).toHaveText(`Name:${formData.fullName}`);
      await expect(p.outputEmail).toHaveText(`Email:${formData.email}`);
      await expect(p.outputCurrentAddress).toContainText(formData.currentAddress);
      await expect(p.outputPermanentAddress).toContainText(formData.permanentAddress);
    });
  });
});
