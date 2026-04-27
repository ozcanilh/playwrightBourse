const path = require('path');
const { test, expect } = require('@playwright/test');
const { PracticeFormPage } = require('../../pages/practiceFormPage');

test.describe('Practice Form', () => {
  test.beforeEach(async ({ page }) => {
    const p = new PracticeFormPage(page);
    await page.goto(p.url);
    // demoqa pushes ad/iframe content that can overlap the submit button -> hide it.
    await page.addStyleTag({
      content: `
        #fixedban, footer, #adplus-anchor, [id^="google_ads_iframe"] { display: none !important; }
        body { padding-bottom: 0 !important; }
      `,
    });
    await expect(p.firstNameInput).toBeVisible();
  });

  test('Submits valid data and shows confirmation with submitted values', async ({ page }) => {
    const p = new PracticeFormPage(page);
    const data = {
      firstName: 'Ozcan',
      lastName: 'Ilhan',
      email: 'ozcan.ilhan@example.com',
      mobile: '5301234567',
      currentAddress: 'Levent Mah. 1. Cad. No:10, Istanbul',
      state: 'Rajasthan',
      city: 'Jaipur',
      dob: { day: 15, month: 'May', monthIndex: 4, year: 1990 },
      pictureFile: 'avatar.png',
    };
    const pictureAbsolutePath = path.resolve(__dirname, '../../fixtures/data', data.pictureFile);

    await test.step('Fill personal and contact fields', async () => {
      await p.firstNameInput.fill(data.firstName);
      await p.lastNameInput.fill(data.lastName);
      await p.emailInput.fill(data.email);
      await p.genderMaleLabel.click();
      await p.mobileInput.fill(data.mobile);
    });

    await test.step('Set date of birth', async () => {
      await p.dateOfBirthInput.click();
      await p.dobMonthSelect.selectOption(String(data.dob.monthIndex));
      await p.dobYearSelect.selectOption(String(data.dob.year));
      await p.dobDay(data.dob.day).click();
    });

    await test.step('Hobbies, picture, and address', async () => {
      await p.hobbiesSportsLabel.click();
      await p.pictureUploadInput.setInputFiles(pictureAbsolutePath);
      await p.currentAddressInput.fill(data.currentAddress);
    });

    await test.step('State and city (react-select)', async () => {
      await p.stateContainer.click();
      await p.reactSelectOption(data.state).click();
      await p.cityContainer.click();
      await p.reactSelectOption(data.city).click();
    });

    await test.step('Submit', async () => {
      await p.submitButton.click();
    });

    await test.step('Verify confirmation modal', async () => {
      await expect(p.confirmationModal).toBeVisible();
      await expect(p.confirmationTitle).toHaveText('Thanks for submitting the form');
      await expect(p.rowValueLocator('Student Name')).toHaveText(
        `${data.firstName} ${data.lastName}`,
      );
      await expect(p.rowValueLocator('Student Email')).toHaveText(data.email);
      await expect(p.rowValueLocator('Gender')).toHaveText('Male');
      await expect(p.rowValueLocator('Mobile')).toHaveText(data.mobile);
      await expect(p.rowValueLocator('Date of Birth')).toHaveText(
        `${data.dob.day} ${data.dob.month},${data.dob.year}`,
      );
      await expect(p.rowValueLocator('Hobbies')).toHaveText('Sports');
      await expect(p.rowValueLocator('Picture')).toHaveText(data.pictureFile);
      await expect(p.rowValueLocator('Address')).toHaveText(data.currentAddress);
      await expect(p.rowValueLocator('State and City')).toHaveText(`${data.state} ${data.city}`);
    });
  });

  test('Submitting empty form does not open the confirmation modal and required fields are invalid', async ({
    page,
  }) => {
    const p = new PracticeFormPage(page);

    await test.step('Submit with empty required fields', async () => {
      await p.submitButton.click();
    });

    await test.step('Expect no modal; HTML5 validation on required inputs', async () => {
      await expect(p.confirmationModal).toHaveCount(0);
      await expect(p.firstNameInput).toHaveJSProperty('validity.valid', false);
      await expect(p.lastNameInput).toHaveJSProperty('validity.valid', false);
      await expect(p.mobileInput).toHaveJSProperty('validity.valid', false);
    });
  });

  test('negative: invalid mobile number (less than 10 digits) keeps the form invalid', async ({
    page,
  }) => {
    const p = new PracticeFormPage(page);

    await test.step('Fill partial data with invalid mobile', async () => {
      await p.firstNameInput.fill('Ozcan');
      await p.lastNameInput.fill('Ilhan');
      await p.genderMaleLabel.click();
      await p.mobileInput.fill('123');
    });

    await test.step('Submit and assert validation', async () => {
      await p.submitButton.click();
      await expect(p.confirmationModal).toHaveCount(0);
      await expect(p.mobileInput).toHaveJSProperty('validity.valid', false);
    });
  });
});
