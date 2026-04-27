/**
 * PracticeFormPage - Page Object (selectors only)
 * URL: https://demoqa.com/automation-practice-form
 */
class PracticeFormPage {
  constructor(page) {
    this.page = page;
    this.url = '/automation-practice-form';

    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.emailInput = page.locator('#userEmail');
    this.genderMaleLabel = page.locator('label[for="gender-radio-1"]');
    this.mobileInput = page.locator('#userNumber');

    this.dateOfBirthInput = page.locator('#dateOfBirthInput');
    this.dobMonthSelect = page.locator('.react-datepicker__month-select');
    this.dobYearSelect = page.locator('.react-datepicker__year-select');
    this.dobDay = (day) =>
      page.locator(
        `.react-datepicker__day--${String(day).padStart(3, '0')}:not(.react-datepicker__day--outside-month)`,
      );

    this.subjectsInput = page.locator('#subjectsInput');
    this.hobbiesSportsLabel = page.locator('label[for="hobbies-checkbox-1"]');
    this.pictureUploadInput = page.locator('#uploadPicture');
    this.currentAddressInput = page.locator('#currentAddress');

    this.stateContainer = page.locator('#state');
    this.cityContainer = page.locator('#city');
    this.reactSelectOption = (text) =>
      page.locator('[id^="react-select"][id*="-option"]', { hasText: text });

    this.submitButton = page.locator('#submit');

    this.confirmationModal = page.locator('.modal-content');
    this.confirmationTitle = page.locator('#example-modal-sizes-title-lg');
    this.confirmationTable = page.locator('.table-responsive');
  }

  rowValueLocator(label) {
    return this.confirmationTable.locator('tr', { hasText: label }).locator('td').nth(1);
  }
}

module.exports = { PracticeFormPage };
