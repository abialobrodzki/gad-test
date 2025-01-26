import { Page } from '@playwright/test'

export class BasePage {
  url = ''

  constructor(protected page: Page) {}

  async goto(parameters = ''): Promise<void> {
    //dodano parametr do adresu url
    await this.page.goto(`${this.url}${parameters}`)
  }

  async getTitle(): Promise<string> {
    await this.page.waitForLoadState()
    return this.page.title()
  }

  async waitForPageToLoadUrl(): Promise<void> {
    await this.page.waitForURL(`${this.url}*`)
  }
}
