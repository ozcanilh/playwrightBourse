/**
 * TextBoxPage - Page Object (selectors only)
 * URL: https://demoqa.com/text-box
 */
class TextBoxPage {
  constructor(page) {
    this.page = page;
    this.url = '/text-box';

    this.fullNameInput = page.locator('#userName');
    this.emailInput = page.locator('#userEmail');
    this.currentAddressInput = page.locator('#currentAddress');
    this.permanentAddressInput = page.locator('#permanentAddress');
    this.submitButton = page.locator('#submit');

    this.outputBox = page.locator('#output');
    this.outputName = page.locator('#output #name');
    this.outputEmail = page.locator('#output #email');
    this.outputCurrentAddress = page.locator('#output').locator('p#currentAddress');
    this.outputPermanentAddress = page.locator('#output').locator('p#permanentAddress');
  }
}

module.exports = { TextBoxPage };
